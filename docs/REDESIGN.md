# xiondigital.net: redesign audit & handoff

Built on the `redesign` branch, then published to `main`, which GitHub Pages serves at https://xiondigital.net.

---

## 1. What the repository actually is

| | |
| --- | --- |
| Stack | Plain static HTML, CSS and JavaScript. No framework, no build step, no package manager. |
| Hosting | GitHub Pages from the repository root, custom domain via `CNAME` → `xiondigital.net` |
| Entry point | `index.html` (a single page made of four panels) |
| Styling | `assets/css/main.css`, 2,412 lines: HTML5 UP "Astral" template plus a custom block from line ~2,196 |
| Scripts | jQuery 3, `browser.js`, `breakpoints.js`, `util.js`, `main.js` (panel switching only) |
| Deploy config | `CNAME`, `sitemap.xml`. No Actions workflow, no Jekyll config. |
| Live check | `https://xiondigital.net` served the same content as the repository on 2026-10-26 |

**Structure found**

- `#home`: name, "Rapper • Songwriter • Producer", hero photo `images/your-photo.jpg`
- `#bio`: full biography (Bio / The Sound / The Journey / The Vision), a 3-photo gallery
  (`pic01.png`, `pic02.png`, `pic03.png`), then the **Listener Reactions marquee**
- `#music`: discography grid (4 releases + Spotify and YouTube tiles), 3 Spotify track embeds
- `#contact`: email / Instagram / Linktree icons, "For Artists" note, Buttondown newsletter form
- Footer: © 2025, "Design: HTML5 UP"
- `KankaKombat/index.html`, a redirect stub to `/kankakombat/` (a separate game repository)

**Existing third-party code**

- Google Analytics `G-6QVTTYHY80`
- Umami `7b2603b8-fdc5-4aa5-99d2-6795e8ee00c8`
- Buttondown form (`embed-subscribe/xiondigital`, popup to `buttondown.com/xiondigital`)
- Spotify embeds, Google Fonts (Source Sans Pro), Font Awesome

**Unused assets found in `images/`** (left in place, not deleted): `pic04.jpg` through `pic12.jpg`,
`me.jpg` (a gradient, not a photo), and `5.png`, `6.png`, `7.png`, artwork for *Late Night*,
*Wait or All* and *Tempted* that the original page never referenced. They look like singles, but
nothing in the site states that, so they were **not** added as releases.

---

## 2. Preservation checklist

### A. Functionally unchanged (verified)

- Domain, `CNAME`, GitHub Pages deployment model, no build step introduced.
- **Releases**: *Dissonance* (2025), *Loose Thoughts Vol. 3* (2018), *Vol. 2* (2011), *Vol. 1* (2009), same titles, years, artwork, same newest-first order.
- **Listener Reactions marquee**: the same six comments, character for character, still inline
  HTML in the page; same `floatUpFade` keyframes, same 36s cycle, same 6s stagger across the six
  bubbles, same hover-to-pause, same responsive widths/heights. A scripted comparison of the
  blockquote text against `main` returned 6/6 exact matches. The only later edit is punctuation:
  the leading dash character was dropped from each of the six attributions on request, so they now
  open directly with the handle. Comments and handles are untouched.
- **Biography**: all four sections kept word for word, only split into headings and paragraphs.
  A scripted comparison confirmed every original paragraph appears verbatim.
- **Links** (unchanged destinations): Spotify artist `4YkGZAtMD5tFAq859q7Bit`, the three Spotify
  track embeds, YouTube channel `UCDEV4yZfB8lYsCBjGQJofVQ?sub_confirmation=1`, Instagram,
  Twitter, Linktree, `mailto:info@xiondigital.net`, Buttondown action/popup/referral.
- **Newsletter form**: same `action`, `method`, `target="popupwindow"`, `onsubmit` popup, required
  email field, "Powered by Buttondown" referral link.
