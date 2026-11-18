import { Link } from 'react-router-dom'
import { formatAr, singularUnit } from '../../lib/format'
import type { Offer, Reservation } from '../../schemas'
import { Icon } from '../ui/Icon'

interface ReservationSuccessProps {
  offer: Offer
  seller: string
  reservation: Reservation
  onClose: () => void
}

const primaryClass =
  'inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-paper no-underline hover:bg-leaf'
const secondaryClass =
  'cursor-pointer rounded-full border-0 bg-transparent px-6 py-3.5 font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper'

/** Confirmation de réservation : quantité, code de retrait et total à payer. */
export function ReservationSuccess({
  offer,
  seller,
  reservation,
  onClose,
}: ReservationSuccessProps) {
  const unit = singularUnit(offer.unit)

  return (
    <div role="status" className="grid gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-lime text-ink">
        <Icon name="check" />
      </span>
      <h2 className="text-[clamp(1.6rem,4vw,2rem)]">Réservation confirmée</h2>
      <p>
        {reservation.quantity} {unit} de <b>{offer.name}</b> vous attendent chez {seller},{' '}
        {offer.place}.
      </p>
      <p className="rounded-[2rem_0.6rem_2rem_0.6rem] border-[1.5px] border-dashed border-ink px-4 py-3 text-center font-serif text-[1.8rem] font-bold tracking-[0.06em]">
        {reservation.code}
      </p>
      <p className="text-sm text-ink-2">
        Présentez ce code au vendeur. À récupérer : {offer.pickupUntil}. Total à régler sur
        place : {formatAr(offer.price * reservation.quantity)}.
      </p>
      <div className="mt-1 flex flex-wrap gap-3">
        <Link to="/reservations" onClick={onClose} className={primaryClass}>
          Voir mes réservations
        </Link>
        <button type="button" onClick={onClose} className={secondaryClass}>
          Fermer
        </button>
      </div>
    </div>
  )
}
