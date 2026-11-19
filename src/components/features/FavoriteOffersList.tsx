import { Link } from 'react-router-dom'
import { categories } from '../../data/mockData'
import { formatAr } from '../../lib/format'
import type { Offer } from '../../schemas'
import { useAllOffers, useUserStore } from '../../store'
import { Icon } from '../ui/Icon'
import { OfferPhoto } from './OfferPhoto'

const PRIMARY_BUTTON =
  'inline-flex items-center gap-2 rounded-full bg-ink px-4 py-[0.45rem] text-[0.88rem] font-semibold text-paper no-underline transition-colors hover:bg-leaf'
const GHOST_BUTTON =
  'cursor-pointer rounded-full border-0 bg-transparent px-4 py-[0.45rem] text-[0.88rem] font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper'

interface FavoriteRowProps {
  offer: Offer
  onRemove: () => void
}

/** Ligne d’un favori : visuel, prix, quartier, accès à l’offre et retrait. */
function FavoriteRow({ offer, onRemove }: FavoriteRowProps) {
  const category = categories.find((item) => item.id === offer.categoryId)

  return (
    <li className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-4 border-b border-line py-[1.3rem] md:grid-cols-[5rem_1fr_auto]">
      <OfferPhoto
        tone={offer.tone}
        imageSlug={offer.imageSlug}
        alt={offer.name}
        icon={category?.icon}
        className="h-[4.5rem] w-[4.5rem]"
      />
      <div className="min-w-0">
        <h3>{offer.name}</h3>
        <p className="mt-1 text-sm text-ink-2">
          {formatAr(offer.price)} · {offer.place}
        </p>
      </div>
      <div className="col-span-2 flex flex-wrap gap-2.5 md:col-span-1 md:justify-end">
        <Link to={`/?offer=${offer.id}`} className={PRIMARY_BUTTON}>
          Voir l’offre
          <Icon name="arrow" />
        </Link>
        <button type="button" onClick={onRemove} className={GHOST_BUTTON}>
          Retirer
        </button>
      </div>
    </li>
  )
}

/** Liste des paniers favoris (maquette : onglet « Favoris »). */
export function FavoriteOffersList() {
  const favorites = useUserStore((state) => state.favorites)
  const toggleFavorite = useUserStore((state) => state.toggleFavorite)
  const offers = useAllOffers()
  const list = favorites
    .map((id) => offers.find((offer) => offer.id === id))
    .filter((offer): offer is Offer => offer !== undefined)

  return (
    <section>
      <h2 className="text-h2">Vos favoris</h2>
      <span aria-hidden="true" className="mt-3 mb-6 block h-[3px] w-10 bg-lime" />

      {list.length === 0 ? (
        <div className="grid justify-items-start gap-3">
          <h3>Aucun favori</h3>
          <p className="text-ink-2">Touchez le cœur d’une offre pour la retrouver ici.</p>
          <Link to="/" className={GHOST_BUTTON}>
            Explorer les offres
          </Link>
        </div>
      ) : (
        <ul className="grid">
          {list.map((offer) => (
            <FavoriteRow key={offer.id} offer={offer} onRemove={() => toggleFavorite(offer.id)} />
          ))}
        </ul>
      )}
    </section>
  )
}
