import type { Metadata } from 'next'
import { CityPulse } from '@/components/urbanix/explore/city-pulse'
import { ExploreView } from '@/components/urbanix/explore/explore-view'
import { PageIntro } from '@/components/urbanix/page-intro'

export const metadata: Metadata = {
  title: 'Explore | Urbanix',
  description: 'Places, food and services ranked for you with a Pulse Score and a clear reason for every pick.',
}

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <PageIntro
        step={3}
        title="Your city, ranked for you"
        description="Every place has a Pulse Score out of 100. Add the ones you like, or let us plan the whole day."
      />
      <div className="mt-8">
        <CityPulse />
      </div>
      <div className="mt-12">
        <ExploreView />
      </div>
    </div>
  )
}
