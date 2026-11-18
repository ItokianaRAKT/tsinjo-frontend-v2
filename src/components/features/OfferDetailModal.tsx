import { useEffect, useRef, useState } from 'react'
import { categories, merchants } from '../../data/mockData'
import type { Offer } from '../../schemas'
import {
  merchantNameOf,
  remainingQuantity,
  useCartStore,
  useUserStore,
  type ReserveFailureReason,
  type ReserveResult,
} from '../../store'
import { Icon } from '../ui/Icon'
import { OfferPhoto } from './OfferPhoto'
import { ReservationForm } from './ReservationForm'
import { ReservationSuccess } from './ReservationSuccess'

interface OfferDetailModalProps {
  offer: Offer
  onClose: () => void
}

const FAILURE_MESSAGES: Record<ReserveFailureReason, string> = {
  'invalid-quantity': 'Quantité invalide : choisissez au moins une unité.',
  'offer-unavailable': 'Cette offre n’est plus disponible à la réservation.',
  'out-of-stock': 'Stock insuffisant : cette quantité n’est plus disponible.',
  'invalid-user': 'Votre profil ne permet pas de créer cette réservation.',
}

/** Message d’erreur à afficher, ou `null` s’il n’y en a pas. */
function failureMessageOf(
  result: ReserveResult | null,
  remaining: number,
  unit: string,
): string | null {
  if (result === null || result.ok) return null
  if (result.reason === 'out-of-stock' && remaining > 0) {
    return `Stock insuffisant : il ne reste que ${remaining} ${unit}.`
  }
  return FAILURE_MESSAGES[result.reason]
}

/** Modale de détail d’un panier : quantité, réservation et retours d’état. */
export function OfferDetailModal({ offer, onClose }: OfferDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [quantity, setQuantity] = useState(1)
  const [result, setResult] = useState<ReserveResult | null>(null)

  const reserve = useCartStore((state) => state.reserve)
  const reservedQuantity = useCartStore((state) => state.reservedQuantities[offer.id] ?? 0)
  const userId = useUserStore((state) => state.profile.id)

  const remaining = remainingQuantity(offer, reservedQuantity)
  const seller = merchantNameOf(offer, merchants)
  const category = categories.find((item) => item.id === offer.categoryId)
  const success = result !== null && result.ok ? result.reservation : null
  const failureMessage = failureMessageOf(result, remaining, offer.unit)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null) return
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  const handleQuantityChange = (next: number): void => {
    setQuantity(Math.min(Math.max(1, next), Math.max(1, remaining)))
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="offer-detail-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[min(30rem,92vw)] overflow-y-auto rounded-[2rem_0.6rem_2rem_0.6rem] border-0 bg-paper p-6 text-ink sm:p-8"
    >
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
              {category?.label ?? 'Offre'}
            </p>
            <h2 id="offer-detail-title" className="mt-1 text-[clamp(1.8rem,5vw,2.4rem)]">
              {offer.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le détail"
            className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-full border-0 bg-paper-2 text-ink"
          >
            <Icon name="x" />
          </button>
        </div>

        <OfferPhoto
          tone={offer.tone}
          imageSlug={offer.imageSlug}
          alt={offer.name}
          icon={category?.icon}
          className="aspect-[16/10]"
        />

        {success !== null ? (
          <ReservationSuccess offer={offer} seller={seller} reservation={success} onClose={onClose} />
        ) : remaining === 0 ? (
          <div className="grid gap-3">
            <p className="font-semibold text-warn">Cette offre n’a plus de stock.</p>
            <p className="text-sm text-ink-2">
              Elle a peut-être été réservée entre-temps : parcourez les autres paniers
              disponibles.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer justify-self-start rounded-full border-0 bg-transparent px-6 py-3.5 font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper"
            >
              Voir d’autres offres
            </button>
          </div>
        ) : (
          <ReservationForm
            offer={offer}
            seller={seller}
            remaining={remaining}
            quantity={quantity}
            failureMessage={failureMessage}
            onQuantityChange={handleQuantityChange}
            onReserve={() => setResult(reserve(offer, quantity, userId))}
          />
        )}
      </div>
    </dialog>
  )
}
