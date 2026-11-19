import { useEffect, useRef, useState, type FormEvent } from 'react'
import { z } from 'zod'
import type { Place, UserProfile, UserRole } from '../schemas'
import { useUserStore } from '../store'

/** Valeurs brutes du formulaire « Mon profil » (chaînes saisies). */
export interface ProfileFormValues {
  name: string
  role: string
  zone: string
  bio: string
}

export type ProfileField = keyof ProfileFormValues

/** Erreur par champ, issue des messages Zod. */
export type ProfileFormErrors = Partial<Record<ProfileField, string>>

const FIELD_NAMES: readonly ProfileField[] = ['name', 'role', 'zone', 'bio']

const fromProfile = (profile: UserProfile): ProfileFormValues => ({
  name: profile.name,
  role: profile.role,
  zone: profile.zone,
  bio: profile.bio,
})

type ZodIssue = z.ZodError['issues'][number]

/** Traduit une issue Zod en message français lisible (sinon le message brut). */
function issueMessage(issue: ZodIssue): string {
  switch (issue.code) {
    case 'too_small':
      return issue.origin === 'string' ? `${issue.minimum} caractères minimum.` : issue.message
    case 'too_big':
      return issue.origin === 'string' ? `${issue.maximum} caractères maximum.` : issue.message
    case 'invalid_value':
      return 'Choisissez une option dans la liste.'
    case 'invalid_type':
      return 'Ce champ est requis.'
    default:
      return issue.message
  }
}

/** Regroupe les issues Zod par champ (la première issue d’un champ gagne). */
function mapIssues(error: z.ZodError): ProfileFormErrors {
  const errors: ProfileFormErrors = {}
  for (const issue of error.issues) {
    const [head] = issue.path
    const field = FIELD_NAMES.find((name) => name === head)
    if (field !== undefined && errors[field] === undefined) {
      errors[field] = issueMessage(issue)
    }
  }
  return errors
}

export interface ProfileFormState {
  values: ProfileFormValues
  errors: ProfileFormErrors
  /** Feedback « Profil enregistré. » après une sauvegarde réussie. */
  saved: boolean
  setValue: (field: ProfileField, value: string) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

/**
 * État du formulaire « Mon profil » : valeurs, erreurs Zod et sauvegarde via
 * `useUserStore.updateProfile()`. Le formulaire se resynchronise du store
 * quand le profil change ailleurs (« Réinitialiser la démo »), sans effacer
 * le message de notre propre sauvegarde.
 */
export function useProfileForm(): ProfileFormState {
  const profile = useUserStore((state) => state.profile)
  const updateProfile = useUserStore((state) => state.updateProfile)
  const [values, setValues] = useState<ProfileFormValues>(() => fromProfile(profile))
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [saved, setSaved] = useState(false)
  const lastSaved = useRef<UserProfile | null>(null)

  useEffect(() => {
    if (lastSaved.current === profile) return
    setValues(fromProfile(profile))
    setErrors({})
    setSaved(false)
  }, [profile])

  const setValue = (field: ProfileField, value: string): void => {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => {
      if (previous[field] === undefined) return previous
      const next = { ...previous }
      delete next[field]
      return next
    })
    setSaved(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const result = updateProfile({
      name: values.name.trim(),
      role: values.role as UserRole,
      zone: values.zone as Place,
      bio: values.bio.trim(),
    })

    if (!result.ok) {
      const nextErrors = mapIssues(result.error)
      setErrors(nextErrors)
      setSaved(false)
      const [firstField] = Object.keys(nextErrors)
      if (firstField !== undefined) document.getElementById(`profile-${firstField}`)?.focus()
      return
    }

    lastSaved.current = result.profile
    setValues(fromProfile(result.profile))
    setErrors({})
    setSaved(true)
  }

  return { values, errors, saved, setValue, handleSubmit }
}
