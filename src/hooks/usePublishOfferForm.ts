import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import type { CategoryId, PickupWindow, Place, Unit } from '../schemas'
import { useOfferStore, useUserStore, type OfferDraft } from '../store'

/** Valeurs brutes du formulaire de publication (chaînes saisies). */
export interface PublishFormValues {
  name: string
  description: string
  categoryId: string
  quantity: string
  unit: string
  originalPrice: string
  price: string
  pickupUntil: string
  place: string
}

/** Erreur par champ, plus la clé `form` pour les issues hors champs. */
export type PublishFormErrors = Partial<Record<keyof PublishFormValues | 'form', string>>

type PublishField = keyof PublishFormValues

const EMPTY_VALUES: PublishFormValues = {
  name: '', description: '', categoryId: '', quantity: '', unit: '',
  originalPrice: '', price: '', pickupUntil: '', place: '',
}

type ZodIssue = z.ZodError['issues'][number]

/** Traduit une issue Zod en message français lisible (sinon le message brut). */
function issueMessage(issue: ZodIssue): string {
  switch (issue.code) {
    case 'too_small':
      if (issue.origin === 'string') return `${issue.minimum} caractères minimum.`
      if (issue.origin === 'number') {
        return issue.inclusive
          ? `Au moins ${issue.minimum}.`
          : `Doit être supérieur à ${issue.minimum}.`
      }
      return issue.message
    case 'too_big':
      if (issue.origin === 'string') return `${issue.maximum} caractères maximum.`
      if (issue.origin === 'number') return `Au plus ${issue.maximum}.`
      return issue.message
    case 'invalid_value':
      return 'Choisissez une option dans la liste.'
    case 'invalid_type':
      return issue.expected === 'number' ? 'Saisissez un nombre valide.' : 'Ce champ est requis.'
    default:
      return issue.message
  }
}

/**
 * Champ déduit → sa source : `tone` vient de la catégorie, donc une
 * catégorie invalide la rend invalide — l’erreur revient à « Catégorie ».
 */
const DERIVED_FIELD_ALIAS: Partial<Record<string, PublishField>> = { tone: 'categoryId' }

/** Champ ciblé par une issue (les issues hors formulaire partent sur `form`). */
function fieldKey(path: readonly PropertyKey[]): PublishField | 'form' {
  const [head] = path
  const key = typeof head === 'string' ? DERIVED_FIELD_ALIAS[head] ?? head : null
  return key !== null && key in EMPTY_VALUES ? (key as PublishField) : 'form'
}

/** Regroupe les issues Zod par champ (la première issue d’un champ gagne). */
function mapIssues(error: z.ZodError): PublishFormErrors {
  const errors: PublishFormErrors = {}
  for (const issue of error.issues) {
    const key = fieldKey(issue.path)
    if (errors[key] === undefined) errors[key] = issueMessage(issue)
  }
  return errors
}

/** Saisie numérique → nombre (vide ou illisible : `NaN`, rejeté par Zod). */
function toInt(value: string): number {
  return value.trim() === '' ? Number.NaN : Number.parseInt(value, 10)
}

/**
 * Passe les valeurs au store : les sélecteurs encore vides (`''`) partent
 * tels quels, `publishOffer()` les rejette et leurs issues reviennent ici.
 */
function toDraft(values: PublishFormValues, merchantId: string): OfferDraft {
  return {
    merchantId,
    name: values.name,
    description: values.description,
    categoryId: values.categoryId as CategoryId,
    place: values.place as Place,
    quantity: toInt(values.quantity),
    unit: values.unit as Unit,
    originalPrice: toInt(values.originalPrice),
    price: toInt(values.price),
    pickupUntil: values.pickupUntil as PickupWindow,
  }
}

export interface PublishOfferFormState {
  values: PublishFormValues
  errors: PublishFormErrors
  /** Nom de l’offre publiée avec succès (message de confirmation), sinon `null`. */
  success: string | null
  setValue: (field: PublishField, value: string) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

/** État du formulaire « Publier » : valeurs, erreurs Zod et soumission. */
export function usePublishOfferForm(): PublishOfferFormState {
  const merchantId = useUserStore((state) => state.profile.name)
  const publishOffer = useOfferStore((state) => state.publishOffer)
  const [values, setValues] = useState<PublishFormValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<PublishFormErrors>({})
  const [success, setSuccess] = useState<string | null>(null)

  const setValue = (field: PublishField, value: string): void => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => {
      if (!(field in previous)) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
    setSuccess(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const result = publishOffer(toDraft(values, merchantId))

    if (!result.ok) {
      const nextErrors = mapIssues(result.error)
      setErrors(nextErrors)
      setSuccess(null)
      const firstField = Object.keys(nextErrors).find((key) => key !== 'form')
      if (firstField !== undefined) document.getElementById(firstField)?.focus()
      return
    }

    setErrors({})
    setValues(EMPTY_VALUES)
    setSuccess(result.offer.name)
  }

  return { values, errors, success, setValue, handleSubmit }
}
