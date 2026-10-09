export type Persona = 'student' | 'professional' | 'tourist' | 'family' | 'other'

export type Budget = 'low' | 'mid' | 'high'
export type TimeAvailable = 'few-hours' | 'half-day' | 'full-day'
export type Transport = 'walk' | 'metro' | 'bike' | 'cab'
export type Priority = 'safety' | 'affordability'
export type Category = 'attraction' | 'food' | 'place' | 'service'
export type Safety = 'high' | 'medium' | 'low'
export type Crowd = 'low' | 'medium' | 'high'

export type Interest =
  | 'food'
  | 'history'
  | 'nature'
  | 'art'
  | 'nightlife'
  | 'shopping'
  | 'fitness'
  | 'study'
  | 'tech'
  | 'kids'

export interface Profile {
  persona: Persona | null
  city: string
  budget: Budget | null
  time: TimeAvailable | null
  interests: Interest[]
  transport: Transport | null
  stepFree: boolean | null
  priority: Priority | null
}

export interface Place {
  id: string
  name: string
  category: Category
  area: string
  description: string
  tags: (Interest | 'viewpoint' | 'quick' | 'work' | 'hospital' | 'transit')[]
  personas: Persona[]
  rating: number
  cost: number
  /** Position in km relative to the city centre, used for distance and travel-time estimates. */
  x: number
  y: number
  opens: string
  closes: string
  durationMin: number
  crowd: Crowd
  safety: Safety
  accessible: boolean
  outdoor: boolean
  nearMetro: boolean
  plannable: boolean
}

export interface ScoredPlace extends Place {
  score: number
  why: string
  distanceKm: number
}

export interface TimelineStop {
  place: ScoredPlace
  arrival: number
  leave: number
  travelMin: number
  travelKm: number
  alerts: { type: 'weather' | 'closing' | 'crowd' | 'opening'; text: string }[]
}
