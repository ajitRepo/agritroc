import { NextResponse } from 'next/server'
import { getWhatsAppConfig } from '@/lib/whatsapp'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const whatsapp = getWhatsAppConfig()

  let dbStatus = 'unknown'
  try {
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch (err) {
    dbStatus = `error: ${err instanceof Error ? err.message : String(err)}`
  }

  const cloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  )

  return NextResponse.json({
    status: 'ok',
    service: 'agritroc',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown',
    database: {
      status: dbStatus,
      type: process.env.DATABASE_URL?.startsWith('postgresql') ? 'postgresql (Supabase)' : 'sqlite',
    },
    whatsapp: {
      configured: whatsapp.configured,
      token: {
        present: !!whatsapp.tokenMasked,
        source: whatsapp.tokenSource || null,
        preview: whatsapp.tokenMasked || null,
      },
      phoneNumberId: {
        present: !!whatsapp.phoneMasked,
        source: whatsapp.phoneSource || null,
        preview: whatsapp.phoneMasked || null,
      },
      template: {
        name: whatsapp.templateName,
        lang: whatsapp.templateLang,
      },
    },
    cloudinary: {
      configured: cloudinaryConfigured,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || null,
    },
  })
}
