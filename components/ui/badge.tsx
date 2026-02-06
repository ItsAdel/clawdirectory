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
          'bg-orange-200 text-orange-800 border border-orange-300':
            variant === 'default',
          'bg-orange-100 text-orange-700 border border-orange-200':
            variant === 'secondary',
          'text-orange-800 border border-orange-300': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
