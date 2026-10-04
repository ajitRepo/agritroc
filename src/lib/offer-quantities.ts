import { z } from 'zod'
import { UNIT_VALUES } from '@/lib/constants'

// Quantité facultative : nombre positif + unité connue, ou rien
export const quantityFields = {
  offered_quantity: z.number().positive('La quantité doit être positive').max(1_000_000).optional().nullable(),
  offered_unit: z.string().refine((u) => UNIT_VALUES.includes(u), 'Unité inconnue').optional().nullable(),
  wanted_quantity: z.number().positive('La quantité doit être positive').max(1_000_000).optional().nullable(),
  wanted_unit: z.string().refine((u) => UNIT_VALUES.includes(u), 'Unité inconnue').optional().nullable(),
}

/** Lit les champs de quantité du corps de requête (snake_case ou camelCase) */
export function readQuantities(body: Record<string, unknown>) {
  const pick = (a: string, b: string) => (body[a] !== undefined ? body[a] : body[b])
  return {
    offered_quantity: pick('offered_quantity', 'offeredQuantity'),
    offered_unit: pick('offered_unit', 'offeredUnit'),
    wanted_quantity: pick('wanted_quantity', 'wantedQuantity'),
    wanted_unit: pick('wanted_unit', 'wantedUnit'),
  }
}
