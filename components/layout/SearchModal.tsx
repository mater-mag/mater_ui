'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const popularTags = [
  'zdravaprehrana',
  'mastitis',
  'trudnoća',
  'bebe',
  'dojenje',
  'recepti',
  'lifestyle',
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // GSAP open animation
  const openModal = useCallback(() => {
    setIsVisible(true)
    const tl = gsap.timeline()

    tl.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    .fromTo(closeButtonRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.1'
    )
    .fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )
    .add(() => {
      inputRef.current?.focus()
    })

    document.body.style.overflow = 'hidden'
  }, [])

  // GSAP close animation
  const closeModal = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false)
        document.body.style.overflow = ''
        onClose()
      }
    })

    tl.to(contentRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in'
    })
    .to(closeButtonRef.current, {
      opacity: 0,
      x: 20,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.2')
    .to(modalRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.1')
  }, [onClose])

  // Handle open state
  useEffect(() => {
    if (isOpen && !isVisible) {
      openModal()
    }
  }, [isOpen, isVisible, openModal])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isVisible, closeModal])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/pretraga?q=${encodeURIComponent(query.trim())}`)
    closeModal()
    setQuery('')
  }

  const handleTagClick = (tag: string) => {
    router.push(`/pretraga?q=${encodeURIComponent(tag)}`)
    closeModal()
    setQuery('')
  }

  if (!isOpen && !isVisible) return null

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 bg-white opacity-0">
      {/* Close Button */}
      <div className="absolute top-6 right-6">
        <button
          ref={closeButtonRef}
          onClick={closeModal}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 opacity-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm font-medium">Zatvori</span>
        </button>
      </div>

      {/* Content */}
      <div className="h-full flex items-center justify-center px-6">
        <div ref={contentRef} className="w-full max-w-2xl opacity-0">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Unesite pojam..."
                  className="w-full py-3 border-b-2 border-gray-200 focus:border-coral outline-none text-lg md:text-xl placeholder:text-gray-400 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 md:px-8 py-3 bg-dark-bg text-white font-medium rounded-full hover:bg-gray-800 shrink-0"
              >
                Pretraži
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div>
            <p className="font-semibold text-sm mb-4">Popularne teme</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, index) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 text-sm rounded-full ${
                    index === 1
                      ? 'bg-dark-bg text-white hover:bg-gray-800'
                      : 'border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
