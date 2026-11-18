import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CategoryIdSchema, PlaceSchema, SortOptionSchema } from '../schemas'
import { DEFAULT_FILTERS, useFilterStore, type FilterState } from '../store'

/** Filtres lisibles depuis l’URL (`?q=&cat=&place=&sort=`), valeurs invalides ignorées. */
function parseFilters(params: URLSearchParams): FilterState {
  const category = CategoryIdSchema.safeParse(params.get('cat'))
  const place = PlaceSchema.safeParse(params.get('place'))
  const sort = SortOptionSchema.safeParse(params.get('sort'))

  return {
    query: params.get('q') ?? '',
    categoryId: category.success ? category.data : null,
    place: place.success ? place.data : null,
    sort: sort.success ? sort.data : DEFAULT_FILTERS.sort,
  }
}

/** Représentation canonique des filtres dans l’URL (paramètres vides omis). */
function serializeFilters(filters: FilterState): string {
  const params = new URLSearchParams()
  if (filters.query !== '') params.set('q', filters.query)
  if (filters.categoryId !== null) params.set('cat', filters.categoryId)
  if (filters.place !== null) params.set('place', filters.place)
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set('sort', filters.sort)
  return params.toString()
}

/**
 * Synchronisation bidirectionnelle entre `useFilterStore` et l’URL :
 * partage / actualisation de la page (URL → état) et mise à jour sans
 * polluer l’historique (état → URL, `replace: true`).
 *
 * Chaque sens ne réagit qu’au signal de l’autre côté (l’URL changée d’un côté,
 * la chaîne serialisée de l’autre) : sinon les deux effets se corrigent
 * mutuellement avec des valeurs périmées et la liste oscille.
 */
export function useFilterUrlSync(): void {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useFilterStore((state) => state.query)
  const categoryId = useFilterStore((state) => state.categoryId)
  const place = useFilterStore((state) => state.place)
  const sort = useFilterStore((state) => state.sort)

  const serialized = serializeFilters({ query, categoryId, place, sort })

  // URL → état : uniquement au chargement ou quand l’URL change. L’état est lu
  // via `getState()` pour que l’effet ne dépende que de `searchParams`.
  useEffect(() => {
    const fromUrl = parseFilters(searchParams)
    const state = useFilterStore.getState()
    const differs =
      fromUrl.query !== state.query ||
      fromUrl.categoryId !== state.categoryId ||
      fromUrl.place !== state.place ||
      fromUrl.sort !== state.sort
    if (differs) state.setFilters(fromUrl)
  }, [searchParams])

  // État → URL : seule la chaîne serialisée compte (l’URL déjà écrite est
  // ignorée, ce qui évite toute boucle aller-retour).
  useEffect(() => {
    if (serialized === searchParams.toString()) return
    setSearchParams(serialized, { replace: true })
  }, [serialized, searchParams, setSearchParams])
}
