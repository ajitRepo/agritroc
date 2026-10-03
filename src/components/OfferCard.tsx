import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowLeftRight } from 'lucide-react'
import { categoryIcon, categoryLabel, timeAgo } from '@/lib/constants'
import type { Offer } from '@/lib/types'

/**
 * Carte d'annonce scannable en une seconde :
 * photo → titre → ce qui est recherché en échange → lieu & date.
 * Toute la carte est cliquable, aucun bouton secondaire à l'intérieur.
 */
export default function OfferCard({ offer }: { offer: Offer }) {
  const image = offer.images?.[0]?.image_url
  const label = categoryLabel(offer.resource_type)

  return (
    <Link
      href={`/offres/${offer.id}`}
      className="group flex flex-col bg-surface rounded-card border border-line overflow-hidden transition-[box-shadow,border-color] duration-200 hover:border-primary/30 hover:shadow-[0_8px_24px_-12px_rgba(15,107,62,0.25)] active:scale-[0.99] animate-fade-up"
    >
      <div className="relative aspect-[4/3] bg-surface-secondary overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={offer.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-soft to-ochre-soft">
            <Image src={categoryIcon(offer.resource_type)} alt="" width={72} height={72} className="opacity-90" />
          </div>
        )}

        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[11px] font-semibold text-ink shadow-sm">
          {label}
        </span>
        {offer.complement_type && offer.complement_type !== 'none' && (
          <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-ochre text-white text-[11px] font-semibold shadow-sm">
            + Complément
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 p-3.5 sm:p-4">
        <h3 className="font-semibold text-ink text-[15px] leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {offer.title}
        </h3>

        {offer.wanted_resource && (
          <p className="flex items-start gap-1.5 text-sm text-ink-muted">
            <ArrowLeftRight className="w-4 h-4 mt-0.5 text-ochre shrink-0" aria-hidden />
            <span className="line-clamp-1">
              <span className="sr-only">Recherche en échange : </span>
              {offer.wanted_resource}
            </span>
          </p>
        )}

        <div className="mt-auto pt-1 flex items-center justify-between gap-2 text-xs text-ink-subtle">
          <span className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
            <span className="truncate font-medium text-ink-muted">{offer.location}</span>
          </span>
          <span className="hidden sm:inline shrink-0">{timeAgo(offer.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}

export function OfferCardSkeleton() {
  return (
    <div className="bg-surface rounded-card border border-line overflow-hidden" aria-hidden>
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 w-4/5 rounded skeleton" />
        <div className="h-3.5 w-3/5 rounded skeleton" />
        <div className="h-3 w-2/5 rounded skeleton" />
      </div>
    </div>
  )
}

export function OfferGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">{children}</div>
}

export function OfferGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <OfferGrid>
      <span className="sr-only" role="status">
        Chargement des annonces…
      </span>
      {Array.from({ length: count }, (_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </OfferGrid>
  )
}
