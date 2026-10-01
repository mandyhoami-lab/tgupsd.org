# tgupsd.org — clean rebuild

Rebuild of [tgupsd.org](https://tgupsd.org) (The Ground Up Project: San Diego)
with completely clean, hand-maintainable code underneath and **zero visual
changes** on the surface.

- `index.html` — semantic HTML generated from the mirrored Carrd source
  (`../tgupsd-mirror/index.raw.html`) by `/tmp/tgupsd_transform.py`. Text
  content copied verbatim; Carrd class names replaced with semantic ones.
- `styles.css` — organized stylesheet: design tokens, base, navbar, page
  sections, bands, type scale, buttons, image frames, partner gallery, forms,
  footer, scroll-reveal animations, responsive breakpoints.
- `script.js` — vanilla JS replacing the Carrd runtime: hash routing,
  IntersectionObserver scroll reveals, hero parallax, mobile nav toggle,
  forms, loading overlay.
- `assets/images/` — copied from the mirror, plus `logo.jpg` (previously
  hotlinked from i.ibb.co, now served locally; identical pixels).

## Behavior notes

- **Forms** (donate/volunteer): the original posted to Carrd's backend, which
  no longer exists. On submit the form validates, opens a prefilled email to
  `tgupsd@gmail.com`, and shows the original "Thank you! :)" confirmation.
- **Email address**: decoded from Cloudflare's email protection and written
  as a plain `mailto:` link.
- **Gallery thumbnails** link out to Instagram (as in the original); no
  lightbox.
- **Navbar** markup/CSS/JS kept functionally identical to the original
  custom navbar (including its quirks).

## Regenerating index.html

The transformer is idempotent-ish (it reads the mirror, not this folder):

```bash
python3 /tmp/tgupsd_transform.py
```

Then review the diff before publishing.

## Not pushed

Per instructions, this rebuild is left in the workspace for review and is
**not** pushed to GitHub.
