# Reabetswe Technologies — Website

A static, multi-page website for **Reabetswe Technologies**, a coding and IT
school for young people aged 10–16. Built with plain HTML, CSS and
JavaScript — no build step, no framework, so it's easy to read, edit, and
host for free.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, programme overview, curriculum path, schedule |
| About Us | `about.html` | Story, values, timeline |
| Services | `services.html` | Full curriculum (5 modules), class formats |
| Gallery | `gallery.html` | Filterable photo/project gallery |
| Contact | `contact.html` | Contact form, map, FAQ |
| Register | `register.html` | Parent/guardian enrolment form for a child |
| Learner Profile | `profile.html` | Learners (10–16) create a profile or log in |
| Dashboard | `dashboard.html` | Logged-in learner's module progress and badges |

## Before you publish — things to personalise

This is a complete, working site, but a few placeholders need your real
details before it goes live:

1. **Logo** — `assets/logo.svg` is a close recreation of your uploaded logo
   (the original PNG wasn't accessible on disk in this session). Drop your
   real logo file into `assets/` and update the `<img src="...">`
   references across the HTML files if you'd rather use the PNG.
2. **Contact details** — phone number, email address and physical address
   are placeholders in `contact.html` and in every page's footer. Search
   for `hello@reabetswetechnologies.co.za`, `+27 00 000 0000` and
   "Johannesburg, Gauteng" and replace them.
3. **Social links** — the icons in the footer link to placeholder handles
   (`reabetswetechnologies`). Update the `href`s once your real accounts
   exist.
4. **Map embed** — `contact.html` embeds a generic Johannesburg map. Replace
   the `src` on the `<iframe>` with your exact venue once confirmed (Google
   Maps → Share → Embed a map).
5. **Gallery images** — `assets/gallery/*.svg` are original illustrated
   placeholders (deliberately not photos of real children, for privacy).
   Swap in real class photos once you have signed photo-consent from
   parents (there's already a consent checkbox on the registration form).

## How the learner profile system works

Registration (`register.html`) and learner profiles (`profile.html`,
`dashboard.html`) currently save data in the visitor's own browser using
`localStorage` — there is no server or database. This keeps the site fully
static and free to host, and is genuinely enough for a portfolio piece or
an early pilot. It has real limits worth knowing before you rely on it:

- Data lives only on the device that submitted it — a parent registering
  on their phone won't see that entry on your laptop.
- Clearing browser data deletes it.
- Passwords are stored in plain text client-side — fine for a demo, **not**
  fine for real learner accounts.

**To make this production-ready**, replace the `localStorage` calls in
`js/auth.js` with calls to a real backend. Reasonable low-effort options:
- **Firebase** (Auth + Firestore) — free tier, no server to manage, plays
  nicely with a static site.
- **Supabase** — similar to Firebase, Postgres-based, generous free tier.
- A small custom API (Node/Express, Python/Flask, etc.) hosted separately,
  with the static site calling it via `fetch()`.

Everything else on the site (pages, forms' visual behaviour, validation)
stays the same either way — only the storage calls change.

## Hosting it for free on GitHub Pages

This is the natural home for a portfolio project:

1. Create a new GitHub repository (e.g. `reabetswe-technologies`).
2. Push this folder's contents to the repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/reabetswe-technologies.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → Deploy from a branch**, choose
   `main` and `/ (root)`, then save.
4. GitHub will publish the site at
   `https://<your-username>.github.io/reabetswe-technologies/` within a
   minute or two.
5. Optional: add a custom domain under **Settings → Pages → Custom domain**
   once you own one, plus a `CNAME` file (GitHub creates this for you).

### Other free/cheap options
- **Netlify** or **Vercel** — drag-and-drop the folder or connect the
  GitHub repo; both auto-deploy on every push and support custom domains
  on their free tiers.
- **Cloudflare Pages** — same idea, fast global CDN, free tier.

Any of these work well for a static site like this one — GitHub Pages is
the simplest choice if the main goal is showing this project alongside
your code in a GitHub profile for a graduate application.

## For your graduate application

Worth highlighting in your portfolio write-up or CV:
- Fully responsive, accessible (skip link, visible focus states, semantic
  HTML, `prefers-reduced-motion` support) multi-page site built without a
  framework.
- Client-side form validation, a working (localStorage-backed) auth flow,
  and a filterable gallery — all in vanilla JavaScript.
- A documented, realistic path to a production backend (see above), which
  shows you understand the limits of what you built and how to grow it.

## Local preview

No build tools needed — just open `index.html` in a browser, or serve the
folder locally for a closer-to-production preview:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
