import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import {
  ALLOWED_IMAGE_MIMES,
  IMAGE_FORMATS_LABEL,
  MAX_AVATAR_BYTES,
  MAX_PHOTO_BYTES,
  megabytes,
} from '@/lib/constants'

// Magic bytes for allowed image formats
const IMAGE_SIGNATURES: { bytes: number[]; type: string }[] = [
  { bytes: [0xff, 0xd8, 0xff], type: 'image/jpeg' },
  { bytes: [0x89, 0x50, 0x4e, 0x47], type: 'image/png' },
  { bytes: [0x47, 0x49, 0x46, 0x38], type: 'image/gif' },
  { bytes: [0x52, 0x49, 0x46, 0x46], type: 'image/webp' }, // RIFF header
]

function detectImageType(buffer: ArrayBuffer): string | null {
  const header = new Uint8Array(buffer.slice(0, 12))
  for (const sig of IMAGE_SIGNATURES) {
    if (sig.bytes.every((b, i) => header[i] === b)) {
      if (sig.type === 'image/webp') {
        if (header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50) {
          return sig.type
        }
        continue
      }
      return sig.type
    }
  }
  return null
}

function avatarDeliveryUrl(secureUrl: string): string {
  return secureUrl.replace('/image/upload/', '/image/upload/c_fill,g_face,w_512,h_512,q_auto,f_auto/')
}

const UPLOAD_KINDS = {
  listing: { folder: 'agritroc/listings', maxBytes: MAX_PHOTO_BYTES },
  avatar: { folder: 'agritroc/avatars', maxBytes: MAX_AVATAR_BYTES },
} as const

type UploadKind = keyof typeof UPLOAD_KINDS

/**
 * POST /api/upload
 * Image upload route — Cloudinary if configured, fallback to data-URL / local in development
 * Accepts multipart/form-data with "file" and optional "kind" ("listing" or "avatar")
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req)
    if (!session) {
      return NextResponse.json({ error: 'Authentification requise pour téléverser une image' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    const rawKind = String(formData.get('kind') || 'listing')
    const kind: UploadKind = rawKind in UPLOAD_KINDS ? (rawKind as UploadKind) : 'listing'
    const { folder, maxBytes } = UPLOAD_KINDS[kind]

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Check MIME type
    if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type as any)) {
      return NextResponse.json(
        { error: `Format non accepté. Formats acceptés : ${IMAGE_FORMATS_LABEL}` },
        { status: 400 }
      )
    }

    // Check size
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Image trop volumineuse (max ${megabytes(maxBytes)} Mo)` },
        { status: 400 }
      )
    }

    // Validate magic bytes
    const arrayBuffer = await file.arrayBuffer()
    const detectedType = detectImageType(arrayBuffer)
    if (!detectedType) {
      return NextResponse.json(
        { error: 'Le contenu du fichier ne correspond pas à une image valide' },
        { status: 400 }
      )
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME

    if (cloudName) {
      // === Cloudinary Upload ===
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'agritroc_unsigned')
      uploadData.append('folder', folder)

      let res: Response
      try {
        res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: uploadData }
        )
      } catch (err) {
        console.error('Cloudinary injoignable:', err)
        return NextResponse.json(
          { error: "Le service d'images Cloudinary est momentanément indisponible. Réessayez." },
          { status: 502 }
        )
      }

      if (res.ok) {
        const data = await res.json()
        return NextResponse.json({
          success: true,
          url: kind === 'avatar' ? avatarDeliveryUrl(data.secure_url) : data.secure_url,
          publicId: data.public_id,
        })
      }

      const detail = await res.text().catch(() => '')
      console.error(`Échec Cloudinary (HTTP ${res.status}): ${detail.slice(0, 300)}`)
      return NextResponse.json(
        { error: "Le service d'images a refusé l'envoi. Vérifiez la configuration Cloudinary." },
        { status: 502 }
      )
    }

    // === Mode Développement Local sans Cloudinary : base64 Data URL ===
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${detectedType};base64,${base64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      publicId: 'local-' + Date.now(),
    })
  } catch (error) {
    console.error('Erreur POST /api/upload:', error)
    return NextResponse.json({ error: 'Erreur lors du téléversement de l\'image' }, { status: 500 })
  }
}
