'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Media } from '@/types/database'

interface MediaLibraryModalProps {
  open: boolean
  onClose: () => void
  onSelect: (media: Media) => void
  /** Allow selecting multiple items */
  multiple?: boolean
  onSelectMultiple?: (media: Media[]) => void
}

export function MediaLibraryModal({ open, onClose, onSelect, multiple, onSelectMultiple }: MediaLibraryModalProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching media:', error)
        setMedia([])
      } else {
        setMedia((data || []) as Media[])
      }
    } catch (err) {
      console.error('Error fetching media:', err)
      setMedia([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      fetchMedia()
      setSelected([])
      setUploadError(null)
    }
  }, [open, fetchMedia])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const toggleSelect = (id: string) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    } else {
      setSelected([id])
    }
  }

  const handleConfirm = () => {
    if (selected.length === 0) return

    if (multiple && onSelectMultiple) {
      const selectedMedia = media.filter((m) => selected.includes(m.id))
      onSelectMultiple(selectedMedia)
    } else {
      const item = media.find((m) => m.id === selected[0])
      if (item) onSelect(item)
    }
    onClose()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadError(null)

    try {
      const supabase = createClient()

      for (const file of Array.from(files)) {
        // Validate file
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`Datoteka "${file.name}" je prevelika (max 10MB)`)
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file)

        if (uploadError) {
          setUploadError(`Greška pri uploadu: ${uploadError.message}`)
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName)

        // Insert media record into DB
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('media') as any).insert({
          url: urlData.publicUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: null,
          type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
          metadata: {
            size: file.size,
            format: fileExt,
            filename: file.name,
          },
        })
      }

      // Refresh media list
      await fetchMedia()
    } catch {
      setUploadError('Došlo je do greške pri uploadu.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Medijateka</h2>
            <p className="text-sm text-gray-500">
              {multiple ? 'Odaberite jednu ili više datoteka' : 'Odaberite datoteku'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {uploading ? 'Upload...' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 text-sm text-red-700">
            {uploadError}
          </div>
        )}

        {/* Media grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[var(--admin-green)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-20">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-4 text-gray-500">Nema medijskih datoteka</p>
              <p className="mt-1 text-sm text-gray-400">Uploadajte datoteke pomoću gumba iznad</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {media.map((item) => {
                const isSelected = selected.includes(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelect(item.id)}
                    className={`relative aspect-square rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-[var(--admin-green)] ${
                      isSelected ? 'ring-2 ring-[var(--admin-green)]' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <Image
                        src={item.url}
                        alt={item.alt || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Hover/selected overlay */}
                    <div
                      className={`absolute inset-0 transition-opacity ${
                        isSelected
                          ? 'bg-[var(--admin-green)]/20 opacity-100'
                          : 'bg-black/0 group-hover:bg-black/10 opacity-0 group-hover:opacity-100'
                      }`}
                    />

                    {/* Checkbox */}
                    <div className={`absolute top-2 left-2 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[var(--admin-green)] border-[var(--admin-green)]'
                        : 'border-white/80 bg-white/50 opacity-0 group-hover:opacity-100'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </div>

                    {/* Alt text label */}
                    {item.alt && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white truncate">{item.alt}</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {selected.length > 0
              ? `${selected.length} odabrano`
              : `${media.length} datoteka`}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Odustani
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--admin-green-dark)] rounded-lg hover:bg-[var(--admin-green)] transition-colors disabled:opacity-50"
            >
              Odaberi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
