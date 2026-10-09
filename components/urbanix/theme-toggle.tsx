'use client'

import { Moon, Sun } from 'lucide-react'
import { btn } from './btn'

export function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('urbanix-theme', isDark ? 'dark' : 'light')
  }

  return (
    <button type="button" onClick={toggle} className={btn('ghost', 'sm', 'size-9 px-0')} aria-label="Toggle light and dark mode">
      <Sun className="hidden dark:block" aria-hidden />
      <Moon className="block dark:hidden" aria-hidden />
    </button>
  )
}
