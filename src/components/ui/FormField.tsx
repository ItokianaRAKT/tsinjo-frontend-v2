import type { ReactNode } from 'react'

/** Contrôles DOM transmis au rendu du champ (id partagé + accessibilité). */
interface FieldControl {
  id: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

interface FormFieldProps {
  id: string
  label: string
  /** Message d’erreur (issue Zod) affiché sous le contrôle. */
  error?: string
  children: (control: FieldControl) => ReactNode
}

/**
 * Champ de formulaire : label, contrôle rendu par le parent et message
 * d’erreur relié via `aria-describedby` (reprend `.field` de la maquette).
 */
export function FormField({ id, label, error, children }: FormFieldProps) {
  const invalid = error !== undefined
  const errorId = `${id}-error`

  return (
    <div className="mb-[1.4rem] grid gap-[0.35rem]">
      <label htmlFor={id} className="text-[0.92rem] font-semibold">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': invalid,
        'aria-describedby': invalid ? errorId : undefined,
      })}
      {invalid && (
        <p id={errorId} role="alert" className="text-[0.85rem] text-warn">
          {error}
        </p>
      )}
    </div>
  )
}
