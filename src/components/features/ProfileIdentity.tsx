import { useUserStore } from '../../store'

/**
 * Bloc identité de la maquette (`.prof-id`) : avatar à l’initiale, rôle,
 * quartier, nom et bio — repris à chaque changement du store.
 */
export function ProfileIdentity() {
  const profile = useUserStore((state) => state.profile)

  return (
    <div className="grid justify-items-start gap-4">
      <div
        aria-hidden="true"
        className="grid h-36 w-36 place-items-center rounded-[38%_62%_30%_70%_/_55%_40%_60%_45%] bg-leaf font-serif text-[3.5rem] font-bold text-paper"
      >
        {(profile.name.charAt(0) || 'T').toUpperCase()}
      </div>
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-leaf">
        {profile.role} · {profile.zone}
      </p>
      <h2 className="text-[clamp(2.4rem,6vw,4rem)]">{profile.name}</h2>
      <p className="max-w-[32ch] text-ink-2">{profile.bio}</p>
    </div>
  )
}
