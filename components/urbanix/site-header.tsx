'use client'

import { AnimatePresence, m } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { btn } from './btn'
import { Logo } from './logo'
import { SosHeaderButton } from './sos'
import { ThemeToggle } from './theme-toggle'

export const STEPS = [
  { href: '/', label: 'Welcome' },
  { href: '/personalise', label: 'About you' },
  { href: '/explore', label: 'Explore' },
  { href: '/plan', label: 'My plan' },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const stepIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.href === pathname),
  )
  const progress = (stepIndex + 1) / STEPS.length

  return (
    <header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ol className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const active = s.href === pathname
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {active && (
                      <m.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-secondary"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span
                      className={cn(
                        'grid size-5 place-items-center rounded-full text-[11px] font-bold',
                        i <= stepIndex ? 'bg-pulse text-pulse-foreground' : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {i + 1}
                    </span>
                    {s.label}
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <SosHeaderButton />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={btn('ghost', 'sm', 'size-9 px-0 md:hidden')}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t px-4 pb-4 md:hidden"
          >
            <ol className="flex flex-col gap-1 pt-3">
              {STEPS.map((s, i) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    onClick={() => setOpen(false)}
                    aria-current={s.href === pathname ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium',
                      s.href === pathname ? 'bg-secondary' : 'text-muted-foreground',
                    )}
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-muted text-xs font-bold">{i + 1}</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ol>
          </m.nav>
        )}
      </AnimatePresence>

      <div className="h-0.5 w-full bg-transparent" aria-hidden>
        <m.div
          className="h-full origin-left bg-pulse"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </header>
  )
}
