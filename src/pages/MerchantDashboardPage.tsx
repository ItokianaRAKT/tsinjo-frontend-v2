import { MerchantOfferList } from '../components/features/MerchantOfferList'
import { PublishOfferForm } from '../components/features/PublishOfferForm'

/**
 * Route `/merchant` : l’espace commerçant — publication d’une nouvelle offre
 * (maquette : `pagePublish`) à gauche, liste des publications avec gestion
 * du stock et des statuts à droite.
 */
export function MerchantDashboardPage() {
  return (
    <section className="px-pad py-14">
      <header>
        <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
          Espace commerçant
        </p>
        <h1 className="mt-3 max-w-[14ch] text-[clamp(2.4rem,6vw,4.2rem)]">
          Un surplus ? Offrez-lui une seconde chance.
        </h1>
        <p className="mt-4 max-w-[46ch] text-ink-2">
          Publiez vos invendus en quelques champs, suivez le stock restant de chaque annonce et
          faites avancer son statut jusqu’au retrait.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-16">
        <PublishOfferForm />
        <MerchantOfferList />
      </div>
    </section>
  )
}
