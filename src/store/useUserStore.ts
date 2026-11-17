import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { z } from 'zod'
import { currentUser, favoriteOfferIds } from '../data/mockData'
import { UserProfileSchema, type OfferId, type UserProfile } from '../schemas'

/** Champs éditables du formulaire « Mon profil ». */
export type ProfilePatch = Partial<Pick<UserProfile, 'name' | 'role' | 'zone' | 'bio'>>

export type UpdateProfileResult =
  | { ok: true; profile: UserProfile }
  | { ok: false; error: z.ZodError }

interface UserState {
  /** Profil connecté pour la démo. */
  profile: UserProfile
  /** Ids d’offres mises en favoris (cœur des cartes). */
  favorites: OfferId[]
  /** Met à jour le profil ; échoue s’il ne respecte pas le schéma Zod. */
  updateProfile: (patch: ProfilePatch) => UpdateProfileResult
  /** Ajoute ou retire une offre des favoris. */
  toggleFavorite: (offerId: OfferId) => void
  reset: () => void
}

const createSeedState = (): Pick<UserState, 'profile' | 'favorites'> => ({
  profile: currentUser,
  favorites: [...favoriteOfferIds],
})

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...createSeedState(),
      updateProfile: (patch) => {
        const parsed = UserProfileSchema.safeParse({ ...get().profile, ...patch })
        if (!parsed.success) {
          return { ok: false, error: parsed.error }
        }
        set({ profile: parsed.data })
        return { ok: true, profile: parsed.data }
      },
      toggleFavorite: (offerId) =>
        set((state) => ({
          favorites: state.favorites.includes(offerId)
            ? state.favorites.filter((id) => id !== offerId)
            : [...state.favorites, offerId],
        })),
      reset: () => set(createSeedState()),
    }),
    {
      name: 'tsinjo.user.v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        favorites: state.favorites,
      }),
    },
  ),
)

/** Sélecteur : l’offre est-elle en favoris (`useUserStore(isFavoriteSelector(id))`). */
export const isFavoriteSelector =
  (offerId: OfferId) =>
  (state: UserState): boolean =>
    state.favorites.includes(offerId)
