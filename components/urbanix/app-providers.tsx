'use client'

import { AnimatePresence, LazyMotion, MotionConfig, domMax, m } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { EMPTY_PROFILE } from '@/lib/urbanix/scoring'
import type { Profile } from '@/lib/urbanix/types'

const STORAGE_KEY = 'urbanix-state-v1'

interface UrbanixState {
  profile: Profile
  planIds: string[]
  savedAt: number | null
}

interface UrbanixContextValue extends UrbanixState {
  hydrated: boolean
  updateProfile: (patch: Partial<Profile>) => void
  setPlanIds: (ids: string[]) => void
  togglePlace: (id: string) => void
  markSaved: () => void
  reset: () => void
  toast: (message: string) => void
}

const UrbanixContext = createContext<UrbanixContextValue | null>(null)

export function useUrbanix() {
  const ctx = useContext(UrbanixContext)
  if (!ctx) throw new Error('useUrbanix must be used inside AppProviders')
  return ctx
}

const INITIAL: UrbanixState = { profile: EMPTY_PROFILE, planIds: [], savedAt: null }

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UrbanixState>(INITIAL)
  const [hydrated, setHydrated] = useState(false)
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([])
  const toastId = useRef(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as UrbanixState
        setState({ ...INITIAL, ...parsed, profile: { ...EMPTY_PROFILE, ...parsed.profile } })
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const toast = useCallback((message: string) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }, [])

  const value = useMemo<UrbanixContextValue>(
    () => ({
      ...state,
      hydrated,
      updateProfile: (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
      setPlanIds: (ids) => setState((s) => ({ ...s, planIds: ids })),
      togglePlace: (id) =>
        setState((s) => ({
          ...s,
          planIds: s.planIds.includes(id) ? s.planIds.filter((x) => x !== id) : [...s.planIds, id],
        })),
      markSaved: () => setState((s) => ({ ...s, savedAt: Date.now() })),
      reset: () => setState(INITIAL),
      toast,
    }),
    [state, hydrated, toast],
  )

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <UrbanixContext.Provider value={value}>
          {children}
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4"
          >
            <AnimatePresence>
              {toasts.map((t) => (
                <m.div
                  key={t.id}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="pointer-events-auto flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground shadow-lg"
                >
                  <CheckCircle2 className="size-4 text-pulse" aria-hidden />
                  {t.message}
                </m.div>
              ))}
            </AnimatePresence>
          </div>
        </UrbanixContext.Provider>
      </MotionConfig>
    </LazyMotion>
  )
}
