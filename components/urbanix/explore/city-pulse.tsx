import { CloudSun, ShieldCheck, TrafficCone } from 'lucide-react'
import { CITY_CONDITIONS } from '@/lib/urbanix/city-data'
import { formatTime } from '@/lib/urbanix/scoring'

export function CityPulse() {
  const { weather, traffic, safety } = CITY_CONDITIONS
  const items = [
    {
      icon: CloudSun,
      label: 'Weather',
      value: `${weather.tempC}°C, ${weather.label}`,
      note: `${weather.rainChance}% chance of rain after ${formatTime(weather.rainAfter * 60)}`,
    },
    { icon: TrafficCone, label: 'Traffic', value: traffic.level, note: traffic.note },
    { icon: ShieldCheck, label: 'Safety', value: safety.level, note: safety.note },
  ]
  return (
    <section aria-label="City Pulse: live conditions" className="grid gap-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value, note }) => (
        <div key={label} className="flex items-start gap-3 rounded-2xl border bg-card p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-pulse">
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
