export function PageIntro({
  step,
  title,
  description,
  children,
}: {
  step: number
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-pulse">Step {step} of 4</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        <p className="mt-3 text-pretty text-muted-foreground sm:text-lg">{description}</p>
      </div>
      {children}
    </div>
  )
}
