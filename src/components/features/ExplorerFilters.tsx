import { categories } from '../../data/mockData'
import {
  PLACE_VALUES,
  PlaceSchema,
  SORT_OPTION_VALUES,
  SortOptionSchema,
  type SortOption,
} from '../../schemas'
import { useFilterStore } from '../../store'
import { Icon } from '../ui/Icon'

const SORT_LABELS: Record<SortOption, string> = {
  off: 'Plus grosse réduction',
  pa: 'Prix croissant',
  pd: 'Prix décroissant',
  end: 'Se termine bientôt',
}

const chipClass = (active: boolean): string =>
  [
    'cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-medium',
    active
      ? 'bg-ink text-paper'
      : 'bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
  ].join(' ')

const selectClass =
  'cursor-pointer appearance-none border-0 border-b-[1.5px] border-ink bg-transparent py-1 pl-1 pr-7'

/**
 * Barre de la page Explorer : recherche, tri, quartier et chips de catégories.
 * Chaque changement est écrit dans `useFilterStore` (puis synchro dans l’URL).
 */
export function ExplorerFilters() {
  const query = useFilterStore((state) => state.query)
  const categoryId = useFilterStore((state) => state.categoryId)
  const place = useFilterStore((state) => state.place)
  const sort = useFilterStore((state) => state.sort)
  const setQuery = useFilterStore((state) => state.setQuery)
  const setCategory = useFilterStore((state) => state.setCategory)
  const setPlace = useFilterStore((state) => state.setPlace)
  const setSort = useFilterStore((state) => state.setSort)

  const handlePlaceChange = (value: string): void => {
    const parsed = PlaceSchema.safeParse(value)
    setPlace(parsed.success ? parsed.data : null)
  }

  const handleSortChange = (value: string): void => {
    const parsed = SortOptionSchema.safeParse(value)
    if (parsed.success) setSort(parsed.data)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="flex min-w-[15rem] flex-1 items-center gap-3 rounded-full bg-search py-1 pl-5 pr-1 shadow-[0_0_0_1px_var(--color-line)] focus-within:shadow-[0_0_0_2px_var(--color-leaf)]"
        >
          <Icon name="search" className="text-ink-2" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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

        <div className="relative inline-flex items-center">
          <select
            aria-label="Trier les offres"
            value={sort}
            onChange={(event) => handleSortChange(event.target.value)}
            className={selectClass}
          >
            {SORT_OPTION_VALUES.map((option) => (
              <option key={option} value={option}>
                {SORT_LABELS[option]}
              </option>
            ))}
          </select>
          <Icon name="chev" className="pointer-events-none absolute right-1" />
        </div>

        <div className="relative inline-flex items-center">
          <select
            aria-label="Filtrer par quartier"
            value={place ?? ''}
            onChange={(event) => handlePlaceChange(event.target.value)}
            className={selectClass}
          >
            <option value="">Tous les quartiers</option>
            {PLACE_VALUES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Icon name="chev" className="pointer-events-none absolute right-1" />
        </div>
      </div>

      <div
        role="group"
        aria-label="Filtrer par catégorie"
        className="mt-4 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={categoryId === null}
          onClick={() => setCategory(null)}
          className={chipClass(categoryId === null)}
        >
          Tout
        </button>
        {categories.map((category) => {
          const active = categoryId === category.id
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(active ? null : category.id)}
              className={chipClass(active)}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </>
  )
}
