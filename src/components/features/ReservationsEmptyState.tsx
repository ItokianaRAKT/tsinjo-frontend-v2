import { Link } from 'react-router-dom'

/**
 * État vide de la page Réservations (maquette : `.empty` de l’onglet
 * « Réservations ») : illustration lime, message et lien vers Explorer.
 */
export function ReservationsEmptyState() {
  return (
    <div className="mt-10 grid justify-items-start gap-4">
      <div
        aria-hidden="true"
        className="h-36 w-36 bg-lime"
        style={{ borderRadius: '70% 30% 58% 42% / 40% 60% 40% 60%' }}
      />
      <h2>Aucune réservation</h2>
      <p className="max-w-[46ch] text-ink-2">
        Réservez une offre, elle apparaîtra ici avec son code de retrait.
      </p>
      <Link
        to="/"
        className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper no-underline transition-colors hover:bg-leaf"
      >
        Explorer les offres
      </Link>
    </div>
  )
}
