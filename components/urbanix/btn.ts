import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'sos'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,color,border-color] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0'

const variants: Record<Variant, string> = {
  primary: 'btn-sheen bg-pulse text-pulse-foreground hover:bg-pulse/90',
  secondary: 'border bg-card text-card-foreground hover:border-pulse/50 hover:bg-accent',
  ghost: 'text-foreground hover:bg-secondary',
  sos: 'bg-sos text-sos-foreground hover:bg-sos/90',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

export function btn(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}
