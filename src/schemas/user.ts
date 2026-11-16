import { z } from 'zod'
import { PlaceSchema, UserRoleSchema } from './enums'

const UserIdSchema = z
  .string()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Doit être un slug (minuscules, chiffres et tirets)')

/** Profil utilisateur affiché dans « Mon profil » de la maquette. */
export const UserProfileSchema = z.strictObject({
  id: UserIdSchema,
  name: z.string().min(2).max(80),
  role: UserRoleSchema,
  zone: PlaceSchema,
  bio: z.string().max(200),
})
export type UserProfile = z.infer<typeof UserProfileSchema>
export type UserProfileInput = z.input<typeof UserProfileSchema>
