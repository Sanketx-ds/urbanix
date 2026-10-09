import { CITY_CONDITIONS, PLACES } from './city-data'
import type {
  Budget,
  Interest,
  Persona,
  Place,
  Profile,
  ScoredPlace,
  TimelineStop,
  Transport,
} from './types'

export const EMPTY_PROFILE: Profile = {
  persona: null,
  city: '',
  budget: null,
  time: null,
  interests: [],
  transport: null,
  stepFree: null,
  priority: null,
}

const BUDGET_CAP: Record<Budget, number> = { low: 200, mid: 700, high: 2000 }
const BUDGET_LABEL: Record<Budget, string> = { low: 'tight', mid: 'mid-range', high: 'flexible' }

const INTEREST_LABEL: Record<Interest, string> = {
  food: 'food',
  history: 'history',
  nature: 'nature',
  art: 'art',
  nightlife: 'nightlife',
  shopping: 'shopping',
  fitness: 'fitness',
  study: 'quiet study spots',
  tech: 'tech',
  kids: 'kid-friendly fun',
}

const PERSONA_TAGS: Record<Persona, Place['tags'][number][]> = {
  tourist: ['history', 'food', 'viewpoint', 'art'],
  student: ['study', 'quick', 'transit'],
  professional: ['work', 'quick', 'fitness'],
  family: ['kids', 'nature', 'hospital'],
  other: [],
}

const SPEED_KMH: Record<Transport, number> = { walk: 4.5, bike: 14, metro: 24, cab: 16 }
const WAIT_MIN: Record<Transport, number> = { walk: 0, bike: 2, metro: 6, cab: 5 }
export const TRANSPORT_LABEL: Record<Transport, string> = {
  walk: 'on foot',
  bike: 'by bike',
  metro: 'by metro',
  cab: 'by cab',
}

const HOSPITALS = PLACES.filter((p) => p.tags.includes('hospital'))

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function travelMinutes(km: number, transport: Transport | null) {
  const t = transport ?? 'metro'
  if (km < 0.2) return 2
  return Math.round((km * 1.3 * 60) / SPEED_KMH[t] + WAIT_MIN[t])
}

function nearestHospitalKm(p: Place) {
  return Math.min(...HOSPITALS.map((h) => dist(p, h)))
}

export function costLabel(cost: number) {
  return cost === 0 ? 'Free' : `₹${cost.toLocaleString('en-IN')}`
}

export function scorePlace(place: Place, profile: Profile): ScoredPlace {
  const persona = profile.persona ?? 'other'
  const budget = profile.budget ?? 'mid'
  const distanceKm = Math.round(dist(place, { x: 0, y: 0 }) * 10) / 10
  const reasons: { weight: number; text: string }[] = []

  const ratingPts = ((place.rating - 3.5) / 1.5) * 22

  const cap = BUDGET_CAP[budget]
  let pricePts = place.cost <= cap ? 18 : Math.max(0, 18 - ((place.cost - cap) / cap) * 18)
  if (budget === 'low' && place.cost <= 100) pricePts += 4
  if (profile.priority === 'affordability') pricePts *= 1.4
  if (place.cost <= cap && place.cost > 0) {
    reasons.push({ weight: pricePts, text: `${costLabel(place.cost)} fits your ${BUDGET_LABEL[budget]} budget` })
  } else if (place.cost === 0) {
    reasons.push({ weight: pricePts + 2, text: 'Completely free' })
  }

  let safetyPts = place.safety === 'high' ? 16 : place.safety === 'medium' ? 8 : 0
  if (profile.priority === 'safety' || persona === 'family') safetyPts *= 1.4
  if (place.safety === 'high' && (profile.priority === 'safety' || persona === 'family')) {
    reasons.push({ weight: safetyPts, text: 'Well-rated for safety' })
  }

  const travel = travelMinutes(distanceKm, profile.transport)
  const distancePts = Math.max(0, 14 - distanceKm * 2)
  if (travel <= 20) {
    reasons.push({
      weight: distancePts,
      text: `${travel} min ${TRANSPORT_LABEL[profile.transport ?? 'metro']}`,
    })
  }

  const matched = profile.interests.filter((i) => place.tags.includes(i))
  const interestPts = Math.min(22, matched.length * 11)
  if (matched.length) {
    reasons.push({
      weight: interestPts + 6,
      text: `Matches your love of ${matched.map((m) => INTEREST_LABEL[m]).join(' & ')}`,
    })
  }

  let personaPts = 0
  if (place.personas.includes(persona)) personaPts += 8
  const personaTagHits = PERSONA_TAGS[persona].filter((t) => place.tags.includes(t)).length
  personaPts += personaTagHits * 4
  if (persona === 'professional' && place.nearMetro) {
    personaPts += 3
    reasons.push({ weight: 5, text: 'Easy on your commute, near a metro stop' })
  }
  if (persona === 'student' && place.tags.includes('study')) {
    reasons.push({ weight: 9, text: 'Quiet and good for studying' })
  }
  if (persona === 'family') {
    const hk = nearestHospitalKm(place)
    if (hk < 2.5) {
      personaPts += 4
      reasons.push({ weight: 7, text: `Hospital within ${hk.toFixed(1)} km` })
    }
    if (place.tags.includes('kids')) reasons.push({ weight: 9, text: 'Great for kids' })
  }
  if (persona === 'tourist' && place.tags.includes('viewpoint')) {
    reasons.push({ weight: 8, text: 'Lovely evening viewpoint' })
  }

  let accessPts = 0
  if (profile.stepFree) {
    if (place.accessible) {
      accessPts = 6
      reasons.push({ weight: 6, text: 'Step-free access' })
    } else {
      accessPts = -30
    }
  }

  const raw = ratingPts + pricePts + safetyPts + distancePts + interestPts + personaPts + accessPts
  const score = Math.round(Math.min(99, Math.max(12, raw)))

  const why =
    reasons
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((r) => r.text)
      .join(' · ') || `Highly rated at ${place.rating}★ by locals`

  return { ...place, score, why, distanceKm }
}

