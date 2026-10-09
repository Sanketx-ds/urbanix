import { ArrowDown, ArrowRight, CloudSun, ShieldCheck, Star, TrafficCone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CITY_CONDITIONS, DEMO_CITY } from '@/lib/urbanix/city-data'
import { btn } from '../btn'
import { PulseLine } from '../pulse-line'

export function Hero() {
  const { weather, traffic, safety } = CITY_CONDITIONS
  return (
    <section aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-10 pt-12 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-pulse" aria-hidden />
            Now live in {DEMO_CITY}
          </p>
          <h1 id="hero-heading" className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Hey, welcome to <span className="text-pulse">Urbanix</span>!
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Your city. Your purpose. Your perfect plan. Tell us who you are and we&apos;ll show you the places, food and
            routes that actually fit you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="#start" className={btn('primary', 'lg')}>
              Get started
              <ArrowDown aria-hidden />
            </Link>
            <Link href="/personalise" className={btn('secondary', 'lg')}>
              Already know what you want? Start planning
              <ArrowRight aria-hidden />
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              ['26+', 'curated places'],
              ['4 steps', 'to your plan'],
              ['1 tap', 'SOS help'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-bold">{value}</dd>
                <dd className="text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border">
            <Image
              src="/images/city-hero.png"
              alt={`${DEMO_CITY} at blue hour, a tree-lined boulevard with granite architecture`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-3 gap-2 rounded-2xl border bg-card/90 p-3 shadow-xl backdrop-blur-md sm:left-8 sm:right-8">
            <Stat icon={CloudSun} label="Weather" value={`${weather.tempC}°C`} />
            <Stat icon={TrafficCone} label="Traffic" value={traffic.level} />
            <Stat icon={ShieldCheck} label="Safety" value={safety.level} />
          </div>

          <div className="absolute -top-4 right-4 hidden items-center gap-3 rounded-2xl border bg-card p-3 shadow-xl sm:flex">
            <span className="grid size-11 place-items-center rounded-full border-2 border-pulse font-display text-sm font-bold text-pulse">
              92
            </span>
            <span>
              <span className="block text-sm font-semibold">Cubbon Park</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 fill-amber text-amber" aria-hidden />
                4.6 · Free · 8 min away
              </span>
            </span>
          </div>
        </div>
      </div>

      <PulseLine className="mt-10 h-16 text-pulse" />
    </section>
  )
}

function Stat({ icon: Icon, label, value }: { icon: typeof CloudSun; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
      <Icon className="size-5 shrink-0 text-pulse" aria-hidden />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}
