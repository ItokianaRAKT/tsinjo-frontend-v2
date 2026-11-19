import { z } from 'zod'
import {
  CategorySchema,
  ImpactStatsSchema,
  MerchantSchema,
  OfferIdSchema,
  OfferSchema,
  ReservationSchema,
  UserProfileSchema,
  type Category,
  type CategoryInput,
  type ImpactStats,
  type ImpactStatsInput,
  type Merchant,
  type MerchantInput,
  type Offer,
  type OfferInput,
  type Reservation,
  type ReservationInput,
  type UserProfile,
  type UserProfileInput,
} from '../schemas'

/* ------------------------------------------------------------------ *
 * Données mockées : reprises de la maquette HTML/CSS/JS (prototype),
 * parsées par les schémas Zod à l’import pour garantir leur validité.
 * ------------------------------------------------------------------ */

const RAW_CATEGORIES: readonly CategoryInput[] = [
  { id: 'fruits', label: 'Fruits', icon: 'apple' },
  { id: 'legumes', label: 'Légumes', icon: 'carrot' },
  { id: 'boulangerie', label: 'Boulangerie', icon: 'bread' },
  { id: 'produits-laitiers', label: 'Produits laitiers', icon: 'milk' },
  { id: 'autres', label: 'Autres', icon: 'dots' },
]

const RAW_MERCHANTS: readonly MerchantInput[] = [
  { id: 'ferme-ambohimanarina', name: 'Ferme d’Ambohimanarina', place: 'Ambohimanarina' },
  { id: 'marche-anosibe', name: 'Marché d’Anosibe', place: 'Isotry' },
  { id: 'boulangerie-soarano', name: 'Boulangerie Soarano', place: 'Analakely' },
  { id: 'laiterie-ankorondrano', name: 'Laiterie Ankorondrano', place: 'Ankorondrano' },
  { id: 'etal-voahangy', name: 'Étal Mme Voahangy', place: 'Andravoahangy' },
  { id: 'marche-analakely', name: 'Marché d’Analakely', place: 'Analakely' },
  { id: 'patisserie-isoraka', name: 'Pâtisserie d’Isoraka', place: 'Isoraka' },
  { id: 'collectif-maraichers', name: 'Collectif des maraîchers', place: '67 Ha' },
  { id: 'etal-behoririka', name: 'Étal de Behoririka', place: 'Behoririka' },
  { id: 'epicerie-ambohijatovo', name: 'Épicerie d’Ambohijatovo', place: 'Ambohijatovo' },
]

