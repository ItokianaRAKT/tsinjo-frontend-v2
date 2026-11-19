import { z } from 'zod'
import { CategoryIdSchema } from './category'
import {
  PickupWindowSchema,
  PublicationStatusSchema,
  PlaceSchema,
  UnitSchema,
} from './enums'

/** Clé primaire d’une offre (anti-gaspi). */
export const OfferIdSchema = z.number().int().positive()
export type OfferId = z.infer<typeof OfferIdSchema>

/**
 * Une offre = un panier anti-gaspi publié par un commerce.
 * Les règles métier reprennent la validation du formulaire « Publier »
 * de la maquette (nom ≥ 3 car., description ≥ 20 car., prix réduit < prix
 * initial si celle-ci est renseignée…).
 */
export const OfferSchema = z
  .strictObject({
    id: OfferIdSchema,
    name: z.string().min(3).max(50),
    description: z.string().min(20).max(500),
    categoryId: CategoryIdSchema,
    merchantId: z.string().min(2).max(60),
    place: PlaceSchema,
    quantity: z.number().int().min(1),
    unit: UnitSchema,
    /** Prix d’origine facultatif : sans lui, l’offre n’affiche aucune réduction. */
    originalPrice: z.number().int().positive().optional(),
    price: z.number().int().positive(),
    pickupUntil: PickupWindowSchema,
    /** Teinte de repli affichée quand la photo est absente (`--t` de la maquette). */
    tone: z.string().regex(/^#[0-9a-f]{6}$/i, 'Couleur hexadécimale attendue (ex. #1d7a3a)'),
    /** Slug de la photo : `img/<imageSlug>.jpg` dans la maquette. */
    imageSlug: z.string().min(1).max(40),
    status: PublicationStatusSchema.default('Active'),
  })
  .refine(
    (offer) => offer.originalPrice === undefined || offer.price < offer.originalPrice,
    {
      message: 'Le prix réduit doit être inférieur au prix initial.',
      path: ['price'],
    },
  )

export type Offer = z.infer<typeof OfferSchema>
export type OfferInput = z.input<typeof OfferSchema>
