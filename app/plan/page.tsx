import type { Metadata } from 'next'
import { PageIntro } from '@/components/urbanix/page-intro'
import { PlanView } from '@/components/urbanix/plan/plan-view'

export const metadata: Metadata = {
  title: 'My plan | Urbanix',
  description: 'Your personalised day plan with timings, travel, costs and live alerts.',
}

export default function PlanPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <PageIntro
        step={4}
        title="Your perfect day"
        description="Timed stops, travel between them and a heads-up if anything needs your attention."
      />
      <div className="mt-10">
        <PlanView />
      </div>
    </div>
  )
}
