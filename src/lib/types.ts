// Forme d'une annonce telle que renvoyée par serializeOffer (src/app/api/offers/route.ts)
export interface OfferUser {
  id: string
  phone?: string
  full_name?: string | null
  city?: string | null
  avatar_url?: string | null
  rating_avg?: number
  exchange_count?: number
}

export interface Offer {
  id: string
  title: string
  description?: string | null
  resource_type: string
  offered_resource: string
  wanted_resource: string
  complement_type: string
  complement_desc?: string | null
  location: string
  status: 'active' | 'completed' | 'cancelled' | string
  views_count?: number
  user?: OfferUser | null
  images?: { id: string; image_url: string }[]
  created_at?: string
}
