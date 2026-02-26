import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'admin'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-muted text-foreground hover:bg-muted/80',
      outline: 'border border-border bg-transparent hover:bg-muted',
      ghost: 'hover:bg-muted',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      admin: 'bg-admin-green-dark text-white hover:bg-admin-green',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 py-2 rounded-md',
      lg: 'h-12 px-6 text-lg rounded-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
