'use client'

import { m } from 'framer-motion'
import { Accessibility, Check, Clock, MapPin, Plus, Sparkles, Star, Users } from 'lucide-react'
import { costLabel, formatTime, toMinutes } from '@/lib/urbanix/scoring'
import type { ScoredPlace } from '@/lib/urbanix/types'
import { cn } from '@/lib/utils'
import { ScoreRing } from '../score-ring'

const CATEGORY_LABEL = { attraction: 'Attraction', food: 'Food', place: 'Place', service: 'Service' } as const
const CROWD_LABEL = { low: 'Quiet', medium: 'Moderate crowd', high: 'Busy' } as const

export function PlaceCard({
  place,
  inPlan,
  onToggle,
  featured = false,
}: {
  place: ScoredPlace
  inPlan: boolean
  onToggle: () => void
  featured?: boolean
}) {
  return (
    <m.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={cn(
        'group flex h-full flex-col rounded-2xl border bg-card p-5 transition-colors duration-300',
        inPlan ? 'border-pulse/60' : 'hover:border-pulse/40',
        featured && 'bg-gradient-to-b from-accent/70 to-card',
      )}
    >
      <div className="flex items-start gap-4">
        <ScoreRing score={place.score} size={featured ? 60 : 52} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABEL[place.category]}
          </p>
          <h3 className="mt-0.5 text-pretty font-display text-lg font-semibold leading-snug">{place.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {place.area} · {place.distanceKm} km from centre
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{place.description}</p>

      <div className="mt-4 rounded-xl bg-secondary/70 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-pulse">
          <Sparkles className="size-3.5" aria-hidden />
          Why this matches you
        </p>
        <p className="mt-1 text-sm">{place.why}</p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-1">
          <Star className="size-3.5 fill-amber text-amber" aria-hidden />
          <span className="font-medium text-foreground">{place.rating}</span>
        </li>
        <li className="font-medium text-foreground">{costLabel(place.cost)}</li>
        <li className="flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden />
          {formatTime(toMinutes(place.opens))} to {formatTime(toMinutes(place.closes))}
        </li>
        <li className="flex items-center gap-1">
          <Users className="size-3.5" aria-hidden />
          {CROWD_LABEL[place.crowd]}
        </li>
        {place.accessible && (
          <li className="flex items-center gap-1">
            <Accessibility className="size-3.5" aria-hidden />
            Step-free
          </li>
        )}
      </ul>

      <div className="mt-auto pt-5">
        {place.plannable ? (
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={inPlan}
            className={cn(
              'flex h-11 w-full items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-colors duration-200 active:scale-[0.98]',
              inPlan
                ? 'border-pulse bg-pulse text-pulse-foreground'
                : 'hover:border-pulse/60 hover:bg-accent',
            )}
          >
            {inPlan ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
            {inPlan ? 'In your plan' : 'Add to my plan'}
          </button>
        ) : (
          <p className="text-center text-sm text-muted-foreground">Good to know, open when you need it</p>
        )}
      </div>
    </m.article>
  )
}
