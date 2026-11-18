import { ReservationList } from '../components/features/ReservationList'
import { ReservationsEmptyState } from '../components/features/ReservationsEmptyState'
import type { Reservation } from '../schemas'
import { useCartStore } from '../store'

/** Réservations encore jouables (« En cours ») : les autres sont au passé. */
const isCurrent = (reservation: Reservation): boolean =>
  reservation.status === 'En attente' || reservation.status === 'Confirmée'

/** Route `/reservations` : suivi des réservations en cours et passées. */
export function ReservationsPage() {
  const reservations = useCartStore((state) => state.reservations)
  const current = reservations.filter(isCurrent)
  const past = reservations.filter((reservation) => !isCurrent(reservation))

  return (
    <section className="px-pad py-14">
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
        Mon espace
      </p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2.4rem,6vw,4.2rem)]">
        Mes réservations
      </h1>
      <p className="mt-4 max-w-[46ch] text-ink-2">
        Du panier réservé à la récupération : codes de retrait, horaires et
        statuts de vos réservations, en un seul endroit.
      </p>

      {reservations.length === 0 ? (
        <ReservationsEmptyState />
      ) : (
        <>
          <ReservationList
            title="En cours"
            reservations={current}
            emptyMessage="Aucune réservation en cours."
          />
          <ReservationList
            title="Historique"
            reservations={past}
            emptyMessage="Aucune réservation passée pour l’instant."
          />
        </>
      )}
    </section>
  )
}
