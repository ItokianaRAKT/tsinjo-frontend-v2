import { useMemo } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { z } from 'zod'
import { offers as seedOffers } from '../data/mockData'
import {
  OfferSchema,
  type CategoryId,
  type Offer,
  type OfferId,
  type OfferInput,
  type PickupWindow,
  type Place,
  type PublicationStatus,
  type Unit,
} from '../schemas'

/** Données du formulaire « Publier », avant complétion des champs calculés. */
export interface OfferDraft {
  /** Auteur de la publication (nom du profil connecté dans la maquette). */
  merchantId: string
  name: string
  description: string
  categoryId: CategoryId
  place: Place
  quantity: number
  unit: Unit
  /** Prix d’origine facultatif (sans lui, pas de réduction affichée). */
  originalPrice?: number
  price: number
  pickupUntil: PickupWindow
  /** Teinte de repli ; déduite de la catégorie si absente. */
  tone?: string
  /** Slug de la photo ; déduit du nom du produit si absent. */
  imageSlug?: string
}

export type PublishOfferResult =
  | { ok: true; offer: Offer }
  | { ok: false; error: z.ZodError }

/** Teintes de repli par catégorie (reprises de la maquette). */
const TONE_BY_CATEGORY: Record<CategoryId, string> = {
  fruits: '#d9a441',
  legumes: '#4f8a3c',
  boulangerie: '#c98a4b',
  'produits-laitiers': '#e9e1c8',
  autres: '#9a5b3a',
}

/** Transitions autorisées du cycle de publication (onglet « Publications »). */
const PUBLICATION_TRANSITIONS: Record<
  PublicationStatus,
  readonly PublicationStatus[]
> = {
  Active: ['Réservée', 'Retirée'],
  'Réservée': ['Terminée', 'Retirée'],
  Terminée: [],
  Retirée: [],
}

/** Slug de photo déduit du nom du produit (« Mangues mûres » → `mangues-mures`). */
const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'photo'

interface OfferStoreState {
  /** Offres publiées par l’utilisateur (les offres mockées restent statiques). */
  publishedOffers: Offer[]
  /** Prochain identifiant attribué (commence à 100, comme la maquette). */
  nextOfferId: number
  /** Publie une offre ; échoue si elle ne respecte pas le schéma Zod. */
  publishOffer: (draft: OfferDraft) => PublishOfferResult
  /** Applique une transition de statut autorisée, sinon ne fait rien. */
  setPublicationStatus: (offerId: OfferId, status: PublicationStatus) => void
  reset: () => void
}

const createSeedState = (): Pick<OfferStoreState, 'publishedOffers' | 'nextOfferId'> => ({
  publishedOffers: [],
  nextOfferId: 100,
})

export const useOfferStore = create<OfferStoreState>()(
  persist(
    (set, get) => ({
      ...createSeedState(),
      publishOffer: (draft) => {
        const candidate: OfferInput = {
          id: get().nextOfferId,
          merchantId: draft.merchantId.trim(),
          name: draft.name.trim(),
          description: draft.description.trim(),
          categoryId: draft.categoryId,
          place: draft.place,
          quantity: draft.quantity,
          unit: draft.unit,
          originalPrice: draft.originalPrice,
          price: draft.price,
          pickupUntil: draft.pickupUntil,
          tone: draft.tone ?? TONE_BY_CATEGORY[draft.categoryId],
          imageSlug: draft.imageSlug ?? slugify(draft.name),
        }

        const parsed = OfferSchema.safeParse(candidate)
        if (!parsed.success) {
          return { ok: false, error: parsed.error }
        }

        set((state) => ({
          publishedOffers: [parsed.data, ...state.publishedOffers],
          nextOfferId: state.nextOfferId + 1,
        }))
        return { ok: true, offer: parsed.data }
      },
      setPublicationStatus: (offerId, status) =>
        set((state) => {
          const target = state.publishedOffers.find((offer) => offer.id === offerId)
          if (!target || !PUBLICATION_TRANSITIONS[target.status].includes(status)) {
            return state
          }
          return {
            publishedOffers: state.publishedOffers.map((offer): Offer =>
              offer.id === offerId ? { ...offer, status } : offer,
            ),
          }
        }),
      reset: () => set(createSeedState()),
    }),
    {
      name: 'tsinjo.offers.v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        publishedOffers: state.publishedOffers,
        nextOfferId: state.nextOfferId,
      }),
    },
  ),
)

/**
 * Liste complète des offres (mockées + publications), mémoïsée pour ne pas
 * créer une nouvelle référence à chaque rendu.
 */
export function useAllOffers(): Offer[] {
  const publishedOffers = useOfferStore((state) => state.publishedOffers)
  return useMemo(() => [...seedOffers, ...publishedOffers], [publishedOffers])
}
