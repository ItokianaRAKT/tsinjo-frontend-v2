import { Icon } from '../ui/Icon'

interface QuantityStepperProps {
  quantity: number
  /** Stock restant : borne haute des boutons + / −. */
  max: number
  /** Total formaté affiché à droite (prix × quantité). */
  totalLabel: string
  onChange: (quantity: number) => void
}

const stepButtonClass =
  'grid h-[2.6rem] w-[2.6rem] cursor-pointer place-items-center rounded-full border-[1.5px] border-ink bg-transparent disabled:cursor-not-allowed disabled:opacity-40'

/** Sélecteur de quantité « − 1 + » de la maquette, avec total en direct. */
export function QuantityStepper({ quantity, max, totalLabel, onChange }: QuantityStepperProps) {
  return (
    <div className="my-4 inline-flex items-center gap-4">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className={stepButtonClass}
      >
        <Icon name="minus" />
      </button>
      <output aria-live="polite" className="min-w-[2rem] text-center text-xl font-semibold">
        {quantity}
      </output>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className={stepButtonClass}
      >
        <Icon name="plus" />
      </button>
      <span className="text-ink-2">{totalLabel}</span>
    </div>
  )
}
