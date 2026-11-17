interface PagePlaceholderProps {
  eyebrow: string
  title: string
  description: string
}

/** Gabarit des pages temporaires de l’étape 4A (contenu à câbler ensuite). */
export function PagePlaceholder({ eyebrow, title, description }: PagePlaceholderProps) {
  return (
    <section className="px-pad py-14">
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2.4rem,6vw,4.2rem)]">{title}</h1>
      <p className="mt-4 max-w-[46ch] text-ink-2">{description}</p>
      <p className="mt-10 inline-block rounded-[2rem_0.6rem_2rem_0.6rem] bg-paper-2 px-5 py-4 text-sm text-ink-2">
        Étape 4A — structure et routage : cette page est un gabarit, ses données
        seront câblées aux stores à l’étape suivante.
      </p>
    </section>
  )
}
