import { useMemo, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OfferCard } from '../components/features/OfferCard'
import { OfferPhoto } from '../components/features/OfferPhoto'
import { Icon } from '../components/ui/Icon'
import { categories, impactStats } from '../data/mockData'
import {
  compareByDiscount,
  remainingQuantity,
  useAllOffers,
  useCartStore,
  useUserStore,
} from '../store'

const EYEBROW_CLASS = 'text-[0.82rem] font-semibold uppercase tracking-[0.08em]'

const STEPS: readonly { title: string; text: string }[] = [
  {
    title: 'Repérez',
    text: 'Commerçants et producteurs publient leurs surplus, avec un prix réduit et une heure limite.',
  },
  {
    title: 'Réservez',
    text: 'Choisissez la quantité : le produit est mis de côté à votre nom, avec un code de retrait.',
  },
  {
    title: 'Récupérez',
    text: 'Passez au point de vente, donnez votre code et repartez avec de bons produits.',
  },
]

/** Chiffre d’impact : grand nombre en vert, légende en dessous. */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <p>
      <b className="block font-serif text-[clamp(2.4rem,7vw,4.4rem)] leading-none text-leaf">
        {value.toLocaleString('fr-FR')}
      </b>
      {label}
    </p>
  )
}

/**
 * Route `/` : la page d’accueil de la maquette (`pageHome()`) — hero avec
 * recherche et catégories, trois coups de cœur, méthode en trois gestes et
 * chiffres d’impact. Les liens renvoient vers `/explorer` (catalogue).
 */
export function HomePage() {
  const navigate = useNavigate()
  const offers = useAllOffers()
  const reservedQuantities = useCartStore((state) => state.reservedQuantities)
  const favorites = useUserStore((state) => state.favorites)
  const toggleFavorite = useUserStore((state) => state.toggleFavorite)

  const picks = useMemo(
    () =>
      offers
        .filter((offer) => offer.status === 'Active')
        .sort(compareByDiscount)
        .slice(0, 3),
    [offers],
  )

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const raw = new FormData(event.currentTarget).get('q')
    const query = typeof raw === 'string' ? raw.trim() : ''
    navigate(query === '' ? '/explorer' : `/explorer?q=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <section className="grid items-center gap-10 px-pad pt-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="grid gap-6">
          <p className={`${EYEBROW_CLASS} text-leaf`}>Donner une seconde chance</p>
          <h1>Moins de gaspillage. Plus de partage.</h1>
          <p className="max-w-[30ch] text-[1.2rem]">
            Tsinjo vous connecte avec des offres locales pour sauver des produits encore bons.
          </p>

          <form
            role="search"
            onSubmit={handleSearch}
            className="flex max-w-[32rem] items-center gap-3 rounded-full bg-search py-1 pl-5 pr-1 shadow-[0_0_0_1px_var(--color-line)] focus-within:shadow-[0_0_0_2px_var(--color-leaf)]"
          >
            <Icon name="search" className="text-ink-2" />
            <input
              type="search"
              name="q"
              placeholder="Rechercher un produit…"
              aria-label="Rechercher un produit"
              className="min-w-0 flex-1 border-0 bg-transparent py-2 text-ink placeholder:text-ink-2 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Lancer la recherche"
              className="grid h-[2.9rem] w-[2.9rem] cursor-pointer place-items-center rounded-full border-0 bg-ink text-paper"
            >
              <Icon name="arrow" />
            </button>
          </form>

          <div>
            <p className="text-[0.85rem] font-semibold uppercase tracking-[0.06em]">Catégories</p>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/explorer?cat=${category.id}`}
                  className="grid justify-items-center gap-1 text-sm no-underline"
                >
                  <Icon
                    name={category.icon}
                    className="h-8 w-8 transition-transform hover:-translate-y-1 hover:text-leaf"
                  />
                  <span>{category.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <OfferPhoto
          tone="#5d8a3a"
          imageSlug="hero"
          alt="Une vendeuse souriante tient une botte de brèdes"
          className="aspect-[4/3.2] lg:aspect-auto lg:min-h-[30rem]"
        />
      </section>

      <section className="px-pad py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="after:mt-3 after:block after:h-[3px] after:w-10 after:bg-lime">
            Offres à ne pas manquer
          </h2>
          <Link
            to="/explorer"
            className="inline-flex items-center gap-2 font-medium underline underline-offset-[5px]"
          >
            Voir toutes les offres
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((offer, index) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              index={index}
              remaining={remainingQuantity(offer, reservedQuantities[offer.id] ?? 0)}
              favorite={favorites.includes(offer.id)}
              onToggleFavorite={toggleFavorite}
              onSelect={(selected) => navigate(`/explorer?offer=${selected.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="bg-ink px-pad py-16 text-paper">
        <p className={`${EYEBROW_CLASS} text-lime`}>Comment ça marche</p>
        <h2 className="mt-3 max-w-[16ch]">Trois gestes, un panier sauvé.</h2>
        <ol className="mt-10 grid gap-9 md:grid-cols-3 md:gap-16">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[3.5rem_1fr] gap-4">
              <span aria-hidden="true" className="font-serif text-[3.2rem] leading-[0.9] text-lime">
                {index + 1}
              </span>
              <div>
                <h3>{step.title}</h3>
                <p className="mt-2 max-w-[34ch] text-mint">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-pad py-16">
        <h2 className="max-w-[14ch]">Ce que nous avons déjà sauvé</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-end">
          <p className="max-w-[26ch] text-[1.2rem]">
            Chaque réservation évite qu’un produit encore bon finisse à la poubelle.
          </p>
          <Stat value={impactStats.kgSaved} label="kg sauvés" />
          <Stat value={impactStats.partnerMerchants} label="commerces partenaires" />
          <Stat value={impactStats.mealsShared} label="repas partagés" />
        </div>
      </section>
    </>
  )
}
