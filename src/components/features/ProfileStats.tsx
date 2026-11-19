import { Link } from 'react-router-dom'
import { formatAr } from '../../lib/format'
import { useAllOffers, useCartStore, useOfferStore } from '../../store'
import { Icon } from '../ui/Icon'

const STAT_ROW = 'flex items-baseline gap-[1.4rem] border-b border-line py-4'
const LINK_CLASS =
  'mt-6 inline-flex items-center gap-2 font-semibold text-leaf no-underline hover:underline'

/** Statistiques d’impact du profil (maquette : section « Votre impact »). */
export function ProfileStats() {
  const reservations = useCartStore((state) => state.reservations)
  const publications = useOfferStore((state) => state.publishedOffers)
  const offers = useAllOffers()

  const active = reservations.filter((reservation) => reservation.status !== 'Annulée')
  const saved = reservations
    .filter((reservation) => reservation.status === 'Récupérée')
    .reduce((total, reservation) => total + reservation.quantity, 0)
  const economy = active.reduce((total, reservation) => {
    const offer = offers.find((candidate) => candidate.id === reservation.offerId)
    if (offer === undefined || offer.originalPrice === undefined) return total
    return total + (offer.originalPrice - offer.price) * reservation.quantity
  }, 0)

  const stats: readonly { value: string; label: string }[] = [
    { value: String(saved), label: 'produits sauvés' },
    { value: String(active.length), label: 'réservations' },
    { value: formatAr(economy), label: 'économisés' },
    { value: String(publications.length), label: 'publications' },
  ]

  return (
    <section>
      <h2 className="text-h2">Votre impact</h2>
      <span aria-hidden="true" className="mt-3 mb-2 block h-[3px] w-10 bg-lime" />

      <div>
        {stats.map((stat) => (
          <div key={stat.label} className={STAT_ROW}>
            <b className="min-w-[5ch] font-serif text-[2.8rem] leading-none">{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <Link to="/reservations" className={LINK_CLASS}>
        Voir mes réservations
        <Icon name="arrow" />
      </Link>
    </section>
  )
}
