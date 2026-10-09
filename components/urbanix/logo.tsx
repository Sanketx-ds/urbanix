import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2 rounded-full" aria-label="Urbanix home">
      <span className="grid size-9 place-items-center rounded-xl bg-pulse text-pulse-foreground transition-transform duration-300 group-hover:rotate-6">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
          <path
            d="M2 13h4l2-5 3 10 3-13 2 8h6"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-xl font-bold tracking-tight">Urbanix</span>
    </Link>
  )
}
