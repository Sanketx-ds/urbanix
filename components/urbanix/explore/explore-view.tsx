'use client'

import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Info, Route, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { autoPlan, PERSONA_COPY, scoreAll } from '@/lib/urbanix/scoring'
import type { Category } from '@/lib/urbanix/types'
import { cn } from '@/lib/utils'
import { useUrbanix } from '../app-providers'
import { btn } from '../btn'
import { PulseLoader } from '../pulse-line'
import { PlaceCard } from './place-card'

const FILTERS: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'attraction', label: 'Attractions' },
  { id: 'food', label: 'Food' },
  { id: 'place', label: 'Places' },
  { id: 'service', label: 'Services' },
]

const SORTS = [
  { id: 'match', label: 'Best match' },
  { id: 'near', label: 'Closest' },
  { id: 'cheap', label: 'Cheapest' },
] as const

export function ExploreView() {
  const { profile, planIds, togglePlace, setPlanIds, hydrated, toast } = useUrbanix()
  const router = useRouter()
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('match')
  const [query, setQuery] = useState('')
  const [planning, startPlanning] = useTransition()

  const ranked = useMemo(() => scoreAll(profile), [profile])
  const top = ranked.filter((p) => p.plannable).slice(0, 3)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = ranked.filter(
      (p) =>
        (filter === 'all' || p.category === filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q)),
    )
    if (sort === 'near') return [...filtered].sort((a, b) => a.distanceKm - b.distanceKm)
    if (sort === 'cheap') return [...filtered].sort((a, b) => a.cost - b.cost)
    return filtered
  }, [ranked, filter, sort, query])

  const toggle = (id: string, name: string) => {
    const adding = !planIds.includes(id)
    togglePlace(id)
    toast(adding ? `${name} added to your plan` : `${name} removed`)
  }

  const planMyDay = () => {
    startPlanning(() => {
      if (planIds.length === 0) setPlanIds(autoPlan(profile))
      router.push('/plan')
    })
  }

  if (!hydrated) return <PulseLoader />

  return (
    <div className="flex flex-col gap-12">
      {!profile.persona && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber/40 bg-amber/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden />
            {"You're seeing general picks. Answer a few quick questions for results made for you."}
          </p>
          <Link href="/personalise" className={btn('secondary', 'sm', 'shrink-0')}>
            Personalise
          </Link>
        </div>
      )}

      <section aria-labelledby="top-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="top-heading" className="text-2xl font-bold sm:text-3xl">
              Top picks for you
            </h2>
            {profile.persona && (
              <p className="mt-1 text-sm text-muted-foreground">
                Chosen for a {PERSONA_COPY[profile.persona].title.toLowerCase()}
              </p>
            )}
          </div>
          <button type="button" onClick={planMyDay} disabled={planning} className={btn('primary', 'lg')}>
            <Route aria-hidden />
            {planIds.length ? `See my plan (${planIds.length})` : 'Plan my day for me'}
            <ArrowRight aria-hidden />
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {top.map((p) => (
            <PlaceCard key={p.id} place={p} featured inPlan={planIds.includes(p.id)} onToggle={() => toggle(p.id, p.name)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="all-heading">
        <h2 id="all-heading" className="text-2xl font-bold sm:text-3xl">
          Explore everything
        </h2>

        <div className="sticky top-[66px] z-30 -mx-4 mt-5 flex flex-col gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" aria-label="Category" className="flex gap-1 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  filter === f.id ? 'text-pulse-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {filter === f.id && (
                  <m.span
                    layoutId="filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-pulse"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-56 lg:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <label htmlFor="place-search" className="sr-only">
                Search places or areas
              </label>
              <input
                id="place-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places or areas"
                className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-full border bg-card px-4 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {list.length} {list.length === 1 ? 'place' : 'places'}
        </p>

        <m.div layout className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <PlaceCard key={p.id} place={p} inPlan={planIds.includes(p.id)} onToggle={() => toggle(p.id, p.name)} />
            ))}
          </AnimatePresence>
        </m.div>

        {list.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center">
            <p className="font-medium">No places match that search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
              className={btn('secondary', 'sm', 'mt-4')}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
