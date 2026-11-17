import { PagePlaceholder } from '../components/ui/PagePlaceholder'

/** Route `/` : liste des paniers d’invendus (futur Explorer). */
export function ExplorerPage() {
  return (
    <PagePlaceholder
      eyebrow="Explorer"
      title="Les offres près de chez vous"
      description="Recherche, filtres, favoris et cartes des paniers d’invendus arriveront à l’étape suivante."
    />
  )
}
