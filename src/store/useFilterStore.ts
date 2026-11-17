import { create } from 'zustand'
import type { CategoryId, Merchant, Offer, Place, SortOption } from '../schemas'
import { discountPercent, merchantNameOf } from './selectors'

/** État des filtres de la page « Explorer » (recherche, catégorie, quartier, tri). */
export interface FilterState {
  /** Texte libre de la barre de recherche. */
  query: string
  /** `null` = « Tout » (aucun filtre catégorie). */
  categoryId: CategoryId | null
  /** `null` = « Tous les quartiers ». */
  place: Place | null
  sort: SortOption
}

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  categoryId: null,
  place: null,
  sort: 'off',
}

interface FilterActions {
  setQuery: (query: string) => void
  setCategory: (categoryId: CategoryId | null) => void
  setPlace: (place: Place | null) => void
  setSort: (sort: SortOption) => void
  /** Applique un sous-ensemble de filtres (synchro avec l’URL de la page). */
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}

export type FilterStore = FilterState & FilterActions

/** Tri de la page « Explorer » (options du `<select id="sort">`). */
const SORTERS: Record<SortOption, (a: Offer, b: Offer) => number> = {
  off: (a, b) => discountPercent(b) - discountPercent(a),
  pa: (a, b) => a.price - b.price,
  pd: (a, b) => b.price - a.price,
  end: (a, b) => a.pickupUntil.localeCompare(b.pickupUntil, 'fr'),
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...DEFAULT_FILTERS,
  setQuery: (query) => set({ query }),
  setCategory: (categoryId) => set({ categoryId }),
  setPlace: (place) => set({ place }),
  setSort: (sort) => set({ sort }),
  setFilters: (filters) => set(filters),
  resetFilters: () => set(DEFAULT_FILTERS),
}))

/**
 * Filtre puis trie les offres selon l’état courant des filtres.
 * La recherche matche le nom du produit, le nom du vendeur et le quartier,
 * comme dans la maquette (`renderList`).
 */
export function filterOffers(
  offers: readonly Offer[],
  merchants: readonly Merchant[],
  filters: FilterState,
): Offer[] {
  const query = filters.query.trim().toLowerCase()

  const filtered = offers.filter((offer) => {
    if (filters.categoryId !== null && offer.categoryId !== filters.categoryId) {
      return false
    }
    if (filters.place !== null && offer.place !== filters.place) {
      return false
    }
    if (query === '') {
      return true
    }
    const haystack = `${offer.name} ${merchantNameOf(offer, merchants)} ${offer.place}`
    return haystack.toLowerCase().includes(query)
  })

  return filtered.sort(SORTERS[filters.sort])
}
