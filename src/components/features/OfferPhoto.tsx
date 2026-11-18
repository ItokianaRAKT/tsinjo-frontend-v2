import type { CategoryIcon } from '../../schemas'
import { photoUrlOf } from '../../data/photos'
import { Icon } from '../ui/Icon'

/** Formes organiques reprises des classes `blob-a/b/c` de la maquette. */
const BLOB_VARIANTS: readonly string[] = [
  'rounded-[62%_38%_46%_54%_/_38%_52%_48%_62%]',
  'rounded-[38%_62%_30%_70%_/_55%_40%_60%_45%]',
  'rounded-[70%_30%_58%_42%_/_40%_60%_40%_60%]',
]

interface OfferPhotoProps {
  /** Teinte de repli (`tone` de l’offre) affichée sous la photo. */
  tone: string
  /** Slug du fichier photo (`public/img/<slug>.jpg`). */
  imageSlug: string
  alt: string
  /** Variante de forme, décalée d’une carte à l’autre. */
  variant?: number
  /** Icône centrée, affichée quand la photo est absente. */
  icon?: CategoryIcon
  className?: string
}

/**
 * Visuel d’une offre : photo si elle existe, sinon la teinte de catégorie
 * et son icône (comportement de `.ph` dans la maquette).
 */
export function OfferPhoto({
  tone,
  imageSlug,
  alt,
  variant = 0,
  icon,
  className = '',
}: OfferPhotoProps) {
  const url = photoUrlOf(imageSlug)
  const blob = BLOB_VARIANTS[variant % BLOB_VARIANTS.length]

  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        backgroundColor: tone,
        backgroundImage: url !== null ? `url(${url})` : undefined,
      }}
      className={`grid place-items-center overflow-hidden bg-cover bg-center transition-[border-radius] duration-500 ${blob} ${className}`}
    >
      {url === null && icon !== undefined && (
        <span className="text-6xl text-ink/25">
          <Icon name={icon} />
        </span>
      )}
    </div>
  )
}
