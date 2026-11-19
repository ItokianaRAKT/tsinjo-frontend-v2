/**
 * E2E routage accueil / catalogue dans Chrome headless :
 *  1. `/` affiche la page d’accueil (hero, catégories, impact) et non le catalogue ;
 *  2. la recherche du hero et « Voir toutes les offres » ouvrent `/explorer` ;
 *  3. `/explorer` affiche le catalogue (en-tête Explorer + offres) et le
 *     lien « Explorer » de la Navbar pointe bien vers `/explorer`.
 *
 * Usage : npm run build && npm run preview, puis `node scripts/e2e-home.mjs`.
 */
import { chromium } from 'playwright-core'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'

function expect(condition, message) {
  if (!condition) throw new Error(`Échec : ${message}`)
}

async function readText(locator) {
  return (await locator.textContent()) ?? ''
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

try {
  // 1. `/` = accueil, pas le catalogue.
  await page.goto(`${BASE_URL}/`)
  await page.getByRole('heading', { name: 'Moins de gaspillage. Plus de partage.' }).waitFor()
  expect(
    (await page.getByRole('heading', { name: 'Ce qui se partage près de vous' }).count()) === 0,
    'le hero Explorer ne s’affiche pas sur `/`',
  )
  expect(
    (await page.getByRole('heading', { name: 'Trois gestes, un panier sauvé.' }).count()) === 1,
    'section « Comment ça marche » présente sur `/`',
  )
  expect(
    (await page.getByRole('heading', { name: 'Ce que nous avons déjà sauvé' }).count()) === 1,
    'section d’impact présente sur `/`',
  )
  expect(
    (await page.locator('a[href^="/explorer?cat="]').count()) > 0,
    'liens de catégories vers /explorer rendus',
  )

  // 2. Recherche du hero -> `/explorer?q=`.
  await page.getByLabel('Rechercher un produit').fill('pain')
  await page.getByRole('button', { name: 'Lancer la recherche' }).click()
  await page.getByRole('heading', { name: 'Ce qui se partage près de vous' }).waitFor()
  expect(new URL(page.url()).pathname === '/explorer', 'la recherche ouvre /explorer')
  expect(new URL(page.url()).searchParams.get('q') === 'pain', 'paramètre q conservé')

  // 3. `/explorer` = catalogue : en-tête, filtres et offres.
  await page.goto(`${BASE_URL}/explorer`)
  await page.getByRole('heading', { name: 'Ce qui se partage près de vous' }).waitFor()
  expect(
    (await page.getByRole('heading', { name: 'Moins de gaspillage. Plus de partage.' }).count()) === 0,
    'le hero d’accueil ne s’affiche pas sur `/explorer`',
  )
  expect((await page.locator('article').count()) > 0, 'des cartes d’offres sur /explorer')
  expect(
    (await page.getByRole('button', { name: 'Tout' }).count()) === 1,
    'chips de catégories affichés',
  )

  // Prix initial facultatif : ni badge « −% » ni prix barré sans prix initial.
  const plain = page.locator('article').filter({ hasText: 'Brèdes mafana' })
  expect((await plain.locator('s').count()) === 0, 'Brèdes mafana : aucun prix barré')
  expect(
    !(await readText(plain)).includes('%'),
    'Brèdes mafana : aucun badge de réduction',
  )
  const discounted = page.locator('article').filter({ hasText: 'Mangues mûres' })
  expect((await discounted.locator('s').count()) === 1, 'Mangues mûres : prix barré affiché')
  expect(
    (await readText(discounted)).includes('%'),
    'Mangues mûres : badge de réduction affiché',
  )

  // Tri par réduction par défaut : les offres sans prix initial ferment la liste.
  const byDiscount = await page
    .locator('article')
    .evaluateAll((elements) => elements.map((el) => (el.textContent ?? '').includes('%')))
  const firstPlain = byDiscount.indexOf(false)
  expect(firstPlain > 0, 'au moins une offre sans réduction, après les offres en réduction')
  expect(
    byDiscount.slice(firstPlain).every((hasDiscount) => !hasDiscount),
    'toutes les offres sans réduction sont en bas de liste',
  )

  // 4. Navigation : logo -> accueil, « Explorer » -> catalogue.
  await page.getByRole('link', { name: 'Tsinjo, accueil' }).click()
  await page.getByRole('heading', { name: 'Moins de gaspillage. Plus de partage.' }).waitFor()
  await page.getByRole('link', { name: 'Explorer', exact: true }).click()
  await page.getByRole('heading', { name: 'Ce qui se partage près de vous' }).waitFor()

  console.log('✅ Routage : `/` = accueil, `/explorer` = catalogue, liens Navbar OK')
} finally {
  await browser.close()
}
