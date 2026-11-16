import type { Merchant, Offer, OfferId, Reservation } from '../schemas'

/** Taux de réduction d’une offre, en pourcentage entier (badge « −45 % »). */
export function discountPercent(offer: Offer): number {
  return Math.round((1 - offer.price / offer.originalPrice) * 100)
}

/** Quantité encore disponible d’une offre, après déduction des réservations. */
export function remainingQuantity(offer: Offer, reservedQuantity: number): number {
  return Math.max(0, offer.quantity - reservedQuantity)
}

/**
 * Quantités mises de côté par offre, dérivées des réservations en cours
 * (une réservation annulée libère sa quantité).
 */
export function computeReservedQuantities(
  reservations: readonly Reservation[],
): Record<OfferId, number> {
  return reservations.reduce<Record<OfferId, number>>(
    (quantities, reservation) =>
      reservation.status === 'Annulée'
        ? quantities
        : {
            ...quantities,
            [reservation.offerId]:
              (quantities[reservation.offerId] ?? 0) + reservation.quantity,
          },
    {},
  )
}

/**
 * Nom affiché du vendeur : commerce mocké s’il existe, sinon l’identifiant
 * brut (publication d’un particulier, qui utilise son nom de profil).
 */
export function merchantNameOf(offer: Offer, merchants: readonly Merchant[]): string {
  return (
    merchants.find((merchant) => merchant.id === offer.merchantId)?.name ??
    offer.merchantId
  )
}
