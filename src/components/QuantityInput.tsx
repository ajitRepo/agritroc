'use client'

import { UNITS } from '@/lib/constants'

/** Quantité + unité côte à côte ; les deux restent facultatifs mais vont ensemble */
export default function QuantityInput({
  id,
  quantity,
  unit,
  onQuantity,
  onUnit,
  hasError,
}: {
  id: string
  quantity: string
  unit: string
  onQuantity: (v: string) => void
  onUnit: (v: string) => void
  hasError?: boolean
}) {
  const box = `h-12 bg-surface border rounded-button text-base text-ink focus:outline-none focus:ring-2 transition ${
    hasError ? 'border-error focus:ring-error/40' : 'border-line focus:ring-primary focus:border-transparent'
  }`
  return (
    <div className="flex gap-2">
      <label htmlFor={`${id}-qty`} className="sr-only">
        Quantité
      </label>
      <input
        id={`${id}-qty`}
        type="text"
        inputMode="decimal"
        placeholder="Quantité"
        value={quantity}
        // Accepte "1,5" comme "1.5" : virgule décimale à la française
        onChange={(e) => onQuantity(e.target.value.replace(/[^0-9.,]/g, ''))}
        aria-invalid={hasError}
        className={`${box} w-32 px-4 placeholder:text-ink-subtle`}
      />
      <label htmlFor={`${id}-unit`} className="sr-only">
        Unité
      </label>
      <select
        id={`${id}-unit`}
        value={unit}
        onChange={(e) => onUnit(e.target.value)}
        aria-invalid={hasError}
        className={`${box} flex-1 px-3 cursor-pointer ${unit ? '' : 'text-ink-subtle'}`}
      >
        <option value="">Unité</option>
        {UNITS.map((u) => (
          <option key={u.value} value={u.value}>
            {u.plural}
          </option>
        ))}
      </select>
    </div>
  )
}

/** "1,5" → 1.5 ; vide ou invalide → null */
export function parseQuantity(value: string): number | null {
  const n = parseFloat(value.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : null
}

/** Message d'erreur si la paire quantité/unité est incomplète ou invalide */
export function quantityError(quantity: string, unit: string): string | undefined {
  if (!quantity && !unit) return undefined
  if (quantity && parseQuantity(quantity) === null) return 'Indiquez une quantité valide (ex. : 50 ou 1,5).'
  if (quantity && !unit) return "Choisissez l'unité (kg, sacs…)."
  if (!quantity && unit) return 'Indiquez la quantité.'
  return undefined
}
