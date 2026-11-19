import { useState } from 'react'
import { resetDemo } from '../../store'
import { Icon } from '../ui/Icon'

const BUTTON_CLASS =
  'cursor-pointer justify-self-start rounded-full border-0 bg-transparent px-4 py-[0.45rem] text-[0.88rem] font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper'

/**
 * Zone de gestion de la démo (maquette : bouton `data-resetdemo`) : rappelle
 * ce qui est remis à zéro, puis confirme le retour à l’état initial.
 */
export function DemoResetPanel() {
  const [done, setDone] = useState(false)

  const handleReset = (): void => {
    resetDemo()
    setDone(true)
  }

  return (
    <section className="grid gap-3 rounded-[2rem_0.6rem_2rem_0.6rem] border-[1.5px] border-dashed border-line px-6 py-5">
      <h2 className="text-h3">Démo</h2>
      <p className="text-sm text-ink-2">
        Profil, favoris, réservations, publications et filtres retrouvent leurs valeurs
        initiales.
      </p>

      <button type="button" data-resetdemo onClick={handleReset} className={BUTTON_CLASS}>
        Réinitialiser la démo
      </button>

      {done && (
        <p role="status" className="flex items-center gap-2 font-semibold text-leaf">
          <Icon name="check" />
          Démo réinitialisée.
        </p>
      )}
    </section>
  )
}
