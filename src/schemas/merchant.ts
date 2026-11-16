import { z } from 'zod'
import { PlaceSchema } from './enums'

const SlugSchema = z
  .string()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Doit être un slug (minuscules, chiffres et tirets)')

/**
 * Un commerce (« vendeur » dans la maquette) : nom affiché sur l’annonce
 * et quartier où se situe le point de retrait.
 */
export const MerchantSchema = z.strictObject({
  id: SlugSchema,
  name: z.string().min(2).max(80),
  place: PlaceSchema,
})
export type Merchant = z.infer<typeof MerchantSchema>
export type MerchantInput = z.input<typeof MerchantSchema>