- **SEO**: title, description, keywords, author, robots, canonical, Open Graph, Twitter card,
  JSON-LD `MusicGroup`, favicons, `CNAME`, Google Analytics and Umami tags all retained.
- `KankaKombat/index.html` untouched (old game links still redirect); it is not linked from the
  artist site.
- Old panel deep links (`#home`, `#bio`, `#music`, `#contact`) still resolve.

### B. Visually changed

- The Astral template is replaced entirely by a new stylesheet (`assets/css/xion.css`).
- Navigation: icon rail → sticky blurred top bar with Music / Visuals / About / Contact,
  plus a full-screen mobile sheet.
- Icons: the white-background PNG app icons (`Spotify.png`, `instagram.png`, `email.png`,
  `linktree.png`) are replaced by inline SVG so they read on a dark surface. Destinations are
  identical.
- The "Design: HTML5 UP" footer credit is gone because the template is no longer used.
- `user-scalable=no` removed from the viewport so mobile users can zoom.
- **Hero photograph**: the preview used the black-and-white studio portrait as its hero. That
  portrait is the one you asked for in the lower biography section, so the hero uses the other
  strong portrait (`your-photo.jpg`: black cap, black shirt, cuban link, black studio background)
  and blends its black background into the page. The black-and-white portrait anchors the
  biography; the fence photo is a full-width band; `pic01.png` is the captioned promo photo.
- **Photo captions**: the original gallery gave the three files the alt text "XiØN promo photo",
  "With the @Hodgetwins" and "Open Mic Performance". Those descriptions do not match the actual
  files (the black-and-white portrait is a solo studio shot, not a photo with the Hodgetwins), so
  the photographs are all kept with accurate alt text instead of repeating a mismatched caption.
- One factual fix: the original source comments labelled the second Spotify embed "On My Mind".
  Spotify's oEmbed returns **On My Mind**, **Text Love**, **Retrospect** for the three IDs, so the
  labels follow what the tracks actually are.

### C. New functionality

- `visuals.html`: dedicated page, six verified videos, click-to-play, no autoplay on load.
- Marquee **pause/play** control (keyboard accessible) plus a static list under
  `prefers-reduced-motion`, because the original hid every quote until its animation ran.
- Pointer spotlights, scroll reveal, scrollspy, restrained hero parallax, mobile menu with focus
  handling and Escape-to-close.
- Responsive image derivatives (`webp` + `jpg` at several widths) and self-hosted video thumbnails.
- Each *Loose Thoughts* cover is now a link to its own YouTube playlist, verified through oEmbed:
  Vol. 3 → `Real Love`, Vol. 2 → `Beautiful Lies`, Vol. 1 → `N.O.U. Gmix`. Whole card is one
  anchor with a descriptive `aria-label`.
- `tools/sync-visuals.mjs`: optional, dependency-free playlist refresh.
- `visuals.html` added to `sitemap.xml`.
- The XiØN X mark as a faint blue watermark behind the contact section (`images/x-mark.png`,
  tinted `#3f80ff`, 12 percent opacity, radial fade, clipped to the section). Decorative only:
  `aria-hidden`, `pointer-events: none`, hidden in print, and repositioned under 720px so it
  passes behind the link list rather than the newsletter card.

---

## 3. Design plan

**Palette**: taken directly from `xiondigital.net/arcade`: `#050607` page, `#0a0b0d` raised,
`#0c0e11` panels, `#101318` highlighted panels, `#ecedef` text, `#8b9099` muted, `#3f80ff` accent,
`#79a8ff` highlight. Blue only; no violet.

**Type**: Sora for display and body, Instrument Serif italic for emotional accents, JetBrains
Mono for labels and metadata. All from Google Fonts with `display=swap`.

