import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { reservations as seedReservations } from '../data/mockData'
import {
  ReservationSchema,
  type Offer,
  type OfferId,
  type Reservation,
  type ReservationStatus,
} from '../schemas'
import { computeReservedQuantities, remainingQuantity } from './selectors'

/** Échec possible d’une réservation (à traduire en message côté interface). */
export type ReserveFailureReason =
  | 'invalid-quantity'
  | 'offer-unavailable'
  | 'out-of-stock'
  | 'invalid-user'

export type ReserveResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: ReserveFailureReason }

/** Réservations annulables (les autres statuts sont terminaux). */
const CANCELLABLE_STATUSES: readonly ReservationStatus[] = ['En attente', 'Confirmée']

/** Transition suivante du cycle (boutons « Marquer confirmée / récupérée »). */
const NEXT_STATUS: Partial<Record<ReservationStatus, ReservationStatus>> = {
  'En attente': 'Confirmée',
  'Confirmée': 'Récupérée',
}

interface CartState {
  /** Réservations de l’utilisateur, de la plus récente à la plus ancienne. */
  reservations: Reservation[]
  /** Quantités mises de côté par offre (hors réservations annulées). */
  reservedQuantities: Record<OfferId, number>
  /** Prochain identifiant attribué à une réservation. */
  nextReservationId: number
  /** Réserve une quantité d’une offre ; échoue si le stock est insuffisant. */
  reserve: (offer: Offer, quantity: number, userId: string) => ReserveResult
  /** Fait avancer le cycle : « En attente » → « Confirmée » → « Récupérée ». */
  advanceReservationStatus: (reservationId: number) => void
  /** Annule une réservation et libère la quantité mise de côté. */
  cancelReservation: (reservationId: number) => void
  reset: () => void
}

/** Code de retrait `TSJ-XXXX` présenté au vendeur. */
const generatePickupCode = (): string =>
  `TSJ-${Math.floor(1000 + Math.random() * 9000)}`

const createSeedState = (): Pick<
  CartState,
  'reservations' | 'reservedQuantities' | 'nextReservationId'
> => ({
  reservations: [...seedReservations],
  reservedQuantities: computeReservedQuantities(seedReservations),
  nextReservationId: seedReservations.reduce((max, r) => Math.max(max, r.id), 0) + 1,
})

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...createSeedState(),
      reserve: (offer, quantity, userId) => {
        const { reservedQuantities, nextReservationId } = get()
        const reserved = reservedQuantities[offer.id] ?? 0

        if (!Number.isInteger(quantity) || quantity < 1) {
          return { ok: false, reason: 'invalid-quantity' }
        }
        if (offer.status !== 'Active') {
          return { ok: false, reason: 'offer-unavailable' }
        }
        if (quantity > remainingQuantity(offer, reserved)) {
          return { ok: false, reason: 'out-of-stock' }
        }

        const parsed = ReservationSchema.safeParse({
          id: nextReservationId,
          offerId: offer.id,
          userId,
          quantity,
          status: 'En attente',
          code: generatePickupCode(),
        })
        if (!parsed.success) {
          return { ok: false, reason: 'invalid-user' }
        }

        set((state) => ({
          reservations: [parsed.data, ...state.reservations],
          reservedQuantities: {
            ...state.reservedQuantities,
            [offer.id]: reserved + quantity,
          },
          nextReservationId: nextReservationId + 1,
        }))
        return { ok: true, reservation: parsed.data }
      },
      advanceReservationStatus: (reservationId) =>
        set((state) => ({
          reservations: state.reservations.map((reservation): Reservation => {
            if (reservation.id !== reservationId) {
              return reservation
            }
            const next = NEXT_STATUS[reservation.status]
            return next ? { ...reservation, status: next } : reservation
          }),
        })),
      cancelReservation: (reservationId) =>
        set((state) => {
          const target = state.reservations.find((r) => r.id === reservationId)
          if (!target || !CANCELLABLE_STATUSES.includes(target.status)) {
            return state
          }
          const released =
            (state.reservedQuantities[target.offerId] ?? 0) - target.quantity
          return {
            reservations: state.reservations.map((reservation): Reservation =>
              reservation.id === reservationId
                ? { ...reservation, status: 'Annulée' }
                : reservation,
            ),
            reservedQuantities: {
              ...state.reservedQuantities,
              [target.offerId]: Math.max(0, released),
            },
          }
        }),
      reset: () => set(createSeedState()),
    }),
    {
      name: 'tsinjo.cart.v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reservations: state.reservations,
        reservedQuantities: state.reservedQuantities,
        nextReservationId: state.nextReservationId,
      }),
    },
  ),
)

/** Sélecteur : quantité réservée d’une offre (`useCartStore(selectReservedQuantity(id))`). */
export const selectReservedQuantity =
  (offerId: OfferId) =>
  (state: CartState): number =>
    state.reservedQuantities[offerId] ?? 0

/** Sélecteur : nombre de réservations encore en cours (pastille du panier). */
export const selectActiveReservationCount = (state: CartState): number =>
  state.reservations.reduce(
    (total, reservation) => (reservation.status === 'Annulée' ? total : total + 1),
    0,
  )
