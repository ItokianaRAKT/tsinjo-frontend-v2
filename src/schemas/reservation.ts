import { z } from 'zod'
import { ReservationStatusSchema } from './enums'
import { OfferIdSchema } from './offer'

/**
 * Une réservation d’offre : quantité mise de côté, code de retrait
 * `TSJ-XXXX` à présenter au vendeur, et statut du cycle de récupération.
 */
export const ReservationSchema = z.strictObject({
  id: z.number().int().positive(),
  offerId: OfferIdSchema,
  userId: z.string().min(2).max(60),
  quantity: z.number().int().min(1),
  status: ReservationStatusSchema,
  code: z.string().regex(/^TSJ-\d{4}$/, 'Format attendu : TSJ-1234'),
})
export type Reservation = z.infer<typeof ReservationSchema>
export type ReservationInput = z.input<typeof ReservationSchema>
