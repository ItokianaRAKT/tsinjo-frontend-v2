interface LogoProps {
  /** Taille du texte (la maquette : 2.1rem en header, 1.8rem en pied de page). */
  className?: string
  /** Point feuille au-dessus du « T » (règle `.top .logo::before`). */
  dot?: boolean
}

/** Mot-symbole « Tsinjo » (serif + point feuille). */
export function Logo({ className = 'text-[2.1rem]', dot = false }: LogoProps) {
  return (
    <span
      className={`relative font-serif font-bold leading-none tracking-[-0.03em] text-ink ${className}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="absolute left-[0.3em] top-[-0.35em] h-[0.45em] w-[0.45em] rotate-[-20deg] rounded-[0_100%_0_100%] bg-leaf"
        />
      )}
      Tsinjo
    </span>
  )
}
