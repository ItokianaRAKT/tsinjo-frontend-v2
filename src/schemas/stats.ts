import { z } from 'zod'

/** Chiffres d’impact affichés dans la section « Ce que nous avons déjà sauvé ». */
export const ImpactStatsSchema = z.strictObject({
  kgSaved: z.number().int().min(0),
  partnerMerchants: z.number().int().min(0),
  mealsShared: z.number().int().min(0),
})
export type ImpactStats = z.infer<typeof ImpactStatsSchema>
export type ImpactStatsInput = z.input<typeof ImpactStatsSchema>
