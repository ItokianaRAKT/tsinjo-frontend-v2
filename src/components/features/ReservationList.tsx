import type { Reservation } from '../../schemas'
import { ReservationCard } from './ReservationCard'

interface ReservationListProps {
  title: string
  reservations: readonly Reservation[]
  /** Message affiché quand la section est vide (mais que d’autres réservations existent). */
  emptyMessage: string
}

/**
 * Section de la page Réservations (« En cours » / « Historique ») : titre
 * souligné de lime repris de `.sec-head` de la maquette, puis les cartes.
 */
export function ReservationList({ title, reservations, emptyMessage }: ReservationListProps) {
  return (
    <section className="mt-12">
      <h2 className="text-h2">{title}</h2>
      <span aria-hidden="true" className="mt-3 mb-6 block h-[3px] w-10 bg-lime" />
      {reservations.length > 0 ? (
        <div>
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      ) : (
        <p className="text-ink-2">{emptyMessage}</p>
      )}
    </section>
  )
}
