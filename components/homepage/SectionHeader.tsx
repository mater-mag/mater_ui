import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  href?: string
  linkText?: string
}

export function SectionHeader({ title, href, linkText = 'Pogledaj sve' }: SectionHeaderProps) {
  return (
    <div className="animate-in mb-10">
      <div className="flex items-end justify-between mb-4">
        <h2 className="font-serif text-2xl md:text-3xl font-bold">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-foreground/50 hover:text-coral transition-colors"
          >
            {linkText}
          </Link>
        )}
      </div>
      <div className="w-full h-px bg-foreground/10"></div>
    </div>
  )
}
