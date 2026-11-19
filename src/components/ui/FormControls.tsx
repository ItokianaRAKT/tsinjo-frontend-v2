import type { ChangeEvent } from 'react'
import { FormField } from './FormField'

interface ControlProps {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}

interface TextFieldProps extends ControlProps {
  maxLength: number
  placeholder?: string
  multiline?: boolean
}

interface NumberFieldProps extends ControlProps {
  min: number
}

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends ControlProps {
  options: readonly SelectOption[]
}

/** Style commun des contrôles (`.field input/select/textarea` de la maquette). */
const controlClass = (invalid: boolean): string =>
  [
    'w-full rounded-none border-0 border-b-[1.5px] bg-transparent px-0 py-[0.55rem] text-ink',
    'focus:outline-none focus:border-leaf focus:shadow-[0_2px_0_var(--color-leaf)]',
    invalid ? 'border-warn' : 'border-ink',
  ].join(' ')

/** Champ texte (ou zone de texte si `multiline`) avec compteur de caractères. */
export function TextField({
  id,
  label,
  value,
  error,
  onChange,
  maxLength,
  placeholder,
  multiline = false,
}: TextFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      {(control) => {
        const className = controlClass(control['aria-invalid'])
        const handle = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
          onChange(event.target.value)
        return multiline ? (
          <textarea
            {...control}
            rows={4}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={handle}
            className={`${className} min-h-[6rem] resize-y`}
          />
        ) : (
          <input
            {...control}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={handle}
            className={className}
          />
        )
      }}
    </FormField>
  )
}

/** Champ numérique entier (`type="number"`), rejeté par Zod si vide ou invalide. */
export function NumberField({ id, label, value, error, onChange, min }: NumberFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      {(control) => (
        <input
          {...control}
          type="number"
          min={min}
          inputMode="numeric"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={controlClass(control['aria-invalid'])}
        />
      )}
    </FormField>
  )
}

/** Sélecteur à options (`.field select` de la maquette). */
export function SelectField({ id, label, value, error, onChange, options }: SelectFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      {(control) => (
        <select
          {...control}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={controlClass(control['aria-invalid'])}
        >
          <option value="">Choisir…</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  )
}
