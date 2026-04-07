import { Node, mergeAttributes } from '@tiptap/core'

export interface InstagramEmbedOptions {
  HTMLAttributes: Record<string, string>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    instagramEmbed: {
      setInstagramEmbed: (options: { url: string }) => ReturnType
    }
  }
}

// Extract Instagram post ID from various URL formats
function extractInstagramId(url: string | null | undefined): string | null {
  if (!url) return null

  // Match patterns like:
  // https://www.instagram.com/p/ABC123/
  // https://www.instagram.com/reel/ABC123/
  // https://instagram.com/p/ABC123
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export const InstagramEmbed = Node.create<InstagramEmbedOptions>({
  name: 'instagramEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: element => element.getAttribute('data-url'),
        renderHTML: attributes => {
          if (!attributes.url) return {}
          return { 'data-url': attributes.url }
        },
      },
      postId: {
        default: null,
        parseHTML: element => element.getAttribute('data-post-id'),
        renderHTML: attributes => {
          if (!attributes.postId) return {}
          return { 'data-post-id': attributes.postId }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-instagram-embed]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const url = HTMLAttributes.url || ''
    const postId = HTMLAttributes.postId || extractInstagramId(url)
    const permalinkUrl = url ? `${url}?utm_source=ig_embed` : ''

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-instagram-embed': '',
        'data-post-id': postId || '',
        'data-url': url,
        class: 'instagram-embed-container',
      }),
      [
        'blockquote',
        {
          class: 'instagram-media',
          'data-instgrm-permalink': permalinkUrl,
          'data-instgrm-version': '14',
          style: 'background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:calc(100% - 2px);',
        },
        [
          'div',
          { style: 'padding:16px;' },
          [
            'a',
            {
              href: permalinkUrl,
              style: 'background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;',
              target: '_blank',
            },
            'View this post on Instagram',
          ],
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setInstagramEmbed:
        (options) =>
        ({ commands }) => {
          const postId = extractInstagramId(options.url)
          if (!postId) {
            return false
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              url: options.url,
              postId,
            },
          })
        },
    }
  },
})
