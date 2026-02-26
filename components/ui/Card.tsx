import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-border bg-background overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-lg font-semibold leading-none tracking-tight ${className}`}
        {...props}
      >
        {children}
      </h3>
    )
  }
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-sm text-muted-foreground ${className}`}
        {...props}
      >
        {children}
      </p>
    )
  }
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-6 pt-0 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center p-6 pt-0 ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
