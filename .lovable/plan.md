## Redesign Gift Reveal as Luxurious Handcrafted Greeting Card

Transform the existing gift reveal block (the panel that appears after "Click here 🎁") into a sophisticated physical greeting card visual, matching the uploaded reference image. The "Click here" button stays exactly where it is — only the revealed card panel gets the makeover.

### Visual Design

The revealed card will look like a piece of cream-colored handmade paper with:

- **Cream paper background** with subtle paper-grain texture (CSS gradient + noise overlay using inline SVG data URI).
- **Rose-gold double border frame**: outer border with a dotted/beaded pattern in rose-gold (`#c9a48a` → `#d4a574`), inner thin solid border, with breathing room between them.
- **Pink satin ribbon bow** in the top-left corner (SVG, layered with highlights/shadows for a 3D satin look — loops, knot, two trailing tails).
- **Blind-embossed pattern** of small hearts and tiny key shapes tiled across the card background at very low opacity (~8%) using an inline SVG `background-image`, creating the debossed texture without color.
- **Center message** in `font-dancing` script, rose-gold gradient text (`bg-clip-text` with linear-gradient from `#b87a6a` to `#e8b8a8`), with a subtle text-shadow to mimic foil emboss. Reads: *"Some people just make the world better… you're one of them ✨"* (sparkle stays gold/yellow, not gradient-clipped).
- **Soft inner shadow** on the card edges to give it physical depth, plus an outer drop shadow so it feels like a real object lying on the page.

### Reveal Animation

Keep the existing `animate-reveal` entrance, but enhance:
- Card scales/rotates in with a slight 3D tilt (already in `reveal` keyframe).
- Bow does a small bounce-in 200ms after card appears.
- A few sparkle emojis (✨💖) puff out from around the card edges using existing `animate-confetti-pop`.

### Files Modified

**`src/pages/Index.tsx`** (lines 327–335 only)
- Replace the simple glass panel with the new greeting-card markup: outer wrapper with cream background + rose-gold double border + embossed-pattern background-image, inline SVG ribbon-bow positioned `absolute -top-2 -left-2`, centered script message with rose-gold gradient text, and a small set of sparkle emojis bursting around it on reveal.

**`src/index.css`**
- Add `.card-paper` utility: cream background, paper-grain noise via inline SVG data URI, soft inset shadow.
- Add `.text-rose-gold` utility: `bg-clip-text text-transparent` with rose-gold linear gradient + soft text-shadow.
- Add `@keyframes bow-bounce` and `.animate-bow-bounce` (scale 0 → 1.15 → 1, ~0.5s, delayed 0.2s).
- Add a small `@keyframes` for a gentle paper-float idle (very subtle Y translate ±3px, 6s loop) applied to the revealed card.

### Out of Scope
- No changes to floating emojis, header, photo flip, message cards, or the "Click here" button itself.
- No new image assets — the card, bow, and embossed pattern are all pure CSS + inline SVG so they stay crisp at any size.
