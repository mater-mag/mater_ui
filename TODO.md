# TODO

## Supabase Cached Egress Issue (Priority: High)

**Problem:** Supabase free tier has 5GB/month cached egress limit. Currently at ~46% but warning says exceeded. News portal with many images will hit this limit quickly.

### Options (pick one):

1. **Add Cloudflare CDN (FREE)** - Recommended
   - Sign up at cloudflare.com
   - Add domain `matermag.hr`
   - Point DNS through Cloudflare
   - Cloudflare caches images at edge, reduces Supabase egress by 80-90%

2. **Upgrade Supabase to Pro** - $25/mo
   - Includes 250GB egress
   - Simple, no config needed

3. **Move images to Cloudflare R2** - ~$0.015/GB
   - More work to migrate
   - Cheapest long-term for heavy usage

---

## Database Migration - DONE

~~Run this SQL in Supabase SQL Editor:~~ **Completed**

```sql
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video_desktop TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video_mobile TEXT;
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_media_type_check;
ALTER TABLE articles ADD CONSTRAINT articles_media_type_check
  CHECK (media_type IN ('image', 'video', 'mixed'));
```

---

## Deployed - 2026-05-05

- [x] Fix 402 image error (bypass Vercel image optimization for external URLs)
- [x] Video autoplay on article pages
- [x] Mixed media support (image on desktop, video on mobile)
- [x] Database migration
- [x] Pushed to GitHub (commit 52b8b36)
