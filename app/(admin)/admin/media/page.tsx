'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface MediaItem {
  id: string
  url: string
  filename: string
  alt: string | null
  mime_type: string | null
  size: number | null
  created_at: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchMedia = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && !error) {
      setMedia(data as MediaItem[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      // Save to media table
      await supabase.from('media').insert({
        url: urlData.publicUrl,
        filename: file.name,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        mime_type: file.type,
        size: file.size,
      })
    }

    setUploading(false)
    fetchMedia()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (selectedMedia.length === 0) return

    const supabase = createClient()

    for (const id of selectedMedia) {
      const item = media.find(m => m.id === id)
      if (!item) continue

      // Extract file path from URL
      const urlParts = item.url.split('/media/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from('media').remove([filePath])
      }

      // Delete from table
      await supabase.from('media').delete().eq('id', id)
    }

    setSelectedMedia([])
    fetchMedia()
  }

  const toggleSelect = (id: string) => {
    setSelectedMedia((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0 && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      Array.from(files).forEach(file => dataTransfer.items.add(file))
      fileInputRef.current.files = dataTransfer.files
      handleUpload({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-green)]"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medijateka</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte slikama i datotekama</p>
        </div>
        <div className="flex gap-2">
          {selectedMedia.length > 0 && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Obriši ({selectedMedia.length})
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--admin-green-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--admin-green)] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Učitavanje...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Dodaj medij
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="mb-8 p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-white hover:border-[var(--admin-green)] hover:bg-[var(--admin-green-light)] transition-colors group cursor-pointer"
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-300 group-hover:text-[var(--admin-green)] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mt-4 text-gray-500">
          Povucite datoteke ovdje ili{' '}
          <span className="text-[var(--admin-green)] font-medium">
            odaberite s računala
          </span>
        </p>
        <p className="mt-1 text-sm text-gray-400">
          PNG, JPG, GIF do 10MB
        </p>
      </div>

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nema učitanih medija</p>
          <p className="text-sm mt-1">Dodajte slike pomoću gumba iznad</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                selectedMedia.includes(item.id) ? 'ring-2 ring-[var(--admin-green)]' : ''
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              <Image
                src={item.url}
                alt={item.alt || item.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />
              <div
                className={`absolute inset-0 bg-black/50 transition-opacity ${
                  selectedMedia.includes(item.id)
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <div className="absolute top-2 left-2">
                  <div
                    className={`w-5 h-5 rounded border-2 ${
                      selectedMedia.includes(item.id)
                        ? 'bg-[var(--admin-green)] border-[var(--admin-green)]'
                        : 'border-white'
                    }`}
                  >
                    {selectedMedia.includes(item.id) && (
                      <svg
                        className="w-full h-full text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs truncate">{item.filename}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
