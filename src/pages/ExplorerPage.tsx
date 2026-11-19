import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExplorerFilters } from '../components/features/ExplorerFilters'
import { OfferDetailModal } from '../components/features/OfferDetailModal'
import { OfferGrid } from '../components/features/OfferGrid'
import { merchants } from '../data/mockData'
import { useFilterUrlSync } from '../hooks/useFilterUrlSync'
import { OfferIdSchema, type Offer } from '../schemas'
import {
  filterOffers,
  useAllOffers,
  useCartStore,
  useFilterStore,
  useUserStore,
  type FilterState,
} from '../store'

/**
 * Route `/explorer` : la page Explorer — en-tête, recherche et filtres synchronisés
 * avec l’URL, grille des paniers et modale de détail / réservation.
 */
export function ExplorerPage() {
  const offers = useAllOffers()
  const query = useFilterStore((state) => state.query)
  const categoryId = useFilterStore((state) => state.categoryId)
  const place = useFilterStore((state) => state.place)
  const sort = useFilterStore((state) => state.sort)
  const resetFilters = useFilterStore((state) => state.resetFilters)
  const reservedQuantities = useCartStore((state) => state.reservedQuantities)
  const favorites = useUserStore((state) => state.favorites)
  const toggleFavorite = useUserStore((state) => state.toggleFavorite)
  const [searchParams, setSearchParams] = useSearchParams()

  useFilterUrlSync()

  const filters = useMemo<FilterState>(
    () => ({ query, categoryId, place, sort }),
    [query, categoryId, place, sort],
  )
  const availableOffers = useMemo(
    () => offers.filter((offer) => offer.status === 'Active'),
    [offers],
  )
  const visibleOffers = useMemo(
    () => filterOffers(availableOffers, merchants, filters),
    [availableOffers, filters],
  )
  // La modale suit l’URL (`?offer=<id>`) : lien profond depuis les favoris,
  // historique du navigateur et partage d’adresse restent cohérents.
  const selectedOffer = useMemo(() => offerFromParams(searchParams, offers), [offers, searchParams])

  const openOffer = (offer: Offer): void =>
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('offer', String(offer.id))
      return next
    })
  const closeOffer = (): void =>
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        next.delete('offer')
        return next
      },
      { replace: true },
    )

  return (
    <section className="px-pad pb-16 pt-10">
      <header>
        <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
          Explorer
        </p>
        <h1 className="mt-3 max-w-[18ch] text-[clamp(2.4rem,6vw,4.2rem)]">
          Ce qui se partage près de vous
        </h1>
      </header>

      <div className="mt-8">
        <ExplorerFilters />
      </div>

      <div className="mt-8">
        <OfferGrid
          offers={visibleOffers}
          reservedQuantities={reservedQuantities}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelect={openOffer}
          onResetFilters={resetFilters}
        />
      </div>

      {selectedOffer !== null && (
        <OfferDetailModal
          key={selectedOffer.id}
          offer={selectedOffer}
          onClose={closeOffer}
        />
      )}
    </section>
  )
}

/** Offre ciblée par le lien profond `?offer=<id>` (inconnu ou absent → `null`). */
function offerFromParams(params: URLSearchParams, offers: readonly Offer[]): Offer | null {
  const raw = params.get('offer')
  if (raw === null) return null
  const parsed = OfferIdSchema.safeParse(Number(raw))
  return parsed.success ? (offers.find((offer) => offer.id === parsed.data) ?? null) : null
}
