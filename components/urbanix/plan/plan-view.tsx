'use client'

import { Reorder, useDragControls } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  CloudRain,
  Clock,
  Compass,
  DoorClosed,
  DoorOpen,
  GripVertical,
  RefreshCw,
  Share2,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'
import {
  autoPlan,
  buildTimeline,
  costLabel,
  formatDuration,
  formatTime,
  TRANSPORT_LABEL,
} from '@/lib/urbanix/scoring'
import type { TimelineStop } from '@/lib/urbanix/types'
import { cn } from '@/lib/utils'
import { useUrbanix } from '../app-providers'
import { btn } from '../btn'
import { PulseLoader } from '../pulse-line'
import { ScoreRing } from '../score-ring'

const ALERT_ICON = { weather: CloudRain, closing: DoorClosed, crowd: Users, opening: DoorOpen } as const

export function PlanView() {
  const { profile, planIds, setPlanIds, hydrated, toast, markSaved, savedAt } = useUrbanix()
  const timeline = useMemo(() => buildTimeline(planIds, profile), [planIds, profile])

  if (!hydrated) return <PulseLoader label="Building your day…" />

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed px-6 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-pulse">
          <Compass className="size-7" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold">Your plan is empty</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Add places from Explore, or let Urbanix build a full day around your answers.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => setPlanIds(autoPlan(profile))} className={btn('primary', 'lg')}>
            <RefreshCw aria-hidden />
            Plan my day for me
          </button>
          <Link href="/explore" className={btn('secondary', 'lg')}>
            Browse places
          </Link>
        </div>
      </div>
    )
  }

  const first = timeline[0]
  const last = timeline[timeline.length - 1]
  const totalMin = last.leave - (first.arrival - first.travelMin)
  const totalCost = timeline.reduce((sum, s) => sum + s.place.cost, 0)
  const totalKm = Math.round(timeline.reduce((sum, s) => sum + s.travelKm, 0) * 10) / 10
  const alertCount = timeline.reduce((n, s) => n + s.alerts.length, 0)

  const move = (index: number, dir: -1 | 1) => {
    const next = [...planIds]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setPlanIds(next)
  }

  const remove = (id: string, name: string) => {
    setPlanIds(planIds.filter((x) => x !== id))
    toast(`${name} removed`)
  }

  const share = async () => {
    const text = [
      `My Urbanix day in ${profile.city || 'the city'}:`,
      ...timeline.map((s) => `${formatTime(s.arrival)}  ${s.place.name} (${s.place.area})`),
      `Total ${formatDuration(totalMin)}, about ${costLabel(totalCost)}`,
    ].join('\n')
    try {
      if (navigator.share) await navigator.share({ title: 'My Urbanix plan', text })
      else {
        await navigator.clipboard.writeText(text)
        toast('Plan copied to clipboard')
      }
    } catch {
      /* share sheet dismissed */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="timeline-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="timeline-heading" className="text-2xl font-bold">
            Your timeline
          </h2>
          <p className="hidden text-sm text-muted-foreground sm:block">Drag the handle to reorder</p>
        </div>

        <Reorder.Group axis="y" values={planIds} onReorder={setPlanIds} className="mt-5 flex flex-col">
          {timeline.map((stop, i) => (
            <StopItem
              key={stop.place.id}
              stop={stop}
              index={i}
              isLast={i === timeline.length - 1}
              transportLabel={TRANSPORT_LABEL[profile.transport ?? 'metro']}
              onMove={(dir) => move(i, dir)}
              onRemove={() => remove(stop.place.id, stop.place.name)}
              canUp={i > 0}
              canDown={i < timeline.length - 1}
            />
          ))}
        </Reorder.Group>
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Plan summary">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Day at a glance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatTime(first.arrival - first.travelMin)} to {formatTime(last.leave)}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Summary icon={Clock} label="Total time" value={formatDuration(totalMin)} />
            <Summary icon={Wallet} label="Est. cost" value={costLabel(totalCost)} />
            <Summary icon={Compass} label="Stops" value={String(timeline.length)} />
            <Summary icon={DoorClosed} label="Travel" value={`${totalKm} km`} />
          </dl>
          {alertCount > 0 && (
            <p className="mt-4 rounded-xl bg-amber/10 px-3 py-2.5 text-sm text-foreground">
              {alertCount} {alertCount === 1 ? 'heads-up' : 'heads-ups'} on your route, see the timeline.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                markSaved()
                toast('Plan saved on this device')
              }}
              className={btn('primary', 'md', 'w-full')}
            >
              <Bookmark aria-hidden />
              {savedAt ? 'Saved, save again' : 'Save my plan'}
            </button>
            <button type="button" onClick={share} className={btn('secondary', 'md', 'w-full')}>
              <Share2 aria-hidden />
              Share plan
            </button>
            <button
              type="button"
              onClick={() => {
                setPlanIds(autoPlan(profile))
                toast('Fresh plan built for you')
              }}
              className={btn('ghost', 'md', 'w-full')}
            >
              <RefreshCw aria-hidden />
              Re-plan for me
            </button>
          </div>
        </div>
        <Link href="/explore" className="mt-4 block text-center text-sm font-medium text-pulse hover:underline">
          Add more places
        </Link>
      </aside>
    </div>
  )
}

