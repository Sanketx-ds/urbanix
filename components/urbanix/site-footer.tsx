import Link from 'next/link'
import { Logo } from './logo'

const LINKS = [
  {
    title: 'Plan',
    items: [
      { href: '/', label: 'Get started' },
      { href: '/personalise', label: 'Personalise' },
      { href: '/explore', label: 'Explore the city' },
      { href: '/plan', label: 'My city plan' },
    ],
  },
  {
    title: 'Safety',
    items: [
      { href: 'tel:112', label: 'Emergency: 112' },
      { href: 'tel:108', label: 'Ambulance: 108' },
      { href: 'tel:1091', label: 'Women helpline: 1091' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your city. Your purpose. Your perfect plan. Urbanix learns who you are, then builds a city that fits you.
          </p>
        </div>
        {LINKS.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-semibold">{group.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
          {'© 2026 Urbanix. Demo data for Bengaluru.'}
        </p>
      </div>
    </footer>
  )
}
