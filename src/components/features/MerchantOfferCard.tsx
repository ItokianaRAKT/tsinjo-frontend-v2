import { categories } from '../../data/mockData'
import { formatAr } from '../../lib/format'
import type { Offer, PublicationStatus } from '../../schemas'
import { remainingQuantity, useCartStore, useOfferStore } from '../../store'
import { Icon } from '../ui/Icon'
import { OfferPhoto } from './OfferPhoto'

/** Action d’avancement du cycle (bouton primaire des « Publications »). */
const NEXT_ACTION: Partial<
  Record<PublicationStatus, { label: string; status: PublicationStatus }>
> = {
  Active: { label: 'Marquer réservée', status: 'Réservée' },
  'Réservée': { label: 'Marquer terminée', status: 'Terminée' },
}

/** Statuts depuis lesquels l’offre peut être retirée (règle du store). */
const WITHDRAWABLE: readonly PublicationStatus[] = ['Active', 'Réservée']

/** Classes `.st` de la maquette : ok / trait encré / retrait warn. */
const STATUS_CLASS: Record<PublicationStatus, string> = {
  Active: 'border-[1.5px] border-lime bg-lime text-ink',
  'Réservée': 'border-[1.5px] border-ink bg-transparent text-ink',
  Terminée: 'border-[1.5px] border-lime bg-lime text-ink',
  Retirée: 'border-[1.5px] border-warn bg-transparent text-warn',
}

const PRIMARY_BUTTON =
  'cursor-pointer rounded-full bg-ink px-4 py-[0.45rem] text-[0.88rem] font-semibold text-paper transition-colors hover:bg-leaf'

const GHOST_BUTTON =
  'cursor-pointer rounded-full px-4 py-[0.45rem] text-[0.88rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper shadow-[inset_0_0_0_1.5px_var(--color-ink)]'

interface MerchantOfferCardProps {
  offer: Offer
}

/**
 * Ligne d’une publication (maquette : `.act` de l’onglet « Publications ») :
 * visuel, stock restant, statut et boutons `setPublicationStatus()`.
 */
export function MerchantOfferCard({ offer }: MerchantOfferCardProps) {
  const reserved = useCartStore((state) => state.reservedQuantities[offer.id] ?? 0)
  const setPublicationStatus = useOfferStore((state) => state.setPublicationStatus)
  const remaining = remainingQuantity(offer, reserved)
  const action = NEXT_ACTION[offer.status]
  const canWithdraw = WITHDRAWABLE.includes(offer.status)
  const category = categories.find((item) => item.id === offer.categoryId)

  return (
    <article className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-4 border-b border-line py-[1.3rem] md:grid-cols-[5rem_1fr_auto]">
      <OfferPhoto
        tone={offer.tone}
        imageSlug={offer.imageSlug}
        alt={offer.name}
        icon={category?.icon}
        className="h-[4.5rem] w-[4.5rem]"
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h3>{offer.name}</h3>
          <span
            className={`inline-block rounded-full px-3 py-0.5 text-[0.8rem] font-semibold ${STATUS_CLASS[offer.status]}`}
          >
            {offer.status}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="pin" />
            {offer.place}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" />
            {offer.pickupUntil}
          </span>
          <span>
            <b className="font-semibold text-ink">{remaining}</b>/{offer.quantity} {offer.unit}{' '}
            restants
          </span>
          <span>
            <b className="font-semibold text-ink">{formatAr(offer.price)}</b>{' '}
            {offer.originalPrice !== undefined && <s>{formatAr(offer.originalPrice)}</s>}
          </span>
        </div>
      </div>

      {(action !== undefined || canWithdraw) && (
        <div className="col-span-2 flex flex-wrap gap-2.5 md:col-span-1 md:justify-end">
          {action !== undefined && (
            <button
              type="button"
              onClick={() => setPublicationStatus(offer.id, action.status)}
              className={PRIMARY_BUTTON}
            >
              {action.label}
            </button>
          )}
          {canWithdraw && (
            <button
              type="button"
              onClick={() => setPublicationStatus(offer.id, 'Retirée')}
              className={GHOST_BUTTON}
            >
              Retirer
            </button>
          )}
        </div>
      )}
    </article>
  )
}
