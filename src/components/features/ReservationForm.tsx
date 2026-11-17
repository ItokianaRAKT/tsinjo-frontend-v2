import { formatAr, singularUnit } from '../../lib/format'
import type { Offer } from '../../schemas'
import { discountPercent } from '../../store'
import { Icon } from '../ui/Icon'
import { QuantityStepper } from './QuantityStepper'

interface ReservationFormProps {
  offer: Offer
  seller: string
  remaining: number
  quantity: number
  /** Message d’erreur renvoyé par `useCartStore.reserve()`, le cas échéant. */
  failureMessage: string | null
  onQuantityChange: (quantity: number) => void
  onReserve: () => void
}

const factClass = 'flex items-center gap-2'
const reserveButtonClass =
  'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-lime px-6 py-3.5 font-semibold text-ink hover:brightness-95'

/** Panneau d’achat du détail : prix, faits, stock, quantité et réservation. */
export function ReservationForm({
  offer,
  seller,
  remaining,
  quantity,
  failureMessage,
  onQuantityChange,
  onReserve,
}: ReservationFormProps) {
  const unit = singularUnit(offer.unit)
  const stockPercent = Math.round((remaining / offer.quantity) * 100)

  return (
    <div className="grid gap-1">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="font-serif text-[3rem] font-bold leading-none">{formatAr(offer.price)}</span>
        <s className="text-ink-2">{formatAr(offer.originalPrice)}</s>
      </div>
      <p className="text-ink-2">
        par {unit} · −{discountPercent(offer)} %
      </p>

      <div className="my-4 grid gap-2 border-y border-line py-4 text-sm">
        <p className={factClass}>
          <Icon name="pin" />
          {offer.place}, Antananarivo
        </p>
        <p className={factClass}>
          <Icon name="clock" />
          À récupérer : {offer.pickupUntil}
        </p>
        <p className={factClass}>
          <Icon name="user" />
          {seller}
        </p>
        <div>
          <p className="font-semibold">
            {remaining} {offer.unit} disponibles
          </p>
          <div className="mt-1 h-[6px] overflow-hidden rounded-[9px] bg-line">
            <div className="h-full bg-leaf" style={{ width: `${stockPercent}%` }} />
          </div>
        </div>
      </div>

      <QuantityStepper
        quantity={quantity}
        max={remaining}
        totalLabel={formatAr(offer.price * quantity)}
        onChange={onQuantityChange}
      />

      {failureMessage !== null && (
        <p role="alert" className="mb-3 font-semibold text-warn">
          {failureMessage}
        </p>
      )}

      <button type="button" onClick={onReserve} className={reserveButtonClass}>
        Réserver
        <Icon name="arrow" />
      </button>
    </div>
  )
}
