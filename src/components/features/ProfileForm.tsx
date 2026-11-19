import { useProfileForm, type ProfileField } from '../../hooks/useProfileForm'
import { PLACE_VALUES, USER_ROLE_VALUES } from '../../schemas'
import { Icon } from '../ui/Icon'
import { SelectField, TextField } from '../ui/FormControls'

const roleOptions = USER_ROLE_VALUES.map((role) => ({ value: role, label: role }))
const placeOptions = PLACE_VALUES.map((place) => ({ value: place, label: place }))

const SUBMIT_CLASS =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-ink px-6 py-3.5 font-semibold text-paper transition-colors hover:bg-leaf'

/**
 * Formulaire d’édition du profil (maquette : `pageProfile`, formulaire `#prf`) :
 * validation Zod déléguée à `useUserStore.updateProfile()` via le hook, avec
 * erreurs par champ et feedback de sauvegarde.
 */
export function ProfileForm() {
  const { values, errors, saved, setValue, handleSubmit } = useProfileForm()
  const pick = (field: ProfileField) => (value: string): void => setValue(field, value)

  return (
    <form id="profile-form" noValidate onSubmit={handleSubmit}>
      <h2 className="text-h2">Vos informations</h2>
      <span aria-hidden="true" className="mt-3 mb-6 block h-[3px] w-10 bg-lime" />

      <TextField
        id="profile-name"
        label="Nom"
        value={values.name}
        error={errors.name}
        maxLength={80}
        onChange={pick('name')}
      />
      <SelectField
        id="profile-role"
        label="Profil"
        value={values.role}
        error={errors.role}
        options={roleOptions}
        onChange={pick('role')}
      />
      <SelectField
        id="profile-zone"
        label="Quartier"
        value={values.zone}
        error={errors.zone}
        options={placeOptions}
        onChange={pick('zone')}
      />
      <TextField
        id="profile-bio"
        label="À propos"
        value={values.bio}
        error={errors.bio}
        maxLength={200}
        multiline
        onChange={pick('bio')}
      />

      {saved && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-[2rem_0.6rem_2rem_0.6rem] bg-paper-2 px-5 py-4 font-semibold"
        >
          <Icon name="check" className="text-leaf" />
          Profil enregistré.
        </p>
      )}

      <button type="submit" className={SUBMIT_CLASS}>
        Enregistrer
      </button>
    </form>
  )
}
