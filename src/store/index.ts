import { useCartStore } from './useCartStore'
import { useFilterStore } from './useFilterStore'
import { useOfferStore } from './useOfferStore'
import { useUserStore } from './useUserStore'

export * from './selectors'
export * from './useCartStore'
export * from './useFilterStore'
export * from './useOfferStore'
export * from './useUserStore'

/**
 * Remet la démo à son état initial : offres publiées, réservations,
 * stock réservé, profil, favoris et filtres (bouton « Réinitialiser la démo »).
 */
export function resetDemo(): void {
  useCartStore.getState().reset()
  useOfferStore.getState().reset()
  useUserStore.getState().reset()
  useFilterStore.getState().resetFilters()
}
