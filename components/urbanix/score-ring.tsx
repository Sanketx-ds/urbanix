'use client'

import { m } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ScoreRing({ score, size = 52, className }: { score: number; size?: number; className?: string }) {
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const tone = score >= 75 ? 'text-pulse' : score >= 50 ? 'text-amber' : 'text-muted-foreground'

  return (
    <div
      className={cn('relative grid shrink-0 place-items-center', tone, className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Pulse Score ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={stroke} />
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute font-display text-sm font-bold text-foreground">{score}</span>
    </div>
  )
}
