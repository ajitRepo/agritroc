export interface AvatarPreset {
  id: string
  label: string
  url: string
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'farmer-m', label: 'Cultivateur', url: '/avatars/avatar-farmer-m.png' },
  { id: 'farmer-w', label: 'Cultivatrice', url: '/avatars/avatar-farmer-w.png' },
  { id: 'sprout', label: 'Jeune pousse', url: '/avatars/avatar-sprout.png' },
  { id: 'wheat', label: 'Céréalier', url: '/avatars/avatar-wheat.png' },
  { id: 'tractor', label: 'Machinisme', url: '/avatars/avatar-tractor.png' },
  { id: 'cow', label: 'Éleveur', url: '/avatars/avatar-cow.png' },
  { id: 'fruit', label: 'Arboriculteur', url: '/avatars/avatar-fruit.png' },
  { id: 'peanut', label: 'Arachide', url: '/avatars/avatar-peanut.png' },
]
