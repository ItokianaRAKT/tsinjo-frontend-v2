import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { selectActiveReservationCount, useCartStore, useUserStore } from '../../store'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

interface NavItem {
  to: string
  label: string
  /** Affiche la pastille du nombre de réservations actives. */
  withBadge?: boolean
  /** Masqué sur desktop : l’avatar prend le relais. */
  mobileOnly?: boolean
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/explorer', label: 'Explorer' },
  { to: '/reservations', label: 'Réservations', withBadge: true },
  { to: '/merchant', label: 'Espace commerçant' },
  { to: '/profile', label: 'Mon profil', mobileOnly: true },
]

const linkClass = (isActive: boolean, mobileOnly = false): string =>
  [
    'font-serif text-[2.4rem] font-bold no-underline lg:border-b-2 lg:font-sans lg:text-[0.95rem] lg:font-medium',
    mobileOnly ? 'lg:hidden' : '',
    isActive ? 'text-lime lg:border-lime lg:text-ink' : 'text-paper lg:border-transparent lg:text-ink',
  ].join(' ')

/**
 * En-tête de la maquette : logo, navigation (overlay mobile / rangée desktop),
 * recherche, avatar du profil et bouton burger.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeReservations = useCartStore(selectActiveReservationCount)
  const profile = useUserStore((state) => state.profile)
  const initial = (profile.name.charAt(0) || 'T').toUpperCase()

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-paper px-pad py-[0.9rem]">
      <Link to="/" aria-label="Tsinjo, accueil" className="shrink-0 no-underline">
        <Logo dot />
      </Link>

      <nav
        id="nav"
        aria-label="Navigation principale"
        className={`${menuOpen ? 'flex' : 'hidden'} fixed inset-0 z-30 flex-col justify-center gap-5 bg-ink p-pad lg:static lg:flex lg:flex-row lg:items-center lg:gap-11 lg:bg-transparent lg:p-0`}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => linkClass(isActive, item.mobileOnly)}
          >
            {item.label}
            {item.withBadge && activeReservations > 0 && (
              <span className="ml-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-lime px-1.5 font-sans text-sm font-semibold text-ink">
                {activeReservations}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative z-40 flex items-center gap-2">
        <Link
          to="/explorer"
          aria-label="Rechercher une offre"
          className={`${menuOpen ? 'hidden lg:flex' : 'flex'} items-center justify-center p-2 text-ink`}
        >
          <Icon name="search" />
        </Link>

        <Link
          to="/profile"
          aria-label="Mon profil"
          className="hidden h-[2.4rem] w-[2.4rem] place-items-center rounded-full bg-leaf text-base font-semibold text-paper no-underline lg:grid"
        >
          {initial}
        </Link>
        <Icon name="chev" className="hidden text-ink lg:block" />

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="nav"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className={`flex items-center justify-center border-0 bg-transparent p-2 lg:hidden ${
            menuOpen ? 'text-paper' : 'text-ink'
          }`}
        >
          <Icon name={menuOpen ? 'x' : 'menu'} />
        </button>
      </div>
    </header>
  )
}
