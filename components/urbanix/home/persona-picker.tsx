'use client'

import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Briefcase, Camera, Check, GraduationCap, House, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { PERSONA_COPY } from '@/lib/urbanix/scoring'
import type { Persona } from '@/lib/urbanix/types'
import { cn } from '@/lib/utils'
import { useUrbanix } from '../app-providers'
import { btn } from '../btn'

const OPTIONS: { id: Persona; icon: typeof Camera; hint: string }[] = [
  { id: 'student', icon: GraduationCap, hint: 'Cheap eats, study spots' },
  { id: 'professional', icon: Briefcase, hint: 'Commute-smart picks' },
  { id: 'tourist', icon: Camera, hint: 'Heritage and local food' },
  { id: 'family', icon: House, hint: 'Safe, accessible places' },
  { id: 'other', icon: Sparkles, hint: 'Build it from scratch' },
]

export function PersonaPicker() {
  const { profile, updateProfile } = useUrbanix()
  const selected = profile.persona

  return (
    <section id="start" aria-labelledby="persona-heading" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-pulse">Step 1 of 4</p>
        <h2 id="persona-heading" className="mt-2 text-3xl font-bold sm:text-4xl">
          What brings you to the city?
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Pick the one that fits best. Everything you see next is shaped around it, and you can change it any time.
        </p>
      </div>

      <div role="radiogroup" aria-labelledby="persona-heading" className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {OPTIONS.map(({ id, icon: Icon, hint }) => {
          const isSelected = selected === id
          const dimmed = selected !== null && !isSelected
          return (
            <m.button
              key={id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => updateProfile({ persona: id })}
              whileHover={{ y: -4 }}
              animate={{ scale: isSelected ? 1.02 : 1, opacity: dimmed ? 0.6 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={cn(
                'relative flex flex-col items-start gap-4 rounded-2xl border bg-card p-5 text-left transition-colors duration-300',
                isSelected ? 'border-pulse ring-1 ring-pulse' : 'hover:border-pulse/50',
                id === 'other' && 'col-span-2 lg:col-span-1',
              )}
            >
              <span
                className={cn(
                  'grid size-12 place-items-center rounded-xl transition-colors',
                  isSelected ? 'bg-pulse text-pulse-foreground' : 'bg-secondary text-pulse',
                )}
              >
                <Icon className="size-6" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold leading-tight">{PERSONA_COPY[id].title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>
              </span>
              <AnimatePresence>
                {isSelected && (
                  <m.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-pulse text-pulse-foreground"
                  >
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </m.span>
                )}
              </AnimatePresence>
            </m.button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-6 min-h-24">
        <AnimatePresence mode="wait">
          {selected && (
            <m.div
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4 rounded-2xl border border-pulse/30 bg-accent/60 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-pretty font-medium">{PERSONA_COPY[selected].message}</p>
              <Link href="/personalise" className={btn('primary', 'md', 'shrink-0')}>
                Continue
                <ArrowRight aria-hidden />
              </Link>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
