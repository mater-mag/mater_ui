# Matermag.hr Portal

## Project Overview
News/lifestyle portal replacing WordPress site. Design inspired by trika.hr, content structure similar to journal.hr.

## Stack
- Next.js 15 (App Router) | Supabase (DB + Auth + Storage) | Vercel
- GSAP + Lenis (animations/smooth scroll) | Tailwind CSS
- Tiptap (rich text editor) | next-seo

## Key Paths
- `/app/(public)` - Public pages
- `/app/(admin)` - CMS dashboard
- `/lib/supabase` - DB client + queries
- `/components/seo` - Yoast-like SEO editor

## Database Tables
`articles`, `categories`, `pages`, `media`, `authors`, `seo_settings`

## Supabase
- Project: `xkptnbksgghvjsxalvko`
- DB migrated, Auth configured, RLS enabled
- Default categories seeded (Vijesti, Lifestyle, Zdravlje, Recepti, Djeca)

## Commands
```bash
npm run dev      # Development
npm run build    # Production build
npm run lint     # Lint check
```

## Conventions
- Server Components by default, "use client" only when needed
- All images via next/image + Supabase Storage
- SEO data stored as JSONB in seo_data column
- ISR for articles (revalidate: 3600)

## SEO Requirements
- Meta title/description with char limits (60/160)
- Focus keyphrase + readability analysis
- OG/Twitter card previews
- Schema.org NewsArticle markup
- Auto-generated sitemap.xml

## Design Reference
- Style: https://www.trika.hr/trika-home/
- Content: https://journal.hr/
