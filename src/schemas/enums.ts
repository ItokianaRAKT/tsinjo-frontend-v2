import { z } from 'zod'

/** Quartiers d’Antananarivo couverts par la maquette. */
export const PLACE_VALUES = [
  'Analakely',
  'Isoraka',
  'Ankorondrano',
  'Behoririka',
  'Andraharo',
  'Isotry',
  'Ambohijatovo',
  '67 Ha',
  'Ambohimanarina',
  'Andravoahangy',
] as const
export const PlaceSchema = z.enum(PLACE_VALUES)
export type Place = z.infer<typeof PlaceSchema>

/** Unités de vente proposées au publier (champ « Unité » du formulaire). */
export const UNIT_VALUES = ['kg', 'pièces', 'pots', 'bottes', 'sacs'] as const
export const UnitSchema = z.enum(UNIT_VALUES)
export type Unit = z.infer<typeof UnitSchema>

/** Créneaux de retrait proposés par le formulaire de publication. */
export const PICKUP_WINDOW_VALUES = [
  'Aujourd’hui, 16 h',
  'Aujourd’hui, 17 h',
  'Aujourd’hui, 18 h',
  'Aujourd’hui, 19 h',
  'Aujourd’hui, 20 h',
  'Demain, 10 h',
  'Demain, 12 h',
  'Cette semaine',
] as const
export const PickupWindowSchema = z.enum(PICKUP_WINDOW_VALUES)
export type PickupWindow = z.infer<typeof PickupWindowSchema>

/** Cycle de vie d’une réservation (côté acheteur). */
export const RESERVATION_STATUS_VALUES = [
  'En attente',
  'Confirmée',
  'Récupérée',
  'Annulée',
] as const
export const ReservationStatusSchema = z.enum(RESERVATION_STATUS_VALUES)
export type ReservationStatus = z.infer<typeof ReservationStatusSchema>

/** Cycle de vie d’une offre publiée (côté commerçant). */
export const PUBLICATION_STATUS_VALUES = [
  'Active',
  'Réservée',
  'Terminée',
  'Retirée',
] as const
export const PublicationStatusSchema = z.enum(PUBLICATION_STATUS_VALUES)
export type PublicationStatus = z.infer<typeof PublicationStatusSchema>

/** Rôles des utilisateurs de la plateforme. */
export const USER_ROLE_VALUES = [
  'Particulier',
  'Commerçant',
  'Producteur',
] as const
export const UserRoleSchema = z.enum(USER_ROLE_VALUES)
export type UserRole = z.infer<typeof UserRoleSchema>

/** Tri disponible sur la page « Explorer » (`<select id="sort">`). */
export const SORT_OPTION_VALUES = ['off', 'pa', 'pd', 'end'] as const
export const SortOptionSchema = z.enum(SORT_OPTION_VALUES)
export type SortOption = z.infer<typeof SortOptionSchema>
