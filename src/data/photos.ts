/**
 * Slugs de photos réellement présents dans `public/img/`.
 * La maquette affiche `img/<slug>.jpg` : déposer le fichier puis ajouter son
 * slug ici. Tant que le slug est absent, la teinte (`tone`) de l’offre reste
 * affichée, exactement comme dans le prototype.
 */
const PHOTO_SLUGS: ReadonlySet<string> = new Set<string>([])

/** URL de la photo d’une offre, ou `null` si le fichier n’existe pas encore. */
export function photoUrlOf(imageSlug: string): string | null {
  return PHOTO_SLUGS.has(imageSlug) ? `/img/${imageSlug}.jpg` : null
}
