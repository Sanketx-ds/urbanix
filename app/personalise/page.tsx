import type { Metadata } from 'next'
import { PageIntro } from '@/components/urbanix/page-intro'
import { PersonaliseFlow } from '@/components/urbanix/personalise/personalise-flow'

export const metadata: Metadata = {
  title: 'About you | Urbanix',
  description: 'A few quick questions so Urbanix can build a city that fits you.',
}

export default function PersonalisePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <PageIntro
        step={2}
        title="Let's get to know you"
        description="Just tap your answers. It takes under a minute, and you can change anything later."
      />
      <div className="mt-10">
        <PersonaliseFlow />
      </div>
    </div>
  )
}
