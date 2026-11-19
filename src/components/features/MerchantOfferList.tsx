import { useOfferStore } from '../../store'
import { MerchantOfferCard } from './MerchantOfferCard'

/**
 * Section « Mes publications » (maquette : onglet « Publications » de
 * « Mon espace ») : cartes des offres publiées ou état vide renvoyant
 * au formulaire du haut de page.
 */
export function MerchantOfferList() {
  const offers = useOfferStore((state) => state.publishedOffers)

  return (
    <section aria-labelledby="publications-title">
      <h2 id="publications-title" className="text-h2">
        Mes publications
      </h2>
      <span aria-hidden="true" className="mt-3 mb-6 block h-[3px] w-10 bg-lime" />

      {offers.length === 0 ? (
        <div className="grid justify-items-start gap-4">
          <div
            aria-hidden="true"
            className="h-36 w-36 bg-lime"
            style={{ borderRadius: '70% 30% 58% 42% / 40% 60% 40% 60%' }}
          />
          <h3>Aucune publication</h3>
          <p className="max-w-[46ch] text-ink-2">
            Vous n’avez rien publié pour l’instant. Votre offre apparaîtra ici avec son stock
            restant et ses boutons de statut.
          </p>
          <a
            href="#publish-form"
            className="rounded-full bg-ink px-6 py-3.5 font-semibold text-paper no-underline transition-colors hover:bg-leaf"
          >
            Publier une offre
          </a>
        </div>
      ) : (
        <div>
          {offers.map((offer) => (
            <MerchantOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </section>
  )
}
