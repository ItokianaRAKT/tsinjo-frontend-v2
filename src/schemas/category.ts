import { z } from 'zod'

/** Identifiant technique d’une catégorie (utilisable dans les URLs). */
export const CATEGORY_ID_VALUES = [
  'fruits',
  'legumes',
  'boulangerie',
  'produits-laitiers',
  'autres',
] as const
export const CategoryIdSchema = z.enum(CATEGORY_ID_VALUES)
export type CategoryId = z.infer<typeof CategoryIdSchema>

/** Icône associée à une catégorie (sprite de la maquette). */
export const CATEGORY_ICON_VALUES = [
  'apple',
  'carrot',
  'bread',
  'milk',
  'dots',
] as const
export const CategoryIconSchema = z.enum(CATEGORY_ICON_VALUES)
export type CategoryIcon = z.infer<typeof CategoryIconSchema>

export const CategorySchema = z.strictObject({
  id: CategoryIdSchema,
  label: z.string().min(2).max(40),
  icon: CategoryIconSchema,
})
export type Category = z.infer<typeof CategorySchema>
export type CategoryInput = z.input<typeof CategorySchema>
