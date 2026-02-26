import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm
            placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-destructive' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
