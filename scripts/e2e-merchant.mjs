/**
 * E2E « Espace commerçant » dans Chrome headless :
 *  1. soumission vide -> erreurs Zod affichées champ par champ ;
 *  2. soumission valide -> confirmation, offre ajoutée à « Mes publications »
 *     avec son stock restant ;
 *  3. bouton de statut -> Active puis Réservée via setPublicationStatus().
 *
 * Usage : npm run build && npm run preview, puis `node scripts/e2e-merchant.mjs`.
 */
import { chromium } from 'playwright-core'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'
const BUTTON_NAME = /Publier l.offre/

/** Erreurs attendues après une soumission sur formulaire vide. */
const EXPECTED_ERRORS = {
  '#name-error': '3 caractères minimum.',
  '#description-error': '20 caractères minimum.',
  '#categoryId-error': 'Choisissez une option dans la liste.',
  '#quantity-error': 'Saisissez un nombre valide.',
  '#unit-error': 'Choisissez une option dans la liste.',
  '#originalPrice-error': 'Saisissez un nombre valide.',
  '#price-error': 'Saisissez un nombre valide.',
  '#pickupUntil-error': 'Choisissez une option dans la liste.',
  '#place-error': 'Choisissez une option dans la liste.',
}

function expect(condition, message) {
  if (!condition) throw new Error(`Échec : ${message}`)
}

async function readText(locator) {
  return (await locator.textContent()) ?? ''
}

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

try {
  await page.goto(`${BASE_URL}/`)
  await page.getByRole('link', { name: 'Espace commerçant' }).click()
  await page.getByRole('heading', { name: 'Un surplus ? Offrez-lui une seconde chance.' }).waitFor()
  await page.getByRole('heading', { name: 'Aucune publication' }).waitFor()

  // 1. Formulaire vide -> erreurs Zod par champ.
  await page.getByRole('button', { name: BUTTON_NAME }).click()
  for (const [selector, expected] of Object.entries(EXPECTED_ERRORS)) {
    const error = page.locator(selector)
    await error.waitFor({ state: 'visible' })
    const actual = await readText(error)
    expect(actual.includes(expected), `${selector} contient « ${expected} » (obtenu « ${actual} »)`)
  }
  expect(
    (await page.locator('form p[role="alert"]:not([id])').count()) === 0,
    'aucune erreur générique hors champ (chaque issue pointe un champ)',
  )

  // 2. Soumission valide -> offre publiée et confirmée.
  await page.fill('#name', 'Pain du soir')
  await page.selectOption('#categoryId', 'boulangerie')
  await page.fill('#description', 'Pain de la journée, encore bon pour demain matin.')
  await page.fill('#quantity', '4')
  await page.selectOption('#unit', 'pièces')
  await page.fill('#originalPrice', '5000')
  await page.fill('#price', '2500')
  await page.selectOption('#pickupUntil', 'Demain, 12 h')
  await page.selectOption('#place', 'Analakely')
  await page.getByRole('button', { name: BUTTON_NAME }).click()

  const confirmation = page.getByRole('status')
  await confirmation.waitFor()
  expect(
    (await readText(confirmation)).includes('Pain du soir'),
    'le message de confirmation nomme l’offre publiée',
  )
  expect((await page.locator('#name-error').count()) === 0, 'les erreurs Zod sont purgées')

  const card = page.locator('article').filter({ hasText: 'Pain du soir' })
  await card.waitFor()
  expect(
    (await readText(card)).includes('4/4 pièces restants'),
    'la carte affiche le stock restant 4/4',
  )

  // 3. Changement de statut : Active -> Réservée -> Terminée (cycle du store).
  await page.getByRole('button', { name: 'Marquer réservée' }).click()
  await card.getByText('Réservée', { exact: true }).waitFor()
  await page.getByRole('button', { name: 'Marquer terminée' }).waitFor()
  await page.getByRole('button', { name: 'Marquer réservée' }).waitFor({ state: 'hidden' })

  await page.getByRole('button', { name: 'Marquer terminée' }).click()
  await card.getByText('Terminée', { exact: true }).waitFor()
  expect((await card.getByRole('button').count()) === 0, 'une offre terminée n’a plus d’actions')

  console.log('✅ Espace commerçant : erreurs Zod, publication et cycle de statuts OK')
} finally {
  await browser.close()
}
