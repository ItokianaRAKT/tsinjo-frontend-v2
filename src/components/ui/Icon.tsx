import type { CSSProperties } from 'react'

/** Noms disponibles dans le sprite `/icons.svg` (icônes de la maquette). */
type IconName =
  | 'search'
  | 'heart'
  | 'arrow'
  | 'pin'
  | 'clock'
  | 'user'
  | 'menu'
  | 'chev'
  | 'x'
  | 'check'
  | 'plus'
  | 'minus'
  | 'leaf'
  | 'apple'
  | 'carrot'
  | 'bread'
  | 'milk'
  | 'dots'

interface IconProps {
  name: IconName
  /** Classes Tailwind complémentaires (couleur, taille d’affichage…). */
  className?: string
  /**
   * Styles en ligne prioritaires (ex. `fill: currentColor` pour le cœur
   * favori : la classe `fill-none` du sprite prime sur `fill-current`).
   */
  style?: CSSProperties
}

/**
 * Icône issue du sprite `/icons.svg` : aucune dépendance npm.
 * `stroke-*` hérité reproduit la classe `.i` de la maquette
 * (trait 1.6, extrémités arrondies, remplissage transparent).
 */
export function Icon({ name, className = '', style }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={style}
      className={`h-[1.35em] w-[1.35em] flex-none fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6] ${className}`}
    >
      <use href={`/icons.svg#i-${name}`} />
    </svg>
  )
}
