# Copilot Instructions for Chayabrito (ছায়াবৃত)

## Project Overview
Hugo-based Bengali literary magazine with 11 content categories, client-side search, dark mode, and Firebase push notifications. Deployed to GitHub Pages via Actions.

## Core Architecture

### Content Structure
- **Articles** (`content/articles/*.md`): Main literary content with Bengali text, English slugs
- **Authors** (`content/authors/*.md`): Author profiles linked via slug reference (not direct name)
- **Categories**: English slugs map to Bengali names via `hugo.yaml` `params.categoryMap`
  ```yaml
  # Example: kobita → "কবিতা", golpo → "গল্প"
  ```

### Category System
**Critical**: Categories use English slugs (`kobita`, `golpo`, etc.) in frontmatter but display Bengali names via `params.categoryMap`. Always use slug references:
```markdown
categories: ["kobita"]  # NOT ["কবিতা"]
```

Full mapping in [hugo.yaml](../hugo.yaml#L117-L127).

### Author Linking
Reference authors by slug, not display name:
```yaml
author: "animesh-das"  # References content/authors/animesh-das.md
```
Templates resolve to author page via `$.Site.GetPage (printf "/authors/%s" .)`.

### Layout System
- `layouts/_default/baseof.html`: Base template for all pages
- `layouts/partials/`: Reusable components (article-card, author-box, breadcrumb, etc.)
- Article single pages use structured data (Schema.org) and Open Graph tags
- Date formatting: Converts English months to Bengali via chained `replaceRE` (see [single.html](../layouts/articles/single.html#L38-L40))

## Development Workflows

### Local Development
```bash
hugo server -D
# Runs on http://localhost:1313/chayabrito/ (note baseURL path)
```

### Production Build
```bash
hugo --minify  # Output to public/
```

### Deployment
- Auto-deploys on push to `main` via GitHub Actions
- Uses Hugo Extended v0.145.0
- Build timezone: `Asia/Kolkata`
- Workflow: [deploy.yml](../workflows/deploy.yml)

## Key Conventions

### Content Frontmatter Template
```yaml
---
title: "বাংলায় শিরোনাম"
slug: "english-slug"
date: 2026-03-03
author: "author-slug"         # Must match existing author file
categories: ["kobita"]         # Use English slugs only
tags: ["ট্যাগ১", "ট্যাগ২"]    # Can be Bengali
featured: false                # true = appears in hero carousel
image: "/images/articles/..."
excerpt: "সংক্ষিপ্ত বর্ণনা"
seo_title: "SEO শিরোনাম"
seo_description: "SEO বর্ণনা"
---
```

### Image Paths
Always use root-relative paths: `/images/articles/file.jpg`, `/images/authors/photo.jpg`

### Search Index
- Generated at build time from `layouts/_default/index.searchindex.json`
- Client-side search via Fuse.js with weights: title (0.4), excerpt (0.3), content (0.2)
- Index loaded async from `/search-index.json`

### Date Formatting
Bengali month names rendered via template-level `replaceRE`:
```go-html-template
{{ .Date.Format "2 January 2006" | replaceRE "January" "জানুয়ারি" | ... }}
```
Pattern used in article cards, single pages, and metadata.

## JavaScript Architecture

### Main Features ([main.js](../assets/js/main.js))
- Dark mode toggle with `localStorage` persistence (`chayabrito-theme` key)
- Mobile menu with body scroll lock
- Reading progress bar (`IntersectionObserver` + scroll tracking)
- Featured carousel with auto-advance

### Search ([search.js](../assets/js/search.js))
- Fuse.js search with 0.35 threshold, 200 distance
- Works on both overlay and dedicated search page
- Debounced input with 300ms delay

### Firebase ([fcm.js](../assets/js/fcm.js))
- Push notifications via Firebase Cloud Messaging v10.12.0
- Config in `hugo.yaml` `params.firebase` (update for production)
- Service worker: `static/firebase-messaging-sw.js`

## Critical Files Reference

| File | Purpose |
|------|---------|
| [hugo.yaml](../hugo.yaml) | Config: baseURL, taxonomies, menus, categoryMap, Firebase |
| [layouts/index.html](../layouts/index.html) | Homepage: hero carousel + recent articles + category showcase |
| [layouts/articles/single.html](../layouts/articles/single.html) | Article template: breadcrumb, header, content, author box, related |
| [layouts/partials/article-card.html](../layouts/partials/article-card.html) | Reusable article card component |
| [assets/css/main.css](../assets/css/main.css) | Main styles with CSS variables for theming |
| [README.md](../README.md) | Full feature list, content management guide, category mapping table |

## Common Tasks

### Add New Article
1. Create `content/articles/new-slug.md` with complete frontmatter
2. Ensure author slug exists in `content/authors/`
3. Use valid category slug from categoryMap
4. Add image to `static/images/articles/`

### Add New Author
1. Create `content/authors/author-slug.md`
2. Slug must match value used in article `author:` field
3. Add photo to `static/images/authors/`

### Add New Category
1. Create `content/categories/{slug}/_index.md`
2. Add slug → name mapping to `hugo.yaml` `params.categoryMap`
3. Add to `menus.categories` in `hugo.yaml`

## Testing
- Run `hugo server -D` and verify articles display correctly
- Test search functionality on overlay and `/search/` page
- Verify dark mode toggle persists across pages
- Check author links resolve to correct profile pages
- Validate Bengali text renders with Noto fonts
