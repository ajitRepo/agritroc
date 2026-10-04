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

// === VISUELS DES CATÉGORIES ===
export const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

export function categoryIcon(resourceType?: string): string {
  return (resourceType && CATEGORY_ICONS[resourceType]) || '/avatars/avatar-sprout.webp'
}

export function categoryLabel(resourceType?: string): string {
  return RESOURCE_TYPES.find((r) => r.value === resourceType)?.label || 'Autre ressource'
}

// "il y a 3 jours" — plus parlant qu'une date complète sur une carte
export function timeAgo(date?: string | Date | null): string {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return minutes <= 1 ? "À l'instant" : `Il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Il y a ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Hier'
  if (days < 30) return `Il y a ${days} jours`
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// Lien WhatsApp vers un numéro sénégalais, avec message pré-rempli
export function whatsAppUrl(phone?: string, title?: string): string {
  if (!phone) return '#'
  let clean = phone.replace(/[^0-9]/g, '')
  if (clean.startsWith('00221')) {
    clean = clean.substring(2)
  } else if (!clean.startsWith('221') && clean.length === 9) {
    clean = '221' + clean
  }
  const text = `Salam Alaykoum, je vous contacte depuis AgriTroc concernant votre annonce de troc : "${title || ''}". Je souhaite échanger avec vous.`
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
}

// === QUANTITÉS ===
// Unités courantes au Sénégal ; la valeur est stockée en base (offered_unit / wanted_unit)
export const UNITS = [
  { value: 'kg', singular: 'kg', plural: 'kg' },
  { value: 'sac', singular: 'sac', plural: 'sacs' },
  { value: 'tonne', singular: 'tonne', plural: 'tonnes' },
  { value: 'tete', singular: 'tête', plural: 'têtes' },
  { value: 'hectare', singular: 'hectare', plural: 'hectares' },
  { value: 'botte', singular: 'botte', plural: 'bottes' },
  { value: 'litre', singular: 'litre', plural: 'litres' },
  { value: 'unite', singular: 'unité', plural: 'unités' },
] as const

export const UNIT_VALUES = UNITS.map((u) => u.value) as string[]

/** 50 + "kg" → "50 kg", 3 + "sac" → "3 sacs", 1.5 + "tonne" → "1,5 tonne" */
export function formatQuantity(quantity?: number | null, unit?: string | null): string {
  if (quantity === null || quantity === undefined || !unit) return ''
  const u = UNITS.find((x) => x.value === unit)
  if (!u) return ''
  const n = quantity.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
  return `${n} ${quantity >= 2 ? u.plural : u.singular}`
}

// === SAISONS (calendrier agricole indicatif du Sénégal) ===
// Sert uniquement à proposer des recherches utiles selon le mois, jamais à filtrer.
export function seasonalSuggestions(month = new Date().getMonth()): { title: string; searches: string[] } {
  // Mai–juillet : préparation et semis de l'hivernage
  if (month >= 4 && month <= 6) return { title: "Préparation de l'hivernage", searches: ['Semences', 'Arachide', 'Engrais', 'Semoir'] }
  // Août–septembre : entretien des cultures
  if (month >= 7 && month <= 8) return { title: 'En pleine saison des pluies', searches: ['Engrais', 'Main d’œuvre', 'Motopompe', 'Bétail'] }
  // Octobre–décembre : récoltes
  if (month >= 9) return { title: 'Saison des récoltes', searches: ['Arachide', 'Mil', 'Niébé', 'Batteuse'] }
  // Janvier–avril : saison sèche, maraîchage et alimentation du bétail
  return { title: 'Saison sèche', searches: ['Fourrage', 'Oignon', 'Motopompe', 'Tourteau'] }
}
