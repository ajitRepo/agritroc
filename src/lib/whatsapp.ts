interface SendResult {
  success: boolean
  messageId?: string
  provider?: string
}

/**
 * Check if WhatsApp Cloud API credentials are configured
 */
export function isOtpChannelConfigured(): boolean {
  return !!(process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID)
}

/**
 * Send OTP verification code via WhatsApp Cloud API template `otp_code`
 */
export async function sendOtp(to: string, otpCode: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneNumberId = process.env.PHONE_NUMBER_ID

  // In development without credentials, log the OTP code to console
  if (!token || !phoneNumberId) {
    console.log('\n======================================================')
    console.log(`📱 [WhatsApp Dev Mode] Code OTP for ${to}: ${otpCode}`)
    console.log('======================================================\n')
    return { success: true, provider: 'dev-console' }
  }

  // Meta format: numbers only without + or spaces
  const phone = to.replace(/[^0-9]/g, '')

  try {
    console.log(`[WhatsApp OTP] Sending code to ${phone}...`)
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: 'otp_code',
            language: { code: 'fr' },
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
        }),
      }
    )

    const data = await response.json()

    if (response.ok && data.messages?.[0]?.id) {
      console.log(`[WhatsApp OTP] Successfully sent to ${phone} | ID: ${data.messages[0].id}`)
      return { success: true, messageId: data.messages[0].id, provider: 'whatsapp' }
    }

    console.error('[WhatsApp OTP] Meta API error:', response.status, data.error?.message || JSON.stringify(data))
    return { success: false, provider: 'whatsapp' }
  } catch (error) {
    console.error('[WhatsApp OTP] Network error:', error)
    return { success: false, provider: 'whatsapp' }
  }
}
