import type { Offer, OfferId } from '../../schemas'
import { remainingQuantity } from '../../store'
import { OfferCard } from './OfferCard'
import { OfferPhoto } from './OfferPhoto'

interface OfferGridProps {
  offers: readonly Offer[]
  /** Quantités mises de côté par offre (déduction du stock affiché). */
  reservedQuantities: Record<OfferId, number>
  favorites: readonly OfferId[]
  onToggleFavorite: (offerId: OfferId) => void
  onSelect: (offer: Offer) => void
  onResetFilters: () => void
}

/** Compteur + grille responsive des offres, ou état vide « aucun résultat ». */
export function OfferGrid({
  offers,
  reservedQuantities,
  favorites,
  onToggleFavorite,
  onSelect,
  onResetFilters,
}: OfferGridProps) {
  if (offers.length === 0) {
    return <EmptyResults onResetFilters={onResetFilters} />
  }

  return (
    <>
      <p className="pb-6 text-ink-2">
        {offers.length} offre{offers.length > 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, index) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            index={index}
            remaining={remainingQuantity(offer, reservedQuantities[offer.id] ?? 0)}
            favorite={favorites.includes(offer.id)}
            onToggleFavorite={onToggleFavorite}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  )
}

/** État vide de la maquette : visuel, message et bouton d’effacement. */
function EmptyResults({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <div className="grid justify-items-start gap-4">
      <OfferPhoto
        tone="#a9cc3b"
        imageSlug="aucune-offre"
        alt="Aucune offre ne correspond à la recherche"
        variant={1}
        icon="dots"
        className="h-36 w-36"
      />
      <h2>Rien ne correspond à cette recherche.</h2>
      <p className="max-w-[46ch] text-ink-2">
        Essayez un autre mot, un autre quartier, ou retirez un filtre.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="cursor-pointer rounded-full border-0 bg-transparent px-6 py-3.5 font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper"
      >
        Effacer les filtres
      </button>
    </div>
  )
}
