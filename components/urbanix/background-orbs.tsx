'use client'

import { useEffect, useState } from 'react'

export function BackgroundOrbs() {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const playState = paused ? 'paused' : 'running'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-backdrop absolute inset-0" />
      <div
        className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-pulse/15 blur-3xl will-change-transform"
        style={{ animation: 'orb-drift 22s ease-in-out infinite', animationPlayState: playState }}
      />
      <div
        className="absolute -right-40 top-1/3 size-[30rem] rounded-full bg-amber/10 blur-3xl will-change-transform"
        style={{ animation: 'orb-drift 28s ease-in-out infinite reverse', animationPlayState: playState }}
      />
    </div>
  )
}
