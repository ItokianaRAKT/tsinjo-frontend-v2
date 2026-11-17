import { Logo } from '../ui/Logo'

/** Pied de page : `.foot` de la maquette (pas de point feuille sur le logo). */
export function Footer() {
  return (
    <footer className="grid gap-[0.8rem] bg-paper-2 px-pad py-12">
      <Logo className="text-[1.8rem]" />
      <p>
        Chaque produit encore bon mérite un second repas.
        <br />
        Antananarivo, Madagascar.
      </p>
    </footer>
  )
}