**Composition**: asymmetric hero (wordmark left, portrait right, oversized Ø outline behind),
a full-width fan-comment band, a featured release with inline Spotify players, a three-up
discography row, a 2×2 visualizer wall that leads to the dedicated page, a long-form biography
beside a sticky black-and-white portrait, a full-bleed photograph band with a pull quote, then
contact and newsletter.

**Effects**: pointer-following blue spotlight on cards and the hero frame, borders that
illuminate on hover, restrained lift and image scale, two slow ambient glows, a masked grid at
the top of the page. No particles, no intro screen, no audio.

The scroll reveal animates the `translate` property rather than `transform`, so the `.is-in`
state cannot out-rank the hover and focus lift on the cards.

---

## 4. Files

| Path | Role |
| --- | --- |
| `index.html` | Rewritten home page |
| `visuals.html` | New dedicated visuals page |
| `assets/css/xion.css` | New design system (replaces `main.css` for these pages) |
| `assets/js/site.js` | Nav, scrollspy, spotlights, parallax, reveal, marquee pause, video player |
| `images/opt/*` | Optimised derivatives (jpg + webp at several widths) |
| `images/visuals/*` | Self-hosted thumbnails for the six videos (jpg + webp, 1280 and 640) |
| `images/x-mark.png` | XiØN X mark, tinted blue with transparency, used as the contact watermark |
| `tools/sync-visuals.mjs` | Optional playlist refresh tool (Node 18+, no dependencies) |
| `sitemap.xml` | Extended with `visuals.html` |
| `docs/REDESIGN.md` | This document |

Untouched: `CNAME`, `LICENSE.txt`, `README.md`, `KankaKombat/`, every original image, and the
old `assets/` files. `main.css`, `noscript.css`, jQuery and Font Awesome are now unreferenced;
they are kept so nothing breaks if you roll back, and can be deleted once you are happy.

---

## 5. Verification performed

- Served locally and inspected in Chromium at 390×844, 792×1365 and 1440×900:
  no horizontal overflow at any width; no unexpected overflowing elements.
- Every local image resolves and reports natural width > 0 (lazy ones after scroll).
- Navigation: sticky nav on desktop, hamburger sheet on mobile; it opens, locks scroll, moves focus
  to the first link, closes on Escape and returns focus to the toggle.
- Marquee: computed `animation-name: floatUpFade`, `36s`, `running`; pause button flips
  `animation-play-state` to `paused` and back, and updates `aria-pressed`.
- Video: clicking a card inserts an iframe with the correct `youtube-nocookie` URL, the real title
  as its accessible name, fullscreen allowed; the embed request returned HTTP 200 and the page did
  not navigate away.
- `node --check` on `site.js` and the sync tool.
- `tools/sync-visuals.mjs` dry run fetched all six videos and verified each through oEmbed; a
  `--write` run against a temporary copy regenerated the same six cards, same titles, same credits.
- Diffed the new page against `main` for marquee text, biography text and every external link:
  only the HTML5 UP credit is intentionally gone.

## 6. Not verified / left to you

- **Deployed.** The redesign is live on `main` and the Pages build for that commit reported
  `built`. It landed as new commits on top of the existing `main` history, with no force push, so
  every earlier commit is still there to roll back to.
- **Beacons** (`beacons.ai/xiondigital`) answered HTTP 403 to a server-side request, most likely
  bot protection. It is included, but it was not confirmed in a browser.
- **Safari, Firefox and iOS** were not available here; Chromium was the only engine tested.
- **YouTube playback** was verified as far as an embed can be automated. Some browsers/extensions
  block third-party embeds, but every card has a "Watch on YouTube" link as the fallback.
- The **`5.png` / `6.png` / `7.png`** artwork (*Late Night*, *Wait or All*, *Tempted*) is unused.
  Tell me whether those are official releases and I will add them with correct titles and years.
- **Analytics were deliberately not added to `visuals.html`.** If you want that page counted,
  paste the same two existing tags into its `<head>`.
- No `404.html` was created.