function Summary({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/70 p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 font-display text-lg font-bold">{value}</dd>
    </div>
  )
}

function StopItem({
  stop,
  index,
  isLast,
  transportLabel,
  onMove,
  onRemove,
  canUp,
  canDown,
}: {
  stop: TimelineStop
  index: number
  isLast: boolean
  transportLabel: string
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  canUp: boolean
  canDown: boolean
}) {
  const controls = useDragControls()
  const { place } = stop

  return (
    <Reorder.Item
      value={place.id}
      dragListener={false}
      dragControls={controls}
      className="relative flex gap-4 pb-4"
      whileDrag={{ scale: 1.02, zIndex: 10 }}
    >
      <div className="flex w-16 shrink-0 flex-col items-center">
        <span className="font-display text-sm font-bold">{formatTime(stop.arrival)}</span>
        <span className="mt-2 grid size-8 place-items-center rounded-full bg-pulse font-display text-sm font-bold text-pulse-foreground">
          {index + 1}
        </span>
        {!isLast && <span className="mt-2 w-0.5 flex-1 rounded-full bg-border" aria-hidden />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs text-muted-foreground">
          {stop.travelMin} min {transportLabel}
          {stop.travelKm > 0 && ` · ${stop.travelKm} km`}
        </p>
        <article className="rounded-2xl border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onPointerDown={(e) => controls.start(e)}
              className="hidden cursor-grab touch-none rounded-lg p-1 text-muted-foreground hover:bg-secondary active:cursor-grabbing sm:block"
              aria-label={`Drag to reorder ${place.name}`}
            >
              <GripVertical className="size-5" aria-hidden />
            </button>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold leading-snug">{place.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {place.area} · {formatDuration(place.durationMin)} · {costLabel(place.cost)}
              </p>
            </div>
            <ScoreRing score={place.score} size={44} />
          </div>

          {stop.alerts.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {stop.alerts.map((a) => {
                const Icon = ALERT_ICON[a.type]
                return (
                  <li
                    key={a.text}
                    className={cn(
                      'flex items-start gap-2 rounded-lg px-3 py-2 text-sm',
                      a.type === 'closing' ? 'bg-sos/10' : 'bg-amber/10',
                    )}
                  >
                    <Icon
                      className={cn('mt-0.5 size-4 shrink-0', a.type === 'closing' ? 'text-sos' : 'text-amber')}
                      aria-hidden
                    />
                    {a.text}
                  </li>
                )
              })}
            </ul>
          )}

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onMove(-1)}
                disabled={!canUp}
                className={btn('ghost', 'sm', 'size-9 px-0')}
                aria-label={`Move ${place.name} earlier`}
              >
                <ArrowUp aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                disabled={!canDown}
                className={btn('ghost', 'sm', 'size-9 px-0')}
                aria-label={`Move ${place.name} later`}
              >
                <ArrowDown aria-hidden />
              </button>
            </div>
            <button type="button" onClick={onRemove} className={btn('ghost', 'sm', 'text-muted-foreground hover:text-sos')}>
              <Trash2 aria-hidden />
              Remove
            </button>
          </div>
        </article>
      </div>
    </Reorder.Item>
  )
}
