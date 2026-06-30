# Febry — Retreats &amp; Experiences in Bali

A lightweight, fully responsive one-page website (plain HTML, CSS &amp; vanilla JS — no build step).

## Run it locally

**No server required.** It's a static site, so just double-click `index.html`
(or drag it into a browser) — nav, gallery lightbox, animations and the contact-form
email fallback all work straight from the file.

A local server is only useful if you want to test the Formspree AJAX form (see below)
or mirror production exactly. If so, a basic Node one-liner is enough — no install needed:

```bash
npx serve .
# or:  npx http-server -p 8000
# then visit the URL it prints (e.g. http://localhost:3000)
```

## Project structure

```
febri/
├── index.html          # all page content / sections
├── css/style.css       # styles + responsive rules
├── js/main.js          # nav, scroll reveal, gallery lightbox, contact form
├── assets/img/         # web-ready photos (renamed, used by the site)
├── images/             # original HEIC photos
│   └── web/            # full JPEG conversions of every photo
└── diagram.jpeg        # the sitemap this layout is based on
```

The page sections map directly to the sitemap: **Home → About → Experiences
(Retreats / Tours / Family trips / Workshops / Digital nomad) → Retreats sub-types
(Wellness / Women's / Entrepreneur / Corporate / Custom) → How it works → Portfolio → Contact.**

## Things to fill in (search the code for `TODO`)

| What | Where |
|------|-------|
| Real bio / story copy | `index.html` — About section |
| WhatsApp number | `index.html` — `wa.me/6285XXXXXXXXX` |
| Calendar / Calendly link | `index.html` — "Book a discovery call" button |
| Email + location | `index.html` — contact list + `js/main.js` `FALLBACK_EMAIL` |
| Social media URLs | `index.html` — footer `.socials` |
| Headline numbers (50+, 15+) | `index.html` — `.stat-row` |

### Contact form

The form works two ways:

1. **Recommended:** create a free form at [formspree.io](https://formspree.io), then replace
   `YOUR_FORM_ID` in the `<form action="...">` in `index.html`. Submissions are sent
   straight to Febry's inbox with no page reload.
2. **Fallback (default):** until that's configured, submitting opens the visitor's email
   app pre-filled to the address in `FALLBACK_EMAIL` (`js/main.js`).

## Swapping photos

Images live in `assets/img/` with descriptive names (e.g. `hero-villa-jungle.jpg`,
`flower-bath.jpg`). To change one, drop in a new file with the same name, or update the
`src` in `index.html`. All originals are kept in `images/` and `images/web/`.

## Deploying (free options)

- **Netlify** or **Cloudflare Pages**: drag-and-drop the folder, or connect a Git repo.
- **GitHub Pages**: push to a repo and enable Pages.

No server or database needed — it's a static site.
