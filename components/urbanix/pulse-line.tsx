'use client'

import { m } from 'framer-motion'
import { cn } from '@/lib/utils'

const PATH =
  'M0 40 H120 L138 40 L150 18 L164 62 L178 8 L192 70 L204 40 H330 L346 40 L356 26 L368 54 L378 40 H520 L536 40 L548 14 L562 66 L576 4 L590 72 L602 40 H800'

export function PulseLine({ className, loop = true }: { className?: string; loop?: boolean }) {
  return (
    <svg viewBox="0 0 800 80" fill="none" preserveAspectRatio="none" className={cn('w-full', className)} aria-hidden>
      <path d={PATH} stroke="currentColor" strokeOpacity={0.15} strokeWidth={2} vectorEffect="non-scaling-stroke" />
      <m.path
        d={PATH}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={loop ? { pathLength: 1, opacity: [0, 1, 1, 0.55, 1] } : { pathLength: 1, opacity: 1 }}
        transition={
          loop
            ? {
                pathLength: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 4, times: [0, 0.1, 0.5, 0.75, 1], repeat: Infinity, repeatDelay: 1 },
              }
            : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
        }
      />
    </svg>
  )
}

export function PulseLoader({ label = 'Personalising your city…' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-10 text-pulse">
      <svg viewBox="0 0 200 40" className="h-10 w-48" fill="none" aria-hidden>
        <m.path
          d="M0 20 H60 L70 20 L78 6 L88 34 L96 2 L104 38 L112 20 H200"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
