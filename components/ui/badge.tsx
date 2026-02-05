import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
        {
          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30':
            variant === 'default',
          'bg-white/10 text-white/80 border border-white/20':
            variant === 'secondary',
          'text-white/80 border border-white/30': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
