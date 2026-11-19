/**
 * E2E « Mon profil » dans Chrome headless :
 *  1. édition du profil -> erreur Zod, sauvegarde, initiale de la Navbar
 *     et affichage mis à jour ;
 *  2. favoris -> retrait d’un favori, puis accès à l’offre via `?offer=` ;
 *  3. bouton `data-resetdemo` -> retour à l’état initial (profil, favoris,
 *     formulaire resynchronisé).
 *
 * Usage : npm run build && npm run preview, puis `node scripts/e2e-profile.mjs`.
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
  await page.goto(`${BASE_URL}/profile`)
  await page.getByRole('heading', { name: 'Votre identité Tsinjo' }).waitFor()

  const avatar = page.locator('header a[aria-label="Mon profil"]')
  const formStatus = page.locator('#profile-form p[role="status"]')
  const nameField = page.locator('#profile-name')
  expect((await readText(avatar)) === 'H', 'initiale de la Navbar au chargement = H')

  // 1. Édition : refus Zod puis sauvegarde avec feedback et initiale mise à jour.
  await nameField.fill('A')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  const nameError = page.locator('#profile-name-error')
  await nameError.waitFor({ state: 'visible' })
  expect(
    (await readText(nameError)).includes('2 caractères minimum.'),
    'erreur Zod affichée sous le champ Nom',
  )

  await nameField.fill('Vola Andry')
  await page.selectOption('#profile-role', 'Commerçant')
  await page.getByRole('button', { name: 'Enregistrer' }).click()
  await formStatus.waitFor({ state: 'visible' })
  expect((await readText(formStatus)).includes('Profil enregistré.'), 'feedback de sauvegarde')
  await nameError.waitFor({ state: 'detached' })
  expect((await readText(avatar)) === 'V', 'initiale de la Navbar = V après sauvegarde')
  expect(
    (await page.getByText('Commerçant · Isoraka').count()) === 1,
    'rôle et quartier affichés dans l’identité',
  )
  expect((await nameField.inputValue()) === 'Vola Andry', 'valeur du champ Nom sauvegardée')

  // 2. Favoris : retrait d’un favori puis ouverture de l’offre.
  const items = page.getByRole('listitem')
  expect((await items.count()) === 2, 'deux favoris au départ')
  const tomates = items.filter({ hasText: 'Tomates' })
  await tomates.getByRole('button', { name: 'Retirer' }).click()
  await tomates.waitFor({ state: 'detached' })
  expect((await items.count()) === 1, 'un favori après retrait')

  // 3. Réinitialiser la démo : profil et favoris reviennent à l’état initial.
  await page.locator('[data-resetdemo]').click()
  const resetFeedback = page.getByRole('status').filter({ hasText: 'Démo réinitialisée.' })
  await resetFeedback.waitFor({ state: 'visible' })
  expect((await readText(resetFeedback)).includes('Démo réinitialisée.'), 'feedback de reset')
  await formStatus.waitFor({ state: 'detached' })
  expect((await readText(avatar)) === 'H', 'initiale restaurée après reset')
  expect((await items.count()) === 2, 'favoris restaurés après reset')
  await page.waitForFunction(
    () => document.querySelector('#profile-name')?.value === 'Hanta Rakoto',
    undefined,
    { timeout: 3000 },
  )

  // 4. Accès à l’offre depuis un favori (lien profond `?offer=`).
  const bredes = items.filter({ hasText: 'Brèdes mafana' })
  await bredes.getByRole('link', { name: 'Voir l’offre' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.waitFor({ state: 'visible' })
  expect(
    (await readText(dialog.getByRole('heading', { name: 'Brèdes mafana' }))) === 'Brèdes mafana',
    'détail de l’offre favorite ouvert',
  )
  expect(
    new URL(page.url()).searchParams.get('offer') === '2',
    'URL profonde ?offer=2 posée',
  )
  await dialog.getByRole('button', { name: 'Fermer le détail' }).click()
  await dialog.waitFor({ state: 'detached' })
  expect(new URL(page.url()).searchParams.get('offer') === null, 'paramètre offer retiré')

  console.log('✅ Mon profil : édition Zod, initiale Navbar, favoris et reset démo OK')
} finally {
  await browser.close()
}
