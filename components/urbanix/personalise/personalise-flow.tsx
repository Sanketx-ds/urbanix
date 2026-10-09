'use client'

import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { DEMO_CITY } from '@/lib/urbanix/city-data'
import { PERSONA_COPY } from '@/lib/urbanix/scoring'
import type { Budget, Interest, Persona, Priority, Profile, TimeAvailable, Transport } from '@/lib/urbanix/types'
import { cn } from '@/lib/utils'
import { useUrbanix } from '../app-providers'
import { btn } from '../btn'
import { PulseLoader } from '../pulse-line'

type Opt<T> = { value: T; label: string; hint?: string }

const PERSONAS: Opt<Persona>[] = (Object.keys(PERSONA_COPY) as Persona[]).map((p) => ({
  value: p,
  label: PERSONA_COPY[p].title,
}))
const BUDGETS: Opt<Budget>[] = [
  { value: 'low', label: 'Tight', hint: 'Under ₹200 a stop' },
  { value: 'mid', label: 'Comfortable', hint: '₹200 to ₹700' },
  { value: 'high', label: 'Flexible', hint: 'Treat yourself' },
]
const TIMES: Opt<TimeAvailable>[] = [
  { value: 'few-hours', label: 'A few hours', hint: '3 stops' },
  { value: 'half-day', label: 'Half a day', hint: '4 stops' },
  { value: 'full-day', label: 'The whole day', hint: '6 stops' },
]
const INTERESTS: Opt<Interest>[] = [
  { value: 'food', label: 'Food' },
  { value: 'history', label: 'History' },
  { value: 'nature', label: 'Nature' },
  { value: 'art', label: 'Art' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'study', label: 'Study spots' },
  { value: 'tech', label: 'Tech' },
  { value: 'kids', label: 'Kids' },
]
const TRANSPORTS: Opt<Transport>[] = [
  { value: 'walk', label: 'Walking' },
  { value: 'metro', label: 'Metro and bus' },
  { value: 'bike', label: 'Bike or scooter' },
  { value: 'cab', label: 'Cab or auto' },
]
const ACCESS: Opt<boolean>[] = [
  { value: true, label: 'Yes, step-free please' },
  { value: false, label: "No, I'm fine" },
]
const PRIORITIES: Opt<Priority>[] = [
  { value: 'safety', label: 'Feeling safe' },
  { value: 'affordability', label: 'Saving money' },
]

interface Question {
  id: string
  ask: string
  answered: (p: Profile) => boolean
  summary: (p: Profile) => string
  render: (p: Profile, update: (patch: Partial<Profile>) => void) => React.ReactNode
}

const label = <T,>(opts: Opt<T>[], v: T | null) => opts.find((o) => o.value === v)?.label ?? ''

const QUESTIONS: Question[] = [
  {
    id: 'persona',
    ask: 'First up, what brings you to the city?',
    answered: (p) => p.persona !== null,
    summary: (p) => label(PERSONAS, p.persona),
    render: (p, u) => <Choices opts={PERSONAS} value={p.persona} onChange={(v) => u({ persona: v })} />,
  },
  {
    id: 'city',
    ask: 'Which city are you exploring?',
    answered: (p) => p.city.trim().length > 0,
    summary: (p) => p.city,
    render: (p, u) => <CityInput value={p.city} onChange={(city) => u({ city })} />,
  },
  {
    id: 'budget',
    ask: "What's your budget like?",
    answered: (p) => p.budget !== null,
    summary: (p) => label(BUDGETS, p.budget),
    render: (p, u) => <Choices opts={BUDGETS} value={p.budget} onChange={(v) => u({ budget: v })} />,
  },
  {
    id: 'time',
    ask: 'How much time do you have?',
    answered: (p) => p.time !== null,
    summary: (p) => label(TIMES, p.time),
    render: (p, u) => <Choices opts={TIMES} value={p.time} onChange={(v) => u({ time: v })} />,
  },
  {
    id: 'interests',
    ask: 'What do you love? Pick as many as you like.',
    answered: (p) => p.interests.length > 0,
    summary: (p) => p.interests.map((i) => label(INTERESTS, i)).join(', '),
    render: (p, u) => (
      <div className="flex flex-wrap gap-2" role="group" aria-label="Interests">
        {INTERESTS.map((o) => {
          const on = p.interests.includes(o.value)
          return (
            <Chip
              key={o.value}
              selected={on}
              role="checkbox"
              onClick={() =>
                u({ interests: on ? p.interests.filter((i) => i !== o.value) : [...p.interests, o.value] })
              }
            >
              {o.label}
            </Chip>
          )
        })}
      </div>
    ),
  },
  {
    id: 'transport',
    ask: 'How do you like to get around?',
    answered: (p) => p.transport !== null,
    summary: (p) => label(TRANSPORTS, p.transport),
    render: (p, u) => <Choices opts={TRANSPORTS} value={p.transport} onChange={(v) => u({ transport: v })} />,
  },
  {
    id: 'access',
    ask: 'Do you need step-free access anywhere you go?',
    answered: (p) => p.stepFree !== null,
    summary: (p) => (p.stepFree ? 'Step-free needed' : 'No special needs'),
    render: (p, u) => <Choices opts={ACCESS} value={p.stepFree} onChange={(v) => u({ stepFree: v })} />,
  },
  {
    id: 'priority',
    ask: 'Last one: what matters most to you today?',
    answered: (p) => p.priority !== null,
    summary: (p) => label(PRIORITIES, p.priority),
    render: (p, u) => <Choices opts={PRIORITIES} value={p.priority} onChange={(v) => u({ priority: v })} />,
  },
]

