import { DemoResetPanel } from '../components/features/DemoResetPanel'
import { FavoriteOffersList } from '../components/features/FavoriteOffersList'
import { ProfileForm } from '../components/features/ProfileForm'
import { ProfileIdentity } from '../components/features/ProfileIdentity'
import { ProfileStats } from '../components/features/ProfileStats'

/**
 * Route `/profile` : identité et édition du profil, statistiques d’impact,
 * favoris et remise à zéro de la démo (maquette : `pageProfile`).
 */
export function ProfilePage() {
  return (
    <section className="px-pad py-14">
      <header>
        <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
          Mon profil
        </p>
        <h1 className="mt-3 max-w-[16ch] text-[clamp(2.4rem,6vw,4.2rem)]">
          Votre identité Tsinjo
        </h1>
        <p className="mt-4 max-w-[46ch] text-ink-2">
          Vos informations, votre impact et vos paniers favoris — avec un bouton pour repartir
          d’une démo vierge.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="grid content-start gap-10">
          <ProfileIdentity />
          <ProfileForm />
        </div>
        <div className="grid content-start gap-10">
          <ProfileStats />
          <DemoResetPanel />
        </div>
      </div>

      <div className="mt-14">
        <FavoriteOffersList />
      </div>
    </section>
  )
}
