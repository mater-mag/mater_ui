'use client'

import { useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { MediaLibraryModal } from './MediaLibraryModal'
import type { Media } from '@/types/database'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

function MenuBar({ editor, onOpenMedia }: { editor: Editor | null; onOpenMedia: () => void }) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('bold') ? 'bg-muted text-accent' : ''
        }`}
        title="Podebljano (Ctrl+B)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('italic') ? 'bg-muted text-accent' : ''
        }`}
        title="Kurziv (Ctrl+I)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('strike') ? 'bg-muted text-accent' : ''
        }`}
        title="Precrtano"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846ZM12.493 4c1.577 0 2.924.338 4.04 1.014 1.117.676 1.676 1.66 1.676 2.95 0 .71-.187 1.334-.56 1.873-.374.538-.95.967-1.73 1.29l-.143.053H12.46v-.002l-1.575-.002-.018-.003a2.49 2.49 0 0 1-.405-.135c-.665-.28-1.228-.682-1.69-1.206H14.9l.07-.042c.275-.167.48-.357.616-.573.136-.217.204-.477.204-.78 0-.584-.24-1.019-.722-1.304-.48-.284-1.16-.426-2.04-.426-1.322 0-2.653.316-3.991.948V5.11C10.354 4.369 11.65 4 13.18 4h-.688Z" />
        </svg>
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('heading', { level: 2 }) ? 'bg-muted text-accent' : ''
        }`}
        title="Naslov 2"
      >
        <span className="font-bold text-sm">H2</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('heading', { level: 3 }) ? 'bg-muted text-accent' : ''
        }`}
        title="Naslov 3"
      >
        <span className="font-bold text-sm">H3</span>
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('bulletList') ? 'bg-muted text-accent' : ''
        }`}
        title="Lista s točkama"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('orderedList') ? 'bg-muted text-accent' : ''
        }`}
        title="Numerirana lista"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 7h3.5v1H4v1h2v1H3v-4h2.5v1H4v-.5ZM4 15h2v1h-1v1h1v1H3v-1h1v-1H3v-2h1v1Zm4-4h13v2H8v-2Zm0 7h13v2H8v-2Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('blockquote') ? 'bg-muted text-accent' : ''
        }`}
        title="Citat"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Z" />
        </svg>
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Unesite URL linka:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        className={`p-2 rounded hover:bg-muted ${
          editor.isActive('link') ? 'bg-muted text-accent' : ''
        }`}
        title="Dodaj link"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.364 15.536 16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414Zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414Zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onOpenMedia}
        className="p-2 rounded hover:bg-muted"
        title="Dodaj sliku iz medijateke"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828ZM20 15V5H4v14L14 9l6 6Zm0 2.828l-6-6L6.828 19H20v-1.172ZM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
        </svg>
      </button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-muted disabled:opacity-50"
        title="Poništi (Ctrl+Z)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828Z" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-muted disabled:opacity-50"
        title="Ponovi (Ctrl+Y)"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7Z" />
        </svg>
      </button>
    </div>
  )
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [mediaOpen, setMediaOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Počnite pisati...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[300px] focus:outline-none',
      },
    },
  })

  const handleMediaSelect = (media: Media) => {
    if (editor && media.type === 'image') {
      editor.chain().focus().setImage({ src: media.url, alt: media.alt || '' }).run()
    }
  }

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        <MenuBar editor={editor} onOpenMedia={() => setMediaOpen(true)} />
        <EditorContent editor={editor} />
      </div>

      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  )
}