const RAW_OFFERS: readonly OfferInput[] = [
  {
    id: 1,
    name: 'Mangues mûres',
    description:
      'Mangues très mûres, parfaites pour jus, confitures ou à croquer dans la journée. Quelques taches sur la peau, chair intacte.',
    categoryId: 'fruits',
    merchantId: 'ferme-ambohimanarina',
    place: 'Ambohimanarina',
    quantity: 14,
    unit: 'kg',
    originalPrice: 5000,
    price: 2500,
    pickupUntil: 'Aujourd’hui, 18 h',
    tone: '#d9a441',
    imageSlug: 'mangues',
  },
  {
    id: 2,
    name: 'Brèdes mafana',
    description:
      'Bottes de brèdes fraîches cueillies ce matin. À cuisiner le jour même pour le romazava.',
    categoryId: 'legumes',
    merchantId: 'marche-anosibe',
    place: 'Isotry',
    quantity: 30,
    unit: 'bottes',
    price: 400,
    pickupUntil: 'Aujourd’hui, 17 h',
    tone: '#4f8a3c',
    imageSlug: 'bredes',
  },
  {
    id: 3,
    name: 'Pain du matin',
    description:
      'Baguettes cuites ce matin et restées en rayon. Encore croustillantes, excellentes grillées.',
    categoryId: 'boulangerie',
    merchantId: 'boulangerie-soarano',
    place: 'Analakely',
    quantity: 40,
    unit: 'pièces',
    originalPrice: 500,
    price: 250,
    pickupUntil: 'Aujourd’hui, 19 h',
    tone: '#c98a4b',
    imageSlug: 'pain',
  },
  {
    id: 4,
    name: 'Yaourts nature',
    description:
      'Pots de 125 g dont la date limite approche dans quatre jours. Conservés au froid.',
    categoryId: 'produits-laitiers',
    merchantId: 'laiterie-ankorondrano',
    place: 'Ankorondrano',
    quantity: 24,
    unit: 'pots',
    originalPrice: 1500,
    price: 800,
    pickupUntil: 'Demain, 12 h',
    tone: '#e9e1c8',
    imageSlug: 'yaourts',
  },
  {
    id: 5,
    name: 'Litchis de Tamatave',
    description:
      'Arrivage de la côte est, calibre irrégulier. Très sucrés, à manger vite.',
    categoryId: 'fruits',
    merchantId: 'etal-voahangy',
    place: 'Andravoahangy',
    quantity: 10,
    unit: 'kg',
    price: 4500,
    pickupUntil: 'Aujourd’hui, 18 h',
    tone: '#b8503f',
    imageSlug: 'litchis',
  },
  {
    id: 6,
    name: 'Tomates',
    description:
      'Tomates bien mûres, idéales en sauce ou en salade. Certaines légèrement abîmées.',
    categoryId: 'legumes',
    merchantId: 'marche-analakely',
    place: 'Analakely',
    quantity: 20,
    unit: 'kg',
    originalPrice: 4000,
    price: 2000,
    pickupUntil: 'Aujourd’hui, 16 h',
    tone: '#c2452d',
    imageSlug: 'tomates',
  },
  {
    id: 7,
    name: 'Croissants',
    description:
      'Viennoiseries de la matinée, passées quelques secondes au four elles retrouvent tout leur feuilleté.',
    categoryId: 'boulangerie',
    merchantId: 'patisserie-isoraka',
    place: 'Isoraka',
    quantity: 18,
    unit: 'pièces',
    originalPrice: 1800,
    price: 900,
    pickupUntil: 'Aujourd’hui, 20 h',
    tone: '#d6a45c',
    imageSlug: 'croissants',
  },
  {
    id: 8,
    name: 'Carottes d’Antsirabe',
    description:
      'Carottes de calibre hors norme, tordues mais croquantes et sucrées.',
    categoryId: 'legumes',
    merchantId: 'collectif-maraichers',
    place: '67 Ha',
    quantity: 25,
    unit: 'kg',
    originalPrice: 3000,
    price: 1500,
    pickupUntil: 'Demain, 10 h',
    tone: '#d8782a',
    imageSlug: 'carottes',
  },
  {
    id: 9,
    name: 'Fromage frais',
    description:
      'Fromage frais de vache, pots de 250 g, date limite dans trois jours.',
    categoryId: 'produits-laitiers',
    merchantId: 'laiterie-ankorondrano',
    place: 'Ankorondrano',
    quantity: 12,
    unit: 'pots',
    originalPrice: 6000,
    price: 3500,
    pickupUntil: 'Demain, 12 h',
    tone: '#efe8d2',
    imageSlug: 'fromage',
  },
  {
    id: 10,
    name: 'Ananas Victoria',
    description:
      'Petits ananas très parfumés, à consommer dans les deux jours.',
    categoryId: 'fruits',
    merchantId: 'etal-behoririka',
    place: 'Behoririka',
    quantity: 15,
    unit: 'pièces',
    originalPrice: 3000,
    price: 1800,
    pickupUntil: 'Aujourd’hui, 18 h',
    tone: '#e0b83a',
    imageSlug: 'ananas',
  },
  {
    id: 11,
    name: 'Riz rouge, sacs abîmés',
    description:
      'Emballages déchirés, riz resacqué et parfaitement sain. Idéal pour les familles.',
    categoryId: 'autres',
    merchantId: 'epicerie-ambohijatovo',
    place: 'Ambohijatovo',
    quantity: 20,
    unit: 'kg',
    originalPrice: 4200,
    price: 3000,
    pickupUntil: 'Cette semaine',
    tone: '#9a5b3a',
    imageSlug: 'riz',
  },
  {
    id: 12,
    name: 'Brioches',
    description:
      'Brioches moelleuses de la veille, à réchauffer deux minutes.',
    categoryId: 'boulangerie',
    merchantId: 'boulangerie-soarano',
    place: 'Analakely',
    quantity: 16,
    unit: 'pièces',
    price: 600,
    pickupUntil: 'Aujourd’hui, 19 h',
    tone: '#cf9a52',
    imageSlug: 'brioches',
  },
]

