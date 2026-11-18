import type { ReservationStatus } from '../../schemas'

/**
 * Badge de statut du cycle de récupération : trait encré pour « En attente »,
 * pastille lime pour « Confirmée » / « Récupérée », trait warn pour « Annulée »
 * (reprises des classes `.st`, `.st.ok` et `.st.no` de la maquette).
 */
const STATUS_CLASS: Record<ReservationStatus, string> = {
  'En attente': 'border-[1.5px] border-ink bg-transparent text-ink',
  'Confirmée': 'border-[1.5px] border-lime bg-lime text-ink',
  'Récupérée': 'border-[1.5px] border-lime bg-lime text-ink',
  'Annulée': 'border-[1.5px] border-warn bg-transparent text-warn',
}

interface ReservationStatusBadgeProps {
  status: ReservationStatus
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-[0.8rem] font-semibold ${STATUS_CLASS[status]}`}
    >
      {status}
    </span>
  )
}
