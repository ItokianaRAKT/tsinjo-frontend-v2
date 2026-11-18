import type { Unit } from '../schemas'

/** Prix malgache formaté comme la maquette : « 2 500 Ar ». */
export function formatAr(amount: number): string {
  return `${amount.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} Ar`
}

/** Singulier de l’unité (« pièces » → « pièce ») pour les libellés courts. */
export function singularUnit(unit: Unit): string {
  return unit.endsWith('s') ? unit.slice(0, -1) : unit
}
