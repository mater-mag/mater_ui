import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Default animation settings
gsap.defaults({
  ease: 'power3.out',
  duration: 0.6,
})

export { gsap, ScrollTrigger }
