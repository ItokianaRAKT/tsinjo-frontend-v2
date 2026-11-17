import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

/**
 * Structure globale : en-tête, contenu de la route (`Outlet`), pied de page.
 * Le menu mobile se referme à chaque navigation (remontage par `key`).
 */
export function MainLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar key={pathname} />
      <main id="app" ref={mainRef} tabIndex={-1} className="grow outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
