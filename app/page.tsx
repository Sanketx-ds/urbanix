import { Features, HowItWorks } from '@/components/urbanix/home/features'
import { Hero } from '@/components/urbanix/home/hero'
import { PersonaPicker } from '@/components/urbanix/home/persona-picker'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PersonaPicker />
      <HowItWorks />
      <Features />
    </>
  )
}
