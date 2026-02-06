import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-orange-400 text-white hover:bg-orange-500 shadow-md': variant === 'primary',
            'bg-orange-100 text-orange-900 hover:bg-orange-200 border border-orange-300':
              variant === 'secondary',
            'text-orange-900 hover:bg-orange-100': variant === 'ghost',
            'bg-red-400 text-white hover:bg-red-500': variant === 'danger',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-5 text-base': size === 'md',
            'h-14 px-7 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
