export interface AvatarPreset {
  id: string
  label: string
  url: string
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'farmer-w', label: 'Agriculteur', url: '/avatars/avatar-farmer-w.webp' },
  { id: 'sprout', label: 'Jeune pousse', url: '/avatars/avatar-sprout.webp' },
  { id: 'seedling', label: 'Pépinière', url: '/avatars/avatar-seedling.webp' },
  { id: 'wheat', label: 'Céréalier', url: '/avatars/avatar-wheat.webp' },
  { id: 'tractor', label: 'Machinisme', url: '/avatars/avatar-tractor.webp' },
  { id: 'cow', label: 'Éleveur', url: '/avatars/avatar-cow.webp' },
  { id: 'fruit', label: 'Arboriculteur', url: '/avatars/avatar-fruit.webp' },
  { id: 'peanut', label: 'Arachide', url: '/avatars/avatar-peanut.webp' },
]
