import { ArrowRight, Compass, Gauge, MessageSquareText, Route, Siren, UserRound } from 'lucide-react'
import Link from 'next/link'
import { btn } from '../btn'

const STEPS = [
  { icon: UserRound, title: 'Tell us who you are', body: 'Student, professional, tourist or family. One tap.' },
  { icon: MessageSquareText, title: 'Answer a few questions', body: 'Budget, time, interests and how you like to get around.' },
  { icon: Compass, title: 'Explore your city', body: 'Places ranked for you, with a clear reason for every pick.' },
  { icon: Route, title: 'Get your day plan', body: 'A timed route with costs and alerts. Drag to make it yours.' },
]

const FEATURES = [
  {
    icon: Gauge,
    title: 'Pulse Score',
    body: 'Every place gets a 0 to 100 score that blends rating, price, safety, distance and your interests.',
  },
  {
    icon: MessageSquareText,
    title: 'Why this matches you',
    body: 'No mystery picks. Each card explains in plain words why it suits you.',
  },
  {
    icon: Route,
    title: 'Plan my day',
    body: 'One button builds an itinerary in a sensible order, with travel time and total cost.',
  },
  {
    icon: Siren,
    title: 'SOS, always one tap away',
    body: 'Call emergency services, share your location or find a 24/7 hospital from any page.',
    highlight: true,
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 id="how-heading" className="text-3xl font-bold sm:text-4xl">
        How Urbanix works
      </h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <Icon className="size-6 text-pulse" aria-hidden />
              <span className="font-display text-sm font-bold text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-6 text-lg font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Features() {
  return (
    <section aria-labelledby="features-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <h2 id="features-heading" className="text-3xl font-bold sm:text-4xl">
            Built to be simple, and to keep you safe
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Large buttons, plain language and no clutter. Urbanix does the thinking so you can enjoy the city.
          </p>
          <Link href="/personalise" className={btn('primary', 'md', 'mt-6')}>
            Start planning
            <ArrowRight aria-hidden />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body, highlight }) => (
            <li
              key={title}
              className={
                highlight ? 'rounded-2xl border border-sos/40 bg-sos/5 p-6' : 'rounded-2xl border bg-card p-6'
              }
            >
              <span
                className={
                  highlight
                    ? 'grid size-11 place-items-center rounded-xl bg-sos text-sos-foreground'
                    : 'grid size-11 place-items-center rounded-xl bg-secondary text-pulse'
                }
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