const RAW_USERS: readonly UserProfileInput[] = [
  {
    id: 'hanta-rakoto',
    name: 'Hanta Rakoto',
    role: 'Particulier',
    zone: 'Isoraka',
    bio: 'J’aime cuisiner de saison et ne rien jeter.',
  },
  {
    id: 'voahangy-rakotomalala',
    name: 'Mme Voahangy Rakotomalala',
    role: 'Commerçant',
    zone: 'Andravoahangy',
    bio: 'Étal au marché d’Andravoahangy depuis quinze ans : je vends ce qui reste à la fin de la journée.',
  },
  {
    id: 'tojo-andrianina',
    name: 'Tojo Andrianina',
    role: 'Producteur',
    zone: '67 Ha',
    bio: 'Maraîcher à 67 Ha. Mes légumes au calibre imparfait trouvent preneur ici.',
  },
]

const RAW_RESERVATIONS: readonly ReservationInput[] = [
  {
    id: 1,
    offerId: 3,
    userId: 'hanta-rakoto',
    quantity: 6,
    status: 'Récupérée',
    code: 'TSJ-4821',
  },
  {
    id: 2,
    offerId: 1,
    userId: 'hanta-rakoto',
    quantity: 3,
    status: 'Confirmée',
    code: 'TSJ-7305',
  },
  {
    id: 3,
    offerId: 7,
    userId: 'hanta-rakoto',
    quantity: 2,
    status: 'En attente',
    code: 'TSJ-1964',
  },
]

const RAW_FAVORITES = [2, 6]
const RAW_STATS: ImpactStatsInput = {
  kgSaved: 4280,
  partnerMerchants: 312,
  mealsShared: 9640,
}

/** Catégories affichées dans la barre de filtres et le hero. */
export const categories: readonly Category[] = z
  .array(CategorySchema)
  .parse(RAW_CATEGORIES)

/** Commerces (« vendeurs ») publiant des offres. */
export const merchants: readonly Merchant[] = z
  .array(MerchantSchema)
  .parse(RAW_MERCHANTS)

/** Offres anti-gaspi disponibles. */
export const offers: readonly Offer[] = z.array(OfferSchema).parse(RAW_OFFERS)

/** Comptes utilisateurs (profil, rôles, quartiers). */
export const users: readonly UserProfile[] = z
  .array(UserProfileSchema)
  .parse(RAW_USERS)

/** Réservations enregistrées, avec codes de retrait. */
export const reservations: readonly Reservation[] = z
  .array(ReservationSchema)
  .parse(RAW_RESERVATIONS)

/** Ids d’offres mises en favoris par l’utilisateur courant. */
export const favoriteOfferIds: readonly number[] = z
  .array(OfferIdSchema)
  .parse(RAW_FAVORITES)

/** Chiffres d’impact de la page d’accueil. */
export const impactStats: ImpactStats = ImpactStatsSchema.parse(RAW_STATS)

/** Profil connecté pour la démo. */
export const currentUser: UserProfile = users[0]
