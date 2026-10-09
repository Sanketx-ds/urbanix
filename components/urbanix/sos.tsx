'use client'

import { Hospital, LoaderCircle, MapPin, Phone, Pill, Share2, Siren, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { EMERGENCY_NUMBERS, PLACES } from '@/lib/urbanix/city-data'
import { cn } from '@/lib/utils'
import { useUrbanix } from './app-providers'
import { btn } from './btn'

const SOS_EVENT = 'urbanix:open-sos'

export function openSos() {
  window.dispatchEvent(new Event(SOS_EVENT))
}

const NEARBY_HELP = PLACES.filter((p) => p.tags.includes('hospital'))

export function SosHeaderButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openSos}
      className={btn('sos', 'sm', cn('gap-1.5 px-3.5', className))}
      aria-haspopup="dialog"
    >
      <Siren aria-hidden />
      SOS
    </button>
  )
}

export function SosFloatingButton() {
  return (
    <button
      type="button"
      onClick={openSos}
      aria-haspopup="dialog"
      aria-label="SOS: get emergency help"
      className="fixed bottom-5 right-5 z-50 grid size-16 place-items-center rounded-full bg-sos text-sos-foreground shadow-xl shadow-sos/30 transition-transform duration-150 hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-sos"
        style={{ animation: 'sos-ring 2s cubic-bezier(0.22,1,0.36,1) infinite' }}
      />
      <span className="relative flex flex-col items-center leading-none">
        <Siren className="size-5" aria-hidden />
        <span className="mt-0.5 text-xs font-bold tracking-wider">SOS</span>
      </span>
    </button>
  )
}

export function SosDialog() {
  const ref = useRef<HTMLDialogElement>(null)
  const { toast } = useUrbanix()
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const open = () => ref.current?.showModal()
    window.addEventListener(SOS_EVENT, open)
    return () => window.removeEventListener(SOS_EVENT, open)
  }, [])

  const close = () => ref.current?.close()

  const shareLocation = () => {
    if (!('geolocation' in navigator)) {
      toast('Location is not available on this device')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false)
        const { latitude, longitude, accuracy } = pos.coords
        const text = `I need help. My location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (within ${Math.round(accuracy)} m). Sent from Urbanix.`
        try {
          if (navigator.share) {
            await navigator.share({ title: 'Urbanix SOS', text })
          } else {
            await navigator.clipboard.writeText(text)
            toast('Location copied. Paste it to a trusted contact')
          }
        } catch {
          /* user dismissed the share sheet */
        }
      },
      () => {
        setLocating(false)
        toast('Could not get your location. Please call 112')
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const [primary, ...others] = EMERGENCY_NUMBERS

  return (
    <dialog
      ref={ref}
      aria-labelledby="sos-title"
      onClick={(e) => e.target === ref.current && close()}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-3xl border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-background/70 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95"
    >
      <div className="flex items-start justify-between gap-4 border-b p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-sos/15 text-sos">
            <Siren className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="sos-title" className="text-xl font-bold">
              Emergency help
            </h2>
            <p className="text-sm text-muted-foreground">Tap a number to call straight away.</p>
          </div>
        </div>
        <button type="button" onClick={close} className={btn('ghost', 'sm', 'size-9 px-0')} aria-label="Close emergency help">
          <X aria-hidden />
        </button>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <a
          href={`tel:${primary.number}`}
          className="flex items-center justify-between rounded-2xl bg-sos px-5 py-4 text-sos-foreground transition-transform duration-150 active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <Phone className="size-5" aria-hidden />
            <span className="text-left">
              <span className="block text-sm opacity-90">{primary.label}</span>
              <span className="block font-display text-2xl font-bold">Call {primary.number}</span>
            </span>
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Free · 24/7</span>
        </a>

        <ul className="grid grid-cols-2 gap-2">
          {others.map((n) => (
            <li key={n.number}>
              <a
                href={`tel:${n.number}`}
                className="flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm transition-colors hover:border-sos/50 hover:bg-sos/5"
              >
                <span className="font-medium">{n.label}</span>
                <span className="font-display font-bold text-sos">{n.number}</span>
              </a>
            </li>
          ))}
        </ul>

        <button type="button" onClick={shareLocation} disabled={locating} className={btn('secondary', 'md', 'w-full')}>
          {locating ? <LoaderCircle className="animate-spin" aria-hidden /> : <Share2 aria-hidden />}
          {locating ? 'Finding your location…' : 'Share my location with a contact'}
        </button>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Nearby help, open 24/7</h3>
          <ul className="flex flex-col gap-2">
            {NEARBY_HELP.map((p) => {
              const Icon = p.name.toLowerCase().includes('pharmacy') ? Pill : Hospital
              return (
                <li key={p.id} className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3.5 py-3">
                  <Icon className="size-4 shrink-0 text-pulse" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" aria-hidden />
                      {p.area}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </dialog>
  )
}