export function PersonaliseFlow() {
  const { profile, updateProfile, hydrated, reset, setPlanIds } = useUrbanix()
  const firstOpen = QUESTIONS.findIndex((q) => !q.answered(profile))
  const visibleCount = firstOpen === -1 ? QUESTIONS.length : firstOpen + 1
  const done = firstOpen === -1
  const lastRef = useRef<HTMLLIElement>(null)
  const [prevCount, setPrevCount] = useState(visibleCount)

  useEffect(() => {
    if (visibleCount > prevCount) {
      lastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setPrevCount(visibleCount)
  }, [visibleCount, prevCount])

  const update = (patch: Partial<Profile>) => {
    updateProfile(patch)
    setPlanIds([])
  }

  if (!hydrated) return <PulseLoader label="Loading your answers…" />

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <ol className="flex flex-col gap-4" aria-label="Personalisation questions">
        <AnimatePresence initial={false}>
          {QUESTIONS.slice(0, visibleCount).map((q, i) => (
            <m.li
              key={q.id}
              ref={i === visibleCount - 1 ? lastRef : undefined}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border bg-card p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                    q.answered(profile) ? 'bg-pulse text-pulse-foreground' : 'bg-secondary text-muted-foreground',
                  )}
                  aria-hidden
                >
                  {q.answered(profile) ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold sm:text-xl">{q.ask}</h2>
                  <div className="mt-4">{q.render(profile, update)}</div>
                </div>
              </div>
            </m.li>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {done && (
            <m.li
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-2xl border border-pulse/40 bg-accent/60 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display text-xl font-semibold">{"That's everything we need!"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Your personalised city is ready.</p>
              </div>
              <Link href="/explore" className={btn('primary', 'lg', 'shrink-0')}>
                See my city
                <ArrowRight aria-hidden />
              </Link>
            </m.li>
          )}
        </AnimatePresence>
      </ol>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Your answers">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Your profile</h2>
            <span className="text-xs font-medium text-muted-foreground">
              {QUESTIONS.filter((q) => q.answered(profile)).length}/{QUESTIONS.length}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <m.div
              className="h-full origin-left rounded-full bg-pulse"
              animate={{ scaleX: QUESTIONS.filter((q) => q.answered(profile)).length / QUESTIONS.length }}
            />
          </div>
          <dl className="mt-4 flex flex-col gap-3">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="flex justify-between gap-3 text-sm">
                <dt className="capitalize text-muted-foreground">{q.id === 'access' ? 'Access' : q.id}</dt>
                <dd className="text-right font-medium">{q.answered(profile) ? q.summary(profile) : '—'}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={reset}
            className={btn('ghost', 'sm', 'mt-5 w-full text-muted-foreground')}
          >
            <RotateCcw aria-hidden />
            Start over
          </button>
        </div>
      </aside>
    </div>
  )
}

function Chip({
  selected,
  children,
  role = 'radio',
  onClick,
}: {
  selected: boolean
  children: React.ReactNode
  role?: 'radio' | 'checkbox'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors duration-200 active:scale-[0.97]',
        selected
          ? 'border-pulse bg-pulse text-pulse-foreground'
          : 'bg-background hover:border-pulse/60 hover:bg-accent',
      )}
    >
      {selected && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
      {children}
    </button>
  )
}

function Choices<T extends string | boolean>({
  opts,
  value,
  onChange,
}: {
  opts: Opt<T>[]
  value: T | null
  onChange: (v: T) => void
}) {
  const hasHints = opts.some((o) => o.hint)
  if (!hasHints) {
    return (
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <Chip key={String(o.value)} selected={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </Chip>
        ))}
      </div>
    )
  }
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-3">
      {opts.map((o) => {
        const on = value === o.value
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-xl border p-4 text-left transition-colors duration-200 active:scale-[0.98]',
              on ? 'border-pulse bg-accent ring-1 ring-pulse' : 'bg-background hover:border-pulse/60',
            )}
          >
            <span className="block font-semibold">{o.label}</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">{o.hint}</span>
          </button>
        )
      })}
    </div>
  )
}

function CityInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [draft, setDraft] = useState(value)
  const isOtherCity = value && value.toLowerCase() !== DEMO_CITY.toLowerCase()
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Chip
          selected={value === DEMO_CITY}
          onClick={() => {
            setDraft(DEMO_CITY)
            onChange(DEMO_CITY)
          }}
        >
          {DEMO_CITY}
        </Chip>
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.trim()) onChange(draft.trim())
        }}
      >
        <label htmlFor="city" className="sr-only">
          Or type a city
        </label>
        <input
          id="city"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Or type a city"
          className="h-11 min-w-0 flex-1 rounded-full border bg-background px-4 text-sm placeholder:text-muted-foreground"
        />
        <button type="submit" className={btn('secondary', 'md')}>
          Set
        </button>
      </form>
      {isOtherCity && (
        <p className="text-sm text-muted-foreground">
          {`We're still mapping ${value}. For now we'll show you our ${DEMO_CITY} guide.`}
        </p>
      )}
    </div>
  )
}
