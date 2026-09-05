export interface SendResult {
  success: boolean
  messageId?: string
  provider?: string
  error?: string
  devCode?: string
}

export interface WhatsAppConfigInfo {
  configured: boolean
  tokenSource?: string
  phoneSource?: string
  tokenMasked?: string
  phoneMasked?: string
  templateName: string
  templateLang: string
}

function getEnvValue(keys: string[]): { key: string; value: string } | null {
  for (const k of keys) {
    const val = process.env[k]
    if (val && val.trim().length > 0) {
      // Strip accidental leading/trailing quotes (e.g. from copy-pasting .env values into Render)
      const clean = val.trim().replace(/^["']|["']$/g, '').trim()
      if (clean.length > 0) {
        return { key: k, value: clean }
      }
    }
  }
  return null
}

export function getWhatsAppConfig(): WhatsAppConfigInfo {
  const tokenEntry = getEnvValue([
    'WHATSAPP_TOKEN',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_API_TOKEN',
    'META_WHATSAPP_TOKEN',
    'META_ACCESS_TOKEN',
  ])

  const phoneEntry = getEnvValue([
    'PHONE_NUMBER_ID',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_PHONE_ID',
    'META_PHONE_NUMBER_ID',
  ])

  const templateName = (process.env.WHATSAPP_TEMPLATE_NAME || 'otp_code').trim().replace(/^["']|["']$/g, '')
  const templateLang = (process.env.WHATSAPP_TEMPLATE_LANG || 'fr').trim().replace(/^["']|["']$/g, '')

  const token = tokenEntry?.value
  const phoneNumberId = phoneEntry?.value

  return {
    configured: !!(token && phoneNumberId),
    tokenSource: tokenEntry?.key,
    phoneSource: phoneEntry?.key,
    tokenMasked: token ? `${token.slice(0, 8)}...${token.slice(-4)}` : undefined,
    phoneMasked: phoneNumberId ? `${phoneNumberId.slice(0, 4)}***${phoneNumberId.slice(-3)}` : undefined,
    templateName,
    templateLang,
  }
}

/**
 * Check if WhatsApp Cloud API credentials are configured
 */
export function isOtpChannelConfigured(): boolean {
  const config = getWhatsAppConfig()
  return config.configured
}

/**
 * Send OTP verification code via WhatsApp Cloud API
 */
export async function sendOtp(to: string, otpCode: string): Promise<SendResult> {
  const tokenEntry = getEnvValue([
    'WHATSAPP_TOKEN',
    'WHATSAPP_ACCESS_TOKEN',
    'WHATSAPP_API_TOKEN',
    'META_WHATSAPP_TOKEN',
    'META_ACCESS_TOKEN',
  ])

  const phoneEntry = getEnvValue([
    'PHONE_NUMBER_ID',
    'WHATSAPP_PHONE_NUMBER_ID',
    'WHATSAPP_PHONE_ID',
    'META_PHONE_NUMBER_ID',
  ])

  const token = tokenEntry?.value
  const phoneNumberId = phoneEntry?.value

  const templateName = (process.env.WHATSAPP_TEMPLATE_NAME || 'otp_code').trim().replace(/^["']|["']$/g, '')
  const templateLang = (process.env.WHATSAPP_TEMPLATE_LANG || 'fr').trim().replace(/^["']|["']$/g, '')

  const isDev = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_OTP === 'true'

  // If credentials are not configured
  if (!token || !phoneNumberId) {
    const missing: string[] = []
    if (!token) missing.push('WHATSAPP_TOKEN (ou WHATSAPP_ACCESS_TOKEN)')
    if (!phoneNumberId) missing.push('PHONE_NUMBER_ID (ou WHATSAPP_PHONE_NUMBER_ID)')

    console.warn(`[WhatsApp OTP] Configuration manquante sur le serveur : ${missing.join(', ')}`)

    if (isDev) {
      console.log('\n======================================================')
      console.log(`📱 [WhatsApp Dev Mode] Code OTP for ${to}: ${otpCode}`)
      console.log('======================================================\n')
      return {
        success: true,
        provider: 'dev-console',
        devCode: otpCode,
      }
    }

    return {
      success: false,
      error: `Variables WhatsApp introuvables sur Render : ${missing.join(' et ')}. Vérifiez l'onglet Environment de votre service Render.`,
      provider: 'none',
    }
  }

  // Meta format: numbers only without + or spaces
  const phone = to.replace(/[^0-9]/g, '')

  try {
    console.log(`[WhatsApp OTP] Sending code to ${phone} using template '${templateName}' (${templateLang})...`)

    // Attempt 1: Standard OTP template with copy code URL button
    const payloadWithButton = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: templateLang },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: otpCode }],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [{ type: 'text', text: otpCode }],
          },
        ],
      },
    }

    let response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadWithButton),
      }
    )

    let data = await response.json()

    // If template has no button component, retry without button (body only)
    if (!response.ok && data?.error?.message?.toLowerCase().includes('button')) {
      console.log('[WhatsApp OTP] Retrying without button component...')
      const payloadBodyOnly = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLang },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: otpCode }],
            },
          ],
        },
      }

      response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadBodyOnly),
        }
      )
      data = await response.json()
    }

    if (response.ok && data.messages?.[0]?.id) {
      console.log(`[WhatsApp OTP] Successfully sent to ${phone} | ID: ${data.messages[0].id}`)
      return { success: true, messageId: data.messages[0].id, provider: 'whatsapp' }
    }

    // Meta API error parsing
    const metaError = data?.error
    const errorCode = metaError?.code
    const rawMessage = metaError?.message || JSON.stringify(data)

    console.error('[WhatsApp OTP] Meta API error:', response.status, errorCode, rawMessage)

    let userFriendlyError = rawMessage
    if (errorCode === 190) {
      userFriendlyError = "Le token WhatsApp Meta a expiré (token temporaire 24h). Veuillez générer un token d'accès permanent dans Meta Business Suite."
    } else if (errorCode === 131030) {
      userFriendlyError = `Numéro non autorisé en mode test Meta (${phone}). Ajoutez ce numéro dans la liste 'To' sous WhatsApp > API Setup sur developers.facebook.com.`
    } else if (errorCode === 132000 || errorCode === 132001) {
      userFriendlyError = `Le template WhatsApp '${templateName}' n'existe pas ou n'est pas approuvé par Meta pour la langue '${templateLang}'.`
    } else if (errorCode === 100) {
      userFriendlyError = `Format de template rejeté par Meta : ${rawMessage}`
    }

    // If dev/testing allowed, log code to console so developer isn't blocked
    if (isDev) {
      console.log(`📱 [WhatsApp Fallback] Code OTP for ${to}: ${otpCode}`)
    }

    return {
      success: false,
      error: userFriendlyError,
      provider: 'whatsapp',
      devCode: isDev ? otpCode : undefined,
    }
  } catch (error) {
    console.error('[WhatsApp OTP] Network error:', error)
    return {
      success: false,
      error: `Erreur de connexion avec l'API WhatsApp: ${error instanceof Error ? error.message : String(error)}`,
      provider: 'whatsapp',
    }
  }
}
