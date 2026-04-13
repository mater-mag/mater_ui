export function HeroBranding() {
  return (
    <section className="pt-4 pb-6">
      {/* Full Width MATER Branding - edge to edge */}
      <div className="mb-6 animate-in">
        <h1 className="flex justify-between w-full px-2 md:px-4">
          {'MATER'.split('').map((letter, i) => (
            <span
              key={i}
              className="font-display font-normal text-coral leading-none"
              style={{ fontSize: 'clamp(58px, 18vw, 336px)' }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      {/* Hero Tagline */}
      <div className="container animate-in">
        <p className="font-serif text-xl md:text-2xl text-foreground max-w-md">
          Inspirirajte svoj <em className="not-italic text-coral">obiteljski život</em>
        </p>
      </div>
    </section>
  )
}
