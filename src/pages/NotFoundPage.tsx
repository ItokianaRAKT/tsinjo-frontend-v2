import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'

/** Route `*` : adresse inconnue. */
export function NotFoundPage() {
  return (
    <section className="px-pad py-14">
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">Erreur 404</p>
      <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.2rem)]">Page introuvable</h1>
      <p className="mt-4 max-w-[46ch] text-ink-2">
        Cette adresse ne correspond à aucune page de Tsinjo.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper no-underline transition-colors hover:bg-leaf"
      >
        Retourner explorer
        <Icon name="arrow" />
      </Link>
    </section>
  )
}
