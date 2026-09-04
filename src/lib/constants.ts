export const RESOURCE_TYPES = [
  { value: 'land', label: 'Terre & Parcelles', icon: '🌍', description: 'Terrains agricoles, vergers, parcelles irriguées' },
  { value: 'livestock', label: 'Bétail & Élevage', icon: '🐄', description: 'Bovins, ovins, caprins, volaille' },
  { value: 'seeds', label: 'Semences & Plants', icon: '🌱', description: 'Semences certifiées, boutures, jeunes plants' },
  { value: 'machinery', label: 'Matériel & Machines', icon: '🚜', description: 'Tracteurs, motoculteurs, motopompes, charrues' },
  { value: 'production', label: 'Récoltes & Fourrage', icon: '🌾', description: 'Céréales, légumes, foin, tourteaux, engrais bio' },
  { value: 'other', label: 'Autre ressource', icon: '📦', description: 'Services agricoles, main d\'œuvre, stockage' },
] as const

export const COMPLEMENT_TYPES = [
  { value: 'none', label: 'Troc simple (100% nature)', icon: '🤝', badge: 'Troc simple' },
  { value: 'money', label: 'Troc avec complément financier', icon: '💰', badge: '+ Complément d\'argent' },
  { value: 'other', label: 'Troc avec autre complément', icon: '📋', badge: '+ Autre complément' },
] as const

export const SENEGAL_REGIONS = [
  'Dakar',
  'Thiès',
  'Kaolack',
  'Saint-Louis',
  'Fatick',
  'Diourbel',
  'Louga',
  'Tambacounda',
  'Kolda',
  'Ziguinchor',
  'Matam',
  'Kaffrine',
  'Kédougou',
  'Sédhiou',
] as const

// === PHOTOS D'ANNONCE & AVATARS ===
export const MAX_LISTING_PHOTOS = 4
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024 // 5 Mo
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024 // 2 Mo

export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
export const IMAGE_ACCEPT = ALLOWED_IMAGE_MIMES.join(',')
export const IMAGE_FORMATS_LABEL = 'JPEG, PNG, GIF ou WebP'

export function megabytes(bytes: number): number {
  return Math.round(bytes / (1024 * 1024))
}

export function photoRejectionReason(file: File): string | null {
  if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type)) {
    return `${file.name} : format non accepté (${IMAGE_FORMATS_LABEL})`
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return `${file.name} : trop volumineux (max ${megabytes(MAX_PHOTO_BYTES)} Mo)`
  }
  return null
}