export function scoreAll(profile: Profile) {
  return PLACES.map((p) => scorePlace(p, profile)).sort((a, b) => b.score - a.score)
}

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function formatTime(min: number) {
  const h = Math.floor(min / 60) % 24
  const m = Math.round(min % 60)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (!h) return `${m} min`
  return m ? `${h}h ${m}m` : `${h}h`
}

const STOP_COUNT = { 'few-hours': 3, 'half-day': 4, 'full-day': 6 } as const
const START_TIME = { 'few-hours': 15 * 60, 'half-day': 10 * 60, 'full-day': 9 * 60 + 30 } as const

/** Picks a balanced set of stops for the persona, then orders them to minimise backtracking. */
export function autoPlan(profile: Profile): string[] {
  const ranked = scoreAll(profile).filter((p) => p.plannable && p.score >= 30)
  const count = STOP_COUNT[profile.time ?? 'half-day']
  const picks: ScoredPlace[] = []
  const take = (pred: (p: ScoredPlace) => boolean) => {
    const found = ranked.find((p) => pred(p) && !picks.includes(p))
    if (found && picks.length < count) picks.push(found)
  }

  if (profile.persona === 'tourist') {
    take((p) => p.tags.includes('history') && p.category === 'attraction')
    take((p) => p.category === 'food')
  } else if (profile.persona === 'student') {
    take((p) => p.tags.includes('study'))
    take((p) => p.category === 'food' && p.cost <= 200)
  } else if (profile.persona === 'professional') {
    take((p) => p.tags.includes('work'))
    take((p) => p.tags.includes('quick'))
    take((p) => p.tags.includes('fitness'))
  } else if (profile.persona === 'family') {
    take((p) => p.tags.includes('kids'))
    take((p) => p.category === 'food' && p.accessible)
  }
  take((p) => p.category === 'food')
  while (picks.length < count) {
    const before = picks.length
    take((p) => p.category !== 'food' || picks.filter((q) => q.category === 'food').length < 2)
    if (picks.length === before) break
  }

  const viewpoint = profile.persona === 'tourist' ? picks.find((p) => p.tags.includes('viewpoint')) : undefined
  const rest = picks.filter((p) => p !== viewpoint)
  const ordered: ScoredPlace[] = []
  let cursor = { x: 0, y: 0 }
  while (rest.length) {
    rest.sort((a, b) => dist(cursor, a) - dist(cursor, b))
    const next = rest.shift()!
    ordered.push(next)
    cursor = next
  }
  if (viewpoint) ordered.push(viewpoint)
  return ordered.map((p) => p.id)
}

export function buildTimeline(ids: string[], profile: Profile): TimelineStop[] {
  const lookup = new Map(scoreAll(profile).map((p) => [p.id, p]))
  const { rainAfter } = CITY_CONDITIONS.weather
  let clock: number = START_TIME[profile.time ?? 'half-day']
  let cursor = { x: 0, y: 0 }
  const stops: TimelineStop[] = []

  for (const id of ids) {
    const place = lookup.get(id)
    if (!place) continue
    const travelKm = Math.round(dist(cursor, place) * 10) / 10
    const travelMin = travelMinutes(travelKm, profile.transport)
    let arrival = clock + travelMin
    const alerts: TimelineStop['alerts'] = []
    const opens = toMinutes(place.opens)
    const closes = toMinutes(place.closes)

    if (arrival < opens) {
      alerts.push({ type: 'opening', text: `Opens at ${formatTime(opens)}, short wait expected` })
      arrival = opens
    }
    const leave = arrival + place.durationMin
    if (arrival >= closes) {
      alerts.push({ type: 'closing', text: `Closed by ${formatTime(closes)}, try moving it earlier` })
    } else if (closes - leave < 30) {
      alerts.push({ type: 'closing', text: `Closes at ${formatTime(closes)}, don't linger` })
    }
    if (place.outdoor && leave >= rainAfter * 60) {
      alerts.push({
        type: 'weather',
        text: `${CITY_CONDITIONS.weather.rainChance}% chance of rain after ${formatTime(rainAfter * 60)}, carry an umbrella`,
      })
    }
    if (place.crowd === 'high') {
      alerts.push({ type: 'crowd', text: 'Usually crowded, expect a queue' })
    }

    stops.push({ place, arrival, leave, travelMin, travelKm, alerts })
    clock = leave
    cursor = place
  }
  return stops
}

export const PERSONA_COPY: Record<Persona, { title: string; message: string }> = {
  student: {
    title: 'Student',
    message: "Nice! We'll keep things budget-first: cheap eats, quiet study cafés and easy public transport.",
  },
  professional: {
    title: 'Working Professional',
    message: "Got it. We'll plan around your commute: co-working spaces, quick lunches and gyms on the way.",
  },
  tourist: {
    title: 'Tourist',
    message: 'Welcome! Expect heritage sites, legendary local food and a beautiful evening viewpoint.',
  },
  family: {
    title: 'Family Relocation',
    message: "We'll put safety first: parks, family restaurants and essential services close to hospitals.",
  },
  other: {
    title: 'Something else',
    message: "No problem. Tell us a bit about what you like and we'll build the city around you.",
  },
}
