import { categories, merchants } from '../../data/mockData'
import type { CategoryIcon, Offer, Reservation, ReservationStatus } from '../../schemas'
import { merchantNameOf, useAllOffers, useCartStore } from '../../store'
import { Icon } from '../ui/Icon'
import { ReservationStatusBadge } from './ReservationStatusBadge'

/** Libellé du bouton d’avancement pour chaque étape annulable du cycle. */
const NEXT_LABEL: Partial<Record<ReservationStatus, string>> = {
  'En attente': 'Marquer confirmée',
  'Confirmée': 'Marquer récupérée',
}

/** Statuts depuis lesquels l’annulation libère le stock (règle du store). */
const CANCELLABLE_STATUSES: readonly ReservationStatus[] = ['En attente', 'Confirmée']

const PRIMARY_BUTTON =
  'rounded-full bg-ink px-4 py-[0.45rem] text-[0.88rem] font-semibold text-paper transition-colors hover:bg-leaf'

const GHOST_BUTTON =
  'rounded-full px-4 py-[0.45rem] text-[0.88rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-paper shadow-[inset_0_0_0_1.5px_var(--color-ink)]'

/** Formate un montant en ariary, comme `ar()` de la maquette (« 1 500 Ar »). */
const formatAr = (amount: number): string =>
  `${amount.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} Ar`

const categoryIconOf = (offer: Offer): CategoryIcon =>
  categories.find((category) => category.id === offer.categoryId)?.icon ?? 'dots'

interface ReservationCardProps {
  reservation: Reservation
}

/** Carte d’une réservation : panier réservé, vendeur, collecte, code et actions. */
export function ReservationCard({ reservation }: ReservationCardProps) {
  const offer = useAllOffers().find((candidate) => candidate.id === reservation.offerId)
  const advanceStatus = useCartStore((state) => state.advanceReservationStatus)
  const cancel = useCartStore((state) => state.cancelReservation)

  if (!offer) return null

  const merchant = merchantNameOf(offer, merchants)
  const total = offer.price * reservation.quantity
  const nextLabel = NEXT_LABEL[reservation.status]
  const canCancel = CANCELLABLE_STATUSES.includes(reservation.status)

  return (
    <article className="grid grid-cols-[4.5rem_1fr] items-center gap-x-5 gap-y-4 border-b border-line py-[1.3rem] md:grid-cols-[5rem_1fr_auto]">
      <div
        aria-hidden="true"
        className="grid h-[4.5rem] w-[4.5rem] place-items-center text-[1.75rem] text-paper"
        style={{
          backgroundColor: offer.tone,
          borderRadius: '38% 62% 30% 70% / 55% 40% 60% 45%',
        }}
      >
        <Icon name={categoryIconOf(offer)} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h3>{offer.name}</h3>
          <ReservationStatusBadge status={reservation.status} />
        </div>
        <p className="mt-1 text-sm text-ink-2">
          {merchant} · {offer.place}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="clock" />
            À récupérer : {offer.pickupUntil}
          </span>
          <span>
            {reservation.quantity} {offer.unit} · Total{' '}
            <b className="font-semibold text-ink">{formatAr(total)}</b>
          </span>
          <span>
            Code <b className="font-semibold text-ink">{reservation.code}</b>
          </span>
        </div>
      </div>

      {(nextLabel || canCancel) && (
        <div className="col-span-2 flex flex-wrap gap-2.5 md:col-span-1 md:justify-end">
          {nextLabel && (
            <button
              type="button"
              onClick={() => advanceStatus(reservation.id)}
              className={PRIMARY_BUTTON}
            >
              {nextLabel}
            </button>
          )}
          {canCancel && (
            <button type="button" onClick={() => cancel(reservation.id)} className={GHOST_BUTTON}>
              Annuler
            </button>
          )}
        </div>
      )}
    </article>
  )
}
