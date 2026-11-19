import { categories } from '../../data/mockData'
import { usePublishOfferForm, type PublishFormValues } from '../../hooks/usePublishOfferForm'
import { PICKUP_WINDOW_VALUES, PLACE_VALUES, UNIT_VALUES } from '../../schemas'
import { Icon } from '../ui/Icon'
import { NumberField, SelectField, TextField } from '../ui/FormControls'

const LEGEND_CLASS = 'mb-4 font-serif text-[1.5rem] font-bold'
const FIELDSET_CLASS = 'mb-9 border-0 p-0'
const SUBMIT_CLASS =
  'inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-ink px-6 py-3.5 font-semibold text-paper transition-colors hover:bg-leaf'

const categoryOptions = categories.map(({ id, label }) => ({ value: id, label }))
const unitOptions = UNIT_VALUES.map((unit) => ({ value: unit, label: unit }))
const pickupOptions = PICKUP_WINDOW_VALUES.map((slot) => ({ value: slot, label: slot }))
const placeOptions = PLACE_VALUES.map((area) => ({ value: area, label: area }))

/**
 * Formulaire de création d’une offre anti-gaspi (maquette : `pagePublish`) :
 * la validation revient à `useOfferStore.publishOffer()` via le hook, qui
 * affiche les issues Zod par champ puis confirme la publication.
 */
export function PublishOfferForm() {
  const { values, errors, success, setValue, handleSubmit } = usePublishOfferForm()
  const pick = (field: keyof PublishFormValues) => (value: string): void => setValue(field, value)

  return (
    <form id="publish-form" noValidate onSubmit={handleSubmit} className="scroll-mt-24">
      <fieldset className={FIELDSET_CLASS}>
        <legend className={LEGEND_CLASS}>Le produit</legend>
        <TextField
          id="name"
          label="Nom du produit"
          value={values.name}
          error={errors.name}
          maxLength={50}
          placeholder="Ex. Mangues mûres"
          onChange={pick('name')}
        />
        <SelectField
          id="categoryId"
          label="Catégorie"
          value={values.categoryId}
          error={errors.categoryId}
          options={categoryOptions}
          onChange={pick('categoryId')}
        />
        <TextField
          id="description"
          label="Description"
          value={values.description}
          error={errors.description}
          maxLength={500}
          multiline
          placeholder="État, goût, conseils de conservation…"
          onChange={pick('description')}
        />
      </fieldset>

      <fieldset className={FIELDSET_CLASS}>
        <legend className={LEGEND_CLASS}>Quantité et prix</legend>
        <div className="grid gap-x-6 sm:grid-cols-2">
          <NumberField
            id="quantity"
            label="Quantité"
            min={1}
            value={values.quantity}
            error={errors.quantity}
            onChange={pick('quantity')}
          />
          <SelectField
            id="unit"
            label="Unité"
            value={values.unit}
            error={errors.unit}
            options={unitOptions}
            onChange={pick('unit')}
          />
          <NumberField
            id="originalPrice"
            label="Prix initial (Ar) (facultatif)"
            min={1}
            value={values.originalPrice}
            error={errors.originalPrice}
            onChange={pick('originalPrice')}
          />
          <NumberField
            id="price"
            label="Prix réduit (Ar)"
            min={1}
            value={values.price}
            error={errors.price}
            onChange={pick('price')}
          />
        </div>
      </fieldset>

      <fieldset className={FIELDSET_CLASS}>
        <legend className={LEGEND_CLASS}>Disponibilité et lieu</legend>
        <SelectField
          id="pickupUntil"
          label="À récupérer avant"
          value={values.pickupUntil}
          error={errors.pickupUntil}
          options={pickupOptions}
          onChange={pick('pickupUntil')}
        />
        <SelectField
          id="place"
          label="Quartier"
          value={values.place}
          error={errors.place}
          options={placeOptions}
          onChange={pick('place')}
        />
      </fieldset>

      {errors.form !== undefined && (
        <p role="alert" className="mb-4 font-semibold text-warn">
          {errors.form}
        </p>
      )}

      {success !== null && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-[2rem_0.6rem_2rem_0.6rem] bg-paper-2 px-5 py-4 font-semibold"
        >
          <Icon name="check" className="text-leaf" />
          Offre « {success} » publiée ! Elle apparaît dans « Mes publications ».
        </p>
      )}

      <button type="submit" className={SUBMIT_CLASS}>
        Publier l’offre
        <Icon name="arrow" />
      </button>
    </form>
  )
}
