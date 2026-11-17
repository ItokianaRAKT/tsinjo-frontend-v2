import { categories, merchants } from '../../data/mockData'
import { formatAr, singularUnit } from '../../lib/format'
import type { Offer, OfferId } from '../../schemas'
import { discountPercent, merchantNameOf } from '../../store'
import { Icon } from '../ui/Icon'
import { OfferPhoto } from './OfferPhoto'

interface OfferCardProps {
  offer: Offer
  /** Quantité encore disponible (réservations déjà déduites). */
  remaining: number
  favorite: boolean
  /** Décale la forme de la photo d’une carte à l’autre. */
  index: number
  onToggleFavorite: (offerId: OfferId) => void
  onSelect: (offer: Offer) => void
}

const CARD_CLASS = 'group relative grid gap-[0.9rem]'

/** Carte d’un panier anti-gaspi : visuel, réduction, prix, vendeur et stock. */
export function OfferCard({
  offer,
  remaining,
  favorite,
  index,
  onToggleFavorite,
  onSelect,
}: OfferCardProps) {
  const seller = merchantNameOf(offer, merchants)
  const category = categories.find((item) => item.id === offer.categoryId)
  const stockLabel = remaining > 0 ? `${remaining} ${offer.unit} restants` : 'Épuisé'

  return (
    <article className={CARD_CLASS}>
      <span className="absolute left-3 top-3 z-20 rounded-full bg-lime px-3 py-1 text-[0.82rem] font-semibold text-ink">
        −{discountPercent(offer)} %
      </span>

      <button
        type="button"
        aria-pressed={favorite}
        aria-label={`${favorite ? 'Retirer' : 'Ajouter'} ${offer.name} ${
          favorite ? 'des' : 'aux'
        } favoris`}
        onClick={() => onToggleFavorite(offer.id)}
        className={`absolute right-2 top-2 z-30 grid h-[2.6rem] w-[2.6rem] cursor-pointer place-items-center rounded-full border-0 ${
          favorite ? 'bg-ink text-lime' : 'bg-paper text-ink'
        }`}
      >
        <Icon name="heart" style={favorite ? { fill: 'currentColor' } : undefined} />
      </button>

      <OfferPhoto
        tone={offer.tone}
        imageSlug={offer.imageSlug}
        alt={offer.name}
        variant={index}
        icon={category?.icon}
        className="aspect-[4/3.2] group-hover:rounded-[40%_60%_55%_45%_/_55%_40%_60%_45%]"
      />

      <h3>{offer.name}</h3>

      <div className="flex flex-wrap items-baseline gap-x-3">
        <b className="font-serif text-[1.5rem]">{formatAr(offer.price)}</b>
        <s className="text-[0.95rem] text-ink-2">{formatAr(offer.originalPrice)}</s>
        <span className="text-[0.95rem] text-ink-2">/ {singularUnit(offer.unit)}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.88rem] text-ink-2">
        <span className="inline-flex items-center gap-1">
          <Icon name="user" />
          {seller}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="pin" />
          {offer.place}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="clock" />
          {offer.pickupUntil}
        </span>
        <span className={remaining > 0 ? '' : 'font-semibold text-warn'}>{stockLabel}</span>
      </div>

      <button
        type="button"
        aria-label={`Voir le détail de ${offer.name}`}
        onClick={() => onSelect(offer)}
        className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent"
      />
    </article>
  )
}
