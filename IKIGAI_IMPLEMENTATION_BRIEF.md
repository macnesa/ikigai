# IKIGAI Landing Page — Implementation Brief

**Status:** DRAFT — implementation-ready for the landing-page shell and confirmed interactions; explicitly blocked items remain marked `UNVERIFIED` / `PENDING`  
**Version:** 0.3  
**Date:** 2026-08-25  
**Operating mode:** Client project task  
**Primary goal:** Implement the supplied IKIGAI landing page faithfully, mobile-first, with the smallest coherent technical solution and the fewest avoidable iterations.

---

## 1. Purpose of this document

This is the single living implementation document for the project.

It reconciles:

1. the Figma structural audit;
2. rendered desktop/mobile Figma screenshots;
3. the client/designer Loom instruction;
4. selected reference-intelligence audits;
5. Website Delivery OS rules relevant to this implementation.

It is **not** a redesign brief, reference moodboard, generic component-library specification, or replacement for the Figma source.

The implementation must preserve the approved design intent and only introduce behavior that is supported by client instruction, rendered evidence, or a narrowly justified implementation default.

---

## 2. Authority and evidence order

When sources disagree, use this order:

1. **Client instruction from Loom** — authoritative for requested behavior and priorities.
2. **Rendered Figma screenshots** — authoritative for visible composition and responsive endpoint appearance.
3. **Figma structural audit / metadata** — authoritative for inspected hierarchy, node dimensions, section structure, and text where the audit explicitly observed them.
4. **Verified greenfield repository state/assets** — authoritative after scaffold verification and after actual client/design assets are added.
5. **Reference audits** — secondary pattern intelligence only; never a source of client-specific values.
6. **Implementation judgment** — only where a decision is still needed and does not contradict stronger evidence.

### Evidence labels used here

- `LOCKED` — sufficiently supported to implement as the current requirement.
- `OBSERVATION` — directly seen/read/heard in the supplied evidence.
- `RECOMMENDATION` — implementation default chosen to control risk or complexity.
- `UNVERIFIED` — not safely established.
- `PENDING` — known decision or asset still expected from the client.

---

## 3. Source lineage

### Primary project evidence

- `FIGMA_IMPLEMENTATION_AUDIT.md`
- Figma duplicate:
  - URL: `https://www.figma.com/design/evrFWc2pN2t8fuH3BVcVc6/Ice-Bath-Page--Copy-?node-id=1378-115&p=f&t=2pfrvQW62KQ6UeXO-0`
- Main page frames:
  - Desktop: `1454:8749` — `Website Landing Page` — `1920 × 10055`
  - Mobile: `1454:9255` — `Phone Landing Page` — `390 × 9182`
- Figma screenshots supplied in multiple batches:
  - desktop and mobile hero/product/technical/process/projects/form/FAQ/final CTA/footer views
- Loom transcript supplied in chat, beginning:
  - mobile is the priority;
  - trusted logos should move like a slideshow;
  - product and projects sections should be swipeable;
  - sauna comparison should be swipeable;
  - technical details should expand on mobile;
  - ice-bath media should become a looping video;
  - process should remain as designed;
  - FAQ should expand;
  - hero motion is optional;
  - HD assets/video can be supplied;
  - form will be discussed further.

### Secondary reference evidence

Used only for transferable relationships and failure boundaries:

- The Damai
- Jords+Co
- MONOLOG
- Mikatalo
- Telha Clarke
- Hildén & Kaira
- Terminal Industries
- Sui

### OS sections actively applied

- `00_OPERATING_INDEX`
- `01_CORE_RULES_AND_DECISIONS`
- `02_REFERENCE_INTELLIGENCE`
- `05_VISUAL_LAYOUT_MEDIA_AND_INTERACTION`
- `07_DEVELOPMENT_WORKFLOW_AND_VERSIONING`
- `08_QA_ACCESSIBILITY_PERFORMANCE_SEO_ANALYTICS`
- `11_CLIENT_WORKSPACE_AND_TASK_PACKET_TEMPLATE`

No requirement exists to load or reproduce all OS files. Use only the smallest context needed for the current task.

---

## 4. Project-level decisions

### DEC-01 — Mobile-first acceptance

**Status:** `LOCKED`

The client explicitly prioritised mobile because most visitors are expected to open the site on mobile.

Implementation order and QA priority:

1. authored mobile composition at `390px`;
2. authored desktop composition at `1920px`;
3. robust transformation between those endpoints.

Do not build desktop to completion first and then mechanically collapse it.

Do not use proportional shrinking as the responsive strategy.

---

### DEC-02 — Preserve authored compositions

**Status:** `LOCKED`

Desktop and mobile are two intentionally authored endpoint compositions sharing content and behavior.

Implementation should reuse semantic data/components where useful, but breakpoint-specific layout composition is allowed and expected.

Avoid duplicating the whole page into separate desktop/mobile DOM trees unless a specific section genuinely cannot be maintained safely any other way.

---

### DEC-03 — Visual fidelity before decorative enhancement

**Status:** `LOCKED`

Baseline implementation target:

- hierarchy;
- spacing;
- crop;
- alignment;
- type scale relationships;
- light/dark section rhythm;
- slider geometry;
- real media;
- responsive transformation;
- interaction correctness.

Optional decoration must not delay these.

Approved motion system:
- `GSAP`
- `@gsap/react`

GSAP is a deliberate baseline dependency, but it must be used selectively. Its presence does not justify animating every section.

Do not introduce:
- WebGL;
- 3D;
- cinematic route transitions;
- scroll-jacking;
- Lenis;
- Framer Motion;
- a second animation system;
- complex parallax without a clear visual job;
- animated counters;
- ornamental canvas/noise systems.

Motion remains subordinate to Figma fidelity, mobile performance, and the client’s explicit behavior requirements.

---

### DEC-04 — Reference sources do not override the design

**Status:** `LOCKED`

References may contribute:

- interaction clarity;
- control discoverability;
- motion restraint;
- fallback logic;
- media-performance discipline;
- accessibility concerns;
- carousel/accordion failure modes.

Do not inherit from references:

- palette;
- font;
- exact spacing;
- section order;
- layout values;
- copy;
- brand treatment;
- motion timing;
- component styling;
- technical stack.

If a design decision can only be defended by “the reference did it,” reject it.

---

### DEC-05 — Greenfield technical baseline

**Status:** `LOCKED`

This is a **greenfield project**. No pre-existing repository or application architecture needs to be preserved at initialization.

#### Core stack

- **Framework:** Next.js with App Router
- **UI runtime:** React
- **Language:** JavaScript only
- **Styling:** Tailwind CSS, with scoped CSS where interaction mechanics are clearer outside utility classes
- **Linting:** ESLint from the Next.js scaffold

**Do not introduce TypeScript.** Source files should remain `.js` / `.jsx` unless a third-party package ships its own types internally.

#### Approved baseline dependencies

- `gsap`
- `@gsap/react`
- `embla-carousel-react`
- `lucide-react`
- `react-hook-form`

#### Dependency roles

- **GSAP + `@gsap/react`** — primary motion system; optional hero/reveal/parallax enhancement and any motion that genuinely needs sequencing or scroll control.
- **Embla Carousel** — the single carousel/slider library for Product and Projects.
- **Lucide React** — the single general-purpose UI icon library.
- **React Hook Form** — form state/field orchestration; it does **not** decide the eventual backend, provider, validation policy, or submission destination.
- **Native `<video>`** — ice-bath looping video.
- **Native `<dialog>`** — baseline image viewer/lightbox when the requirement is only open/fullscreen/close.
- **Custom lightweight component** — sauna before/after comparison.
- **Custom accessible disclosure** — sauna mobile details, ice-bath mobile details, and FAQ.

#### Conditional dependency

`PhotoSwipe` is **not** part of the baseline install.

Add it only if the approved image-viewer requirement expands to genuine gallery behavior such as:
- pinch zoom;
- pan;
- double-tap/double-click zoom;
- swipe between images;
- image-to-image keyboard navigation.

If native `<dialog>` satisfies the approved viewer behavior, do not add PhotoSwipe.

#### Explicit non-baseline packages

Do not add without a newly proven requirement:

- Framer Motion
- Swiper
- Lenis
- Radix UI
- shadcn/ui
- React Icons
- Font Awesome
- Zod
- React phone-number libraries
- toast libraries
- another carousel library
- another icon library
- another motion library

#### Icon rule

Use `lucide-react` for interface icons such as arrows, chevrons, plus/minus, close, and menu controls.

Official brand marks/social logos should use the supplied official SVG/image assets when available rather than approximating brand marks with Lucide.

#### Greenfield initialization

Recommended scaffold:

```bash
npx create-next-app@latest ikigai-landing --javascript --tailwind --eslint --app
cd ikigai-landing
npm install gsap @gsap/react embla-carousel-react lucide-react react-hook-form
```

Do not install additional dependencies during initialization.

---

## 5. Page map

Implementation order follows the authored landing page:

1. Hero / Navigation
2. Trusted-by moving logo strip
3. Existing & Custom Solutions / Product Slider
4. Sauna Build Quality / Comparison
5. Ice Bath Technical Quality / Looping Video
6. IKIGAI Process
7. Wellness Spaces / Projects Slider
8. Consultation / Lead Form
9. FAQ
10. Final Consultation CTA
11. Footer
12. Mobile final booking bar if the authored composition confirms it as an in-flow page element

Do not use isolated node `1909:484` as the page root. The audit observed that it is an isolated `Slider Web` reference frame, not the actual desktop/mobile landing-page tree.

---

# 6. Visual system

## 6.1 Overall visual character

### `OBSERVATION`

The screenshots establish a restrained wellness/architectural visual system:

- warm light/off-white reading surfaces;
- dark navy/charcoal high-intensity surfaces;
- photography-led sections;
- blueprint/technical media as product credibility;
- large light-weight display typography;
- small factual body/utility copy;
- thin rules/dividers;
- rounded dark CTA controls;
- large editorial whitespace;
- alternating light/dark section rhythm.

### `UNVERIFIED`

Exact values remain unverified unless the repository or authorized design source exposes them:

- font family;
- font files/licensing;
- exact font sizes;
- exact line heights/tracking;
- color hex/RGB values;
- border thickness;
- radius;
- shadows;
- exact spacing token scale.

### Implementation rule

Do not silently convert screenshot approximation into “final design tokens.”

During implementation:

1. verify supplied client/design fonts, brand assets, and any available source values first;
2. use verified project values when available;
3. if exact values are still unavailable, keep provisional values centralized and easy to tune;
4. visually reconcile them against the supplied 390/1920 screenshots;
5. request exact source values only where screenshot tuning cannot reliably resolve the mismatch.

---

## 6.2 Rhythm

Preserve the observed alternation rather than flattening every section into the same card system.

Approximate narrative rhythm:

`immersive hero → light product selection → dark sauna credibility → light technical ice-bath proof → dark process → light project proof → dark consultation → light FAQ → photographic CTA → dark footer`

The exact surface color values remain to be verified.

---

# 7. Responsive strategy

## 7.1 Primary endpoint widths

- Mobile visual target: `390px`
- Desktop visual target: `1920px`

These are design-authority endpoints, not hard-coded browser support limits.

Intermediate widths should be treated as engineering continuity checks, not invented designer-authored layouts.

Choose breakpoints from actual layout failure/content pressure, not a universal device list.

---

## 7.2 Transformation rules

Across sections, explicitly decide:

- what stacks;
- what changes order;
- what becomes swipeable;
- what becomes accordion content;
- what remains simultaneously visible;
- what changes crop;
- what loses optional motion;
- what requires touch-sized controls.

Do not infer a hamburger menu solely because it is conventional. The supplied mobile screenshot did not establish one.

---

# 8. Section implementation specifications

## 8.1 Hero / Navigation

### Evidence

`OBSERVATION / VISUAL`

Desktop:
- image-led/full-bleed hero;
- horizontal navigation;
- large headline;
- supporting consultation copy/CTA;
- proof/check items;
- trusted-by region.

Mobile:
- materially recomposed hierarchy;
- condensed headline/copy;
- proof items stack vertically;
- CTA becomes wider/more dominant;
- trusted-by content receives its own compact treatment.

### Behavior

- Hero animation is **not required** by the client.
- Client said animation/parallax is allowed if it improves the result.

### Implementation decision

**Baseline:** static hero matching Figma.

**Optional enhancement after fidelity QA:** restrained GSAP/CSS entry or micro-parallax only if:
- it does not alter layout;
- GSAP is sufficient without introducing another motion dependency;
- it remains smooth on mobile;
- reduced-motion users receive a static equivalent.

Do not make optional hero motion part of the critical path.

### Mobile nav

`UNVERIFIED`

Do not invent hamburger/menu behavior until repo or client evidence establishes it.

---

## 8.2 Trusted-by strip

### Client instruction

**Status:** `LOCKED`

Trusted logos should behave like a moving slideshow on desktop and mobile.

### Implementation behavior

Use a lightweight continuous horizontal marquee/rail:

- continuous movement;
- seamless visual loop if assets permit;
- slow enough for logo recognition;
- no arrows required;
- no autoplay pause interaction required unless the chosen implementation needs it;
- duplicate visual items only for seamless movement, not as duplicate semantic content.

### Accessibility / reduced motion

- meaningful logo names remain accessible;
- `prefers-reduced-motion` should remove continuous movement or present an equivalent static/scrollable logo row;
- do not depend on motion for trust comprehension.

### Reference boundary

The Damai/Jords references support visible browseability and restrained motion, but their styles and values are not transferable.

---

## 8.3 Existing & Custom Solutions / Product Slider

### Client instruction

**Status:** `LOCKED`

The section is a slider and should be swipeable, including mobile.

### Visual evidence

- extra-wide composition in metadata;
- desktop shows multiple cards;
- mobile gives one dominant card with adjacent/browse affordance;
- arrow/control treatment appears in the authored design.

### Required behavior

- touch swipe on mobile;
- pointer drag where practical on desktop;
- previous/next controls where shown/needed;
- deterministic snap to item;
- preserve Figma card geometry/crops;
- finite/manual browsing by default.

### Implementation default

`LOCKED`

Do **not** autoplay product cards unless the client later asks for it.

Use **Embla Carousel** as the single slider library for this section:
- `embla-carousel-react`;
- touch swipe;
- pointer drag;
- snap;
- previous/next controls;
- styling remains fully project-owned.

Do not add Swiper or a second carousel library.

### Accessibility

- controls are real buttons;
- controls have accessible names;
- hidden/offscreen slides must not create broken keyboard order;
- touch gesture must not be the only method of navigation.

---

## 8.4 Sauna Build Quality / Comparison

### Client instruction

**Status:** `LOCKED`

The “other sauna” vs “our sauna” media should be swipeable/comparable.

The mobile technical explanations should expand after tapping their labels.

Desktop does not need the same collapsed interaction; the text remains visible.

### Desktop composition

Preserve the Figma relationship:

`comparison media | 01–05 technical explanation`

### Mobile composition

Preserve:

`comparison media → compact numbered technical list → tap to reveal explanation`

### Comparison control

Implement as a lightweight before/after comparison:

- visible divider/handle matching Figma;
- touch drag;
- pointer drag;
- keyboard-operable equivalent;
- implement as a custom lightweight comparison control; do not add a dedicated before/after library unless the custom implementation proves insufficient.

### Annotated media

Do not reconstruct complex annotation/callout graphics from guessed coordinates if the client can supply the authored composite assets.

Prefer exact supplied/exported media where the annotations are part of the graphic.

### Mobile accordion behavior

Client confirms disclosure behavior but does not explicitly define single-open vs multi-open.

**Implementation default:** single-open, all closed initially, unless the authored state or later client instruction proves otherwise.

Reason:
- keeps the mobile technical section compact;
- makes current context unambiguous;
- matches the instruction that a tapped item reveals its text.

This default must remain easy to change.

---

## 8.5 Ice Bath Technical Quality

### Client instruction

**Status:** `LOCKED`

The primary media in this section should be a **looping video**. Client said the video will be supplied.

Mobile technical items use the same tap-to-expand concept as the previous section.

### Media behavior

When the real video arrives:

- autoplay;
- muted;
- loop;
- `playsInline`;
- no visible player chrome unless requested;
- object-fit/crop must match Figma composition;
- provide poster/still fallback;
- content surrounding the video remains readable without playback.

### Asset state

**Video file:** `PENDING`

Do not ship a screenshot pretending to be the final video.

A temporary poster may be used only as an implementation stand-in.

### Technical list behavior

Desktop:
- explanations visible as authored.

Mobile:
- tap/accordion disclosure.

Use the same reusable technical-list data model as sauna if it reduces duplication without forcing the two visual compositions to become identical.

---

## 8.6 IKIGAI Process

### Client instruction

**Status:** `LOCKED`

Client explicitly requested this section to remain as designed: “keep it as it is / plek ketiplek.”

### Desktop

Preserve the observed 3 × 2 process grid.

### Mobile

Preserve the observed six-step vertical sequence.

### Component strategy

A simple data-driven `ProcessStep` is appropriate:

- ordinal;
- title;
- body;
- media.

Desktop/mobile wrappers may differ.

### Prohibited changes

- no slider;
- no scroll-driven active-step system;
- no decorative process animation;
- no redesign into timeline;
- no rearrangement unless necessary to match the authored mobile frame.

---

## 8.7 Wellness Spaces / Projects

### Client instruction

**Status:** `LOCKED`

This section should be a slider on desktop and mobile.

Client also requested navigation buttons if they fit.

### Visual evidence

Desktop:
- seven tall/portrait project tiles in a wide composition.

Mobile:
- multiple project tiles visible within the horizontal browsing area.

### Required behavior

- touch swipe;
- pointer drag where practical;
- prev/next buttons;
- snap between meaningful card positions;
- preserve project image crops and logo/caption hierarchy.

### Slider implementation

Use **Embla Carousel** (`embla-carousel-react`), the same slider library used by Product.

### Default

Manual browsing, no autoplay.

Do not add Swiper, a second carousel system, or 3D/perspective reel effects.

### Reference transfer

Jords supports the principle that partial neighboring content/visible controls can make a carousel discoverable.

MONOLOG demonstrates that rich project-reel motion raises complexity and can fail; do not inherit that complexity here.

---

## 8.8 Consultation / Lead Form

### Current evidence

Desktop screenshot:
- two-column consultation/form composition.

Mobile screenshot:
- vertical consultation content followed by form.

The Figma screenshots show five interest options on both endpoints, but wording differs.

Desktop wording observed:
- Sauna
- Ice Bath
- Sauna + Ice Bath
- Complete Wellness Space
- Not Sure Yet

Mobile wording observed:
- Sauna
- Ice Bath
- Both
- Complete Space
- Not sure yet

### Client instruction

**Status:** `PENDING`

Client explicitly said the form would be discussed further, including where/how the continuation should work.

### Implementation boundary

Use **React Hook Form** for form state and field orchestration.

Allowed before clarification:
- section shell;
- visual field styling;
- semantic input markup for layout;
- responsive structure;
- centralized, replaceable options data;
- React Hook Form wiring that remains backend-agnostic.

Do not lock or implement without instruction:
- submission destination;
- CRM/email/WhatsApp provider;
- server action/API;
- requiredness;
- validation policy;
- consent logic;
- success/error flow;
- anti-spam solution;
- analytics event;
- canonical interest wording;
- final placement if client changes it.

### Critical rule

Do not make desktop and mobile send different semantic option sets merely because the drafts use different wording.

One canonical data model must eventually be confirmed.

---

## 8.9 FAQ

### Client instruction

**Status:** `LOCKED` for behavior

Questions should open when pressed, one by one.

### Behavior

Use an accessible accordion/disclosure component.

Implementation default:
- all closed initially;
- one open at a time;
- current item can be closed;
- smooth but short height/opacity transition;
- no animation dependency.

### Content conflict

**Status:** `PENDING`

Desktop and mobile screenshots contain different question sets.

Do not create separate desktop/mobile FAQ content.

Canonical questions/answers must be confirmed before final content lock.

The component may be built before that clarification using centralized replaceable data.

### Accessibility

- semantic button per question;
- `aria-expanded`;
- correct controlled-region relationship;
- visible focus;
- keyboard operation;
- answer remains accessible without animation.

MONOLOG is useful only as a reference for disclosure clarity, not for copying its row inversion, palette, timing, layout, or portrait treatment.

---

## 8.10 Final Consultation CTA

### Visual requirement

Preserve the authored responsive transformation:

Desktop:
- large image-backed CTA;
- large headline;
- action positioned separately within the wide composition.

Mobile:
- headline/action recomposed vertically;
- mobile crop differs.

### Implementation

- use exact final project photograph once supplied/located;
- overlay only as needed to match Figma;
- headline and CTA remain live HTML;
- no decorative scroll effect required.

---

## 8.11 Footer

### Desktop

Preserve the observed information grouping and dark terminal surface.

### Mobile

Preserve the compact stacked/two-column grouping shown in Figma.

### Links

Actual destinations/social accounts remain subject to repository/client data.

Do not invent URLs.

---

## 8.12 Image viewer / lightbox

### Status

`LOCKED` baseline implementation choice; viewer usage itself should only be attached to media that is intended to open.

### Baseline

Use native `<dialog>` when the requirement is simply:

`open image → view larger/fullscreen → close`

Required:
- real close control;
- Escape closes;
- focus behavior remains sane;
- background does not become the only way to close;
- image remains appropriately sized on mobile and desktop.

### Escalation rule

Do not add an image-viewer library merely because images exist.

If the approved requirement later includes zoom/pan/pinch or gallery navigation, add **PhotoSwipe** and replace/extend the native viewer intentionally.

---

## 8.13 Mobile final booking bar

A white `Free wellness consultation / BOOK NOW` treatment is visible in the supplied mobile final composition.

### Status

- visual existence: `OBSERVATION`
- sticky/fixed behavior: `UNVERIFIED`

### Implementation default

Treat it as an in-flow final mobile CTA unless stronger evidence proves that it is sticky/fixed.

Do not create a persistent viewport obstruction based only on a screenshot.

---

# 9. Component boundaries

Use the greenfield conventions established by this brief and keep them minimal. The following are implementation candidates, not mandatory filenames.

```txt
LandingPage
├── Hero
│   └── TrustedMarquee
├── ProductShowcase
│   └── ProductSlider
├── SaunaQuality
│   ├── ComparisonSlider
│   └── ResponsiveTechnicalList
├── IceBathQuality
│   ├── LoopingVideo
│   └── ResponsiveTechnicalList
├── Process
│   └── ProcessStep
├── ProjectsShowcase
│   └── ProjectSlider
├── Consultation
│   └── ConsultationForm
├── FAQ
│   └── FAQItem
├── FinalCTA
├── ImageViewer [native <dialog>, only where used]
└── Footer
```

Reasonable primitives if the repo already uses this pattern:

- `Button`
- page/container wrapper
- small section label
- media wrapper

Do not create a generic all-purpose `Section` renderer or design system solely for this one page.

Page-specific compositions should remain page-specific.

---

# 9.1 Locked page composition and file-structure convention

**Status:** `LOCKED`

The homepage file should remain a thin orchestrator. Do not place the entire landing-page markup inside `app/page.js`.

Target composition:

```jsx
export default function Home() {
  return (
    <main id="main-content">
      <HomeMotion />
      <SiteHeader />

      <Hero />
      <TrustedBy />
      <ProductShowcase />
      <SaunaQuality />
      <IceBathQuality />
      <Process />
      <ProjectsShowcase />
      <Consultation />
      <FAQ />
      <FinalCTA />

      <SiteFooter />
    </main>
  );
}
```

The exact `className` values belong to implementation and should be derived from the verified visual system rather than copied from unrelated projects.

Preferred baseline structure:

```txt
components/
├── home/
│   ├── HomeMotion.jsx
│   ├── Hero.jsx
│   ├── TrustedBy.jsx
│   ├── ProductShowcase.jsx
│   ├── SaunaQuality.jsx
│   ├── IceBathQuality.jsx
│   ├── Process.jsx
│   ├── ProjectsShowcase.jsx
│   ├── Consultation.jsx
│   ├── FAQ.jsx
│   └── FinalCTA.jsx
├── layout/
│   ├── SiteHeader.jsx
│   └── SiteFooter.jsx
└── ui/
    ├── Button.jsx
    ├── Accordion.jsx
    ├── ComparisonSlider.jsx
    └── ImageViewer.jsx
```

Rules:

- `app/page.js` owns page order/composition only.
- Each major landing-page section owns its own layout and section-specific behavior.
- `components/ui/` is only for primitives genuinely reused across sections.
- `components/layout/` is for shared site shell pieces.
- `HomeMotion` may coordinate cross-section GSAP behavior, but section-local motion should stay with the section when that produces simpler ownership.
- Do not create a nested folder for every section preemptively.
- If a section becomes materially large, split only that section into a folder, e.g.:

```txt
components/home/product-showcase/
├── ProductShowcase.jsx
└── ProductCard.jsx
```

- Do not create empty `hooks/`, `utils/`, `features/`, `services/`, or design-system directories without a demonstrated need.
- Prefer one clear component responsibility over premature abstraction.

---

# 10. Asset requirements

## 10.1 Required production assets

Locate in repo or request from client:

1. Hero image/media.
2. Trusted-by logos.
3. Product/solution images.
4. Sauna comparison source images or final annotated composites.
5. IKIGAI mark used in comparison graphics if separate.
6. Ice-bath looping video.
7. Video poster/still.
8. Six process assets.
9. Project/gallery image set.
10. Project/client marks and captions if separate from the images.
11. Consultation/team image.
12. Final CTA photograph.
13. Footer/social icons/brand assets if not already in repo.
14. Font files or verified licensed webfont source if not already established.

### Client statement

Client said the assets are available and HD versions can be supplied when needed.

That statement does not prove the files are already present in the repository.

---

## 10.2 Media rules

- Use real supplied assets early; crop affects layout.
- Do not replace project/product media with generic stock.
- Preserve intended object-fit/focal relationships.
- Prefer exact exported composites for spatially authored annotation graphics.
- Optimize images/video without materially changing visible crop or quality.
- Below-fold media should not all block initial page rendering.

---

# 11. Reference-intelligence transfer

References are secondary. The following relationships are allowed; source-specific expression is prohibited.

| Reference | Transferable relationship | Do not inherit |
|---|---|---|
| The Damai | Photography stays dominant; carousel controls can remain clear and restrained; micro-motion should remain subordinate to layout | hospitality palette, serif/sans pairing, loader, exact parallax, exact geometry |
| Jords+Co | Carousel browseability benefits from visible state/controls and neighboring-card cues | pale UI system, rounded card language, studio copy, exact carousel styling |
| MONOLOG | Accordion state should be obvious; media must remain evidence; rich effects require fallback | WebGL dependency, heavy reel treatment, 3D perspective, oversized typography, exact FAQ styling |
| Mikatalo | Muted looping video can work as proof/atmosphere while text remains independently readable | sticky scroll systems, full-viewport video geometry, exact overlay/type |
| Telha Clarke | Architectural photography benefits from deliberate crop, pacing, and strong grid anchors | pinned long-scroll scenes, route transition choreography, collage system |
| Hildén & Kaira | Native output/proof is more valuable than decorative complexity; atmosphere can be removable | chrome objects, abrasive editorial identity, exact visual language |
| Terminal Industries | Rich motion is only justified when it explains a real transformation; media needs poster/failure resilience | wireframes, canvas scenes, lime/dark system, cinematic scroll |
| Sui | Core meaning must survive if canvas/motion fails; semantic content must not depend on visual effects | canvas density, blue/black tech world, stack metaphors, implementation complexity |

---

# 12. Prohibited assumptions and changes

Do not:

1. redesign any section because a reference looks better;
2. change copy without explicit instruction;
3. add/remove sections;
4. invent desktop/mobile content differences;
5. use node `1909:484` as the page root;
6. invent mobile navigation behavior;
7. assume a slider is autoplaying unless specified;
8. turn Product/Projects into static grids;
9. remove swipe behavior;
10. turn Process into a slider/timeline;
11. reconstruct annotated graphics by eye when exact assets are available;
12. connect the form to a backend before requirements exist;
13. invent FAQ answers;
14. invent social/contact URLs;
15. make the mobile booking bar fixed without evidence;
16. introduce Framer Motion, Swiper, WebGL, Lenis, a second motion system, a second carousel library, or another icon library without a newly proven requirement;
17. refactor unrelated repository code;
18. delete dormant files/assets during landing-page work;
19. overwrite user-owned uncommitted changes;
20. claim pixel-perfect/final before rendered evidence verifies it.

---

# 13. Greenfield repository initialization packet

## Task type

`CREATE / VERIFY BASELINE`

## Goal

Create the smallest clean repository that matches the locked technical baseline before feature implementation begins.

## Locked scaffold

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- ESLint
- GSAP + `@gsap/react`
- Embla Carousel
- Lucide React
- React Hook Form

## Initialization

```bash
npx create-next-app@latest ikigai-landing --javascript --tailwind --eslint --app
cd ikigai-landing
npm install gsap @gsap/react embla-carousel-react lucide-react react-hook-form
```

Do not add TypeScript or optional libraries during scaffold creation.

## Initial structure

Keep it small:

```txt
ikigai-landing/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
├── public/
│   ├── images/
│   ├── video/
│   ├── logos/
│   └── icons/
├── data/
├── IKIGAI_IMPLEMENTATION_BRIEF.md
├── package.json
└── ...
```

Do not pre-create empty architecture such as `features/`, `services/`, `hooks/`, `utils/`, `types/`, or a design-system package without a real use.

## Baseline verification before feature work

Confirm:

1. App runs.
2. Production build passes.
3. ESLint baseline passes.
4. Source scaffold is JavaScript, not TypeScript.
5. Tailwind is active.
6. Locked dependencies are installed exactly once.
7. No accidental second carousel/motion/icon library exists.
8. `IKIGAI_IMPLEMENTATION_BRIEF.md` is present in the repository.
9. Initial Git status is understood before implementation starts.
10. Any manually added assets are catalogued before being used.

## Dependency policy after initialization

A new dependency requires a concrete missing capability.

Preferred order:

1. browser/native primitive;
2. custom lightweight project component;
3. already locked library;
4. new library only when the previous options create disproportionate risk or complexity.

`PhotoSwipe` follows its specific conditional rule in DEC-05.

## Expected baseline output

Before implementing Cluster A, report only:

```txt
Scaffold status
Installed dependencies
Relevant paths
Available assets
Missing assets
Build/lint status
Any baseline conflict
```

Do not redesign or start unrelated infrastructure during initialization.

---

# 14. Implementation sequence after scaffold verification

Sequence by dependency and risk.

## Cluster A — foundation and first visual proof

1. Verified client/design fonts/tokens when available, otherwise provisional centralized foundations.
2. Page shell / section wrappers.
3. Hero/navigation.
4. Trusted marquee.
5. Product slider.

**Render:** mobile 390 + desktop 1920.

Correct proven visual mismatch before continuing.

---

## Cluster B — technical credibility

6. Sauna comparison.
7. Sauna desktop technical list.
8. Sauna mobile accordion.
9. Ice-bath video surface with temporary poster if video still pending.
10. Ice-bath desktop technical list.
11. Ice-bath mobile accordion.

**Render:** mobile 390 + desktop 1920.

Correct proven mismatch before continuing.

---

## Cluster C — process and proof

12. IKIGAI Process.
13. Projects slider.

**Render:** mobile 390 + desktop 1920.

Correct proven mismatch before continuing.

---

## Cluster D — conversion and bottom page

14. Consultation visual shell.
15. Form UI only within confirmed scope.
16. FAQ component.
17. Final CTA.
18. Footer.
19. Mobile final booking bar as confirmed in-flow composition.

**Render:** mobile 390 + desktop 1920.

---

## Cluster E — unresolved finalization

Only after client clarification:

20. Canonical form wording/options.
21. Form submission/integration.
22. Form validation/success/error states.
23. Canonical FAQ content.
24. Real ice-bath video replacement if still pending.
25. Final real/HD asset replacement.

---

## Cluster F — optional polish

Only after fidelity and behavior pass:

26. Evaluate whether hero micro-motion adds enough value.
27. Add only the smallest approved enhancement.
28. Verify reduced-motion fallback.

Optional polish may be omitted without failing the baseline implementation.

---

# 15. Interaction specifications

## 15.1 Slider baseline

For Product and Projects:

- touch swipe;
- pointer drag if practical;
- prev/next buttons;
- snap;
- no autoplay by default;
- no infinite looping requirement unless later requested;
- visible disabled/end state if finite;
- no gesture-only access;
- controls must not obscure important media;
- behavior must remain stable during resize.

Trusted logos are separate: continuous marquee behavior, not the same interactive slider contract.

---

## 15.2 Comparison slider baseline

- draggable divider/handle;
- touch and pointer;
- keyboard-operable;
- handle remains visibly discoverable;
- both images occupy identical geometry;
- no layout shift while dragging;
- annotations/crops remain aligned;
- initial position should match Figma visual if visible; otherwise use a neutral midpoint.

---

## 15.3 Accordion baseline

For:
- sauna mobile technical list;
- ice-bath mobile technical list;
- FAQ.

Required:
- semantic button;
- expanded state exposed;
- keyboard operable;
- visible focus;
- content remains in DOM/accessible;
- short restrained transition;
- no dependency on animation to understand state.

Default:
- closed initially;
- single-open behavior.

This default may be changed if later evidence contradicts it.

---

# 16. Performance and resilience rules

The page is media-heavy enough that performance must be controlled, especially because mobile is the client priority.

## Required

- optimize hero image/media;
- do not preload every below-fold image;
- lazy-load below-fold imagery where appropriate;
- use responsive image sizing;
- provide video poster;
- avoid blocking first paint on ice-bath video;
- avoid multiple unnecessary simultaneous autoplay video sources;
- ensure trusted marquee does not trigger expensive layout on every frame;
- avoid WebGL/canvas;
- use the locked GSAP stack selectively; do not introduce a second motion library;
- use Embla for Product/Projects only; do not introduce a second carousel library;
- maintain usable static content when motion/media fails.

Terminal, Sui, MONOLOG, and Telha reference audits all show the general risk of rich media/motion becoming a resilience burden. Those failures are warnings, not implementation templates.

---

# 17. Accessibility/input requirements

Baseline engineering target: support a robust public landing-page experience; do not claim formal conformance without dedicated evidence.

At minimum verify:

- semantic landmarks/headings;
- meaningful image alt behavior;
- decorative marks hidden appropriately;
- CTA/link keyboard access;
- visible focus;
- slider buttons keyboard access;
- comparison control keyboard access;
- accordion state semantics;
- touch target usability;
- logical mobile reading order;
- form labels if form UI is present;
- reduced-motion handling for continuous marquee/optional motion;
- video does not become the only source of information;
- no horizontal page overflow outside intended rails;
- zoom/reflow does not hide critical actions.

---

# 18. Visual QA method

Rendered evidence is the primary basis for visual iteration.

For each implementation cluster:

1. render the real page;
2. capture the authored target widths;
3. compare against Figma screenshot evidence;
4. identify the single highest-confidence mismatch;
5. patch the smallest coherent cause;
6. re-render;
7. repeat.

Do not “improve” unrelated areas while fixing one mismatch.

### Primary visual targets

- `390px` mobile
- `1920px` desktop

### Intermediate continuity

Test additional widths where the actual layout begins to fail or where breakpoints change. These are robustness checks, not new design authority.

---

# 19. Acceptance checklist

## 19.1 Source and scope

- [ ] Main implementation is based on desktop frame `1454:8749` and mobile frame `1454:9255`.
- [ ] `1909:484` is not treated as the page root.
- [ ] No reference site has overridden IKIGAI design decisions.
- [ ] No unrequested section/copy/feature has been added.

## 19.2 Mobile priority

- [ ] 390px composition is visually reconciled section by section.
- [ ] No mechanical desktop shrink is used as the mobile strategy.
- [ ] Touch interactions work for all swipe/disclosure controls.
- [ ] Text does not overflow or produce unintended horizontal page scrolling.
- [ ] Media crops preserve important content.

## 19.3 Hero / trust

- [ ] Hero hierarchy matches authored desktop/mobile evidence.
- [ ] Trusted logos move continuously on both endpoint layouts.
- [ ] Reduced-motion alternative exists for the moving logo strip.
- [ ] No invented mobile menu behavior.

## 19.4 Product slider

- [ ] Swipe works on touch.
- [ ] Control affordance is visible.
- [ ] Previous/next access exists where required.
- [ ] Snap/crop match the authored composition.
- [ ] No autoplay unless later approved.

## 19.5 Sauna

- [ ] Other Sauna / Our Sauna comparison is draggable/swipeable.
- [ ] Handle works with touch/pointer and keyboard equivalent.
- [ ] Desktop technical text is visible as authored.
- [ ] Mobile technical text expands through accordions.
- [ ] Exact annotated assets are used where available.

## 19.6 Ice bath

- [ ] Real client video replaces temporary stand-in before final.
- [ ] Video loops, is muted, and plays inline.
- [ ] Poster/fallback exists.
- [ ] Desktop technical content remains visible.
- [ ] Mobile technical content expands.
- [ ] Page meaning remains available without video playback.

## 19.7 Process

- [ ] Desktop remains 3 × 2 as authored.
- [ ] Mobile remains six-step vertical.
- [ ] No redesign/slider/timeline invention.

## 19.8 Projects

- [ ] Slider exists on desktop and mobile.
- [ ] Swipe/drag works.
- [ ] Prev/next buttons work.
- [ ] Project image crop/caption hierarchy matches Figma.
- [ ] No unnecessary autoplay/3D effect.

## 19.9 Consultation/form

- [ ] Visual section matches current approved composition.
- [ ] Canonical option wording is resolved before final.
- [ ] No viewport-specific semantic option set.
- [ ] Submission provider/recipient is explicitly approved before connection.
- [ ] Validation, consent, error, success, and delivery are verified after integration.

## 19.10 FAQ

- [ ] Accordion behavior works by pointer/touch/keyboard.
- [ ] Canonical question/answer set is confirmed.
- [ ] Desktop/mobile use the same semantic FAQ data unless explicitly instructed otherwise.
- [ ] State is exposed accessibly.

## 19.11 Final CTA/footer

- [ ] Desktop/mobile image crops match authored evidence.
- [ ] CTA remains live accessible HTML.
- [ ] Footer link groups match approved content.
- [ ] No invented social/contact links.
- [ ] Mobile final booking bar is not made sticky without evidence.

## 19.12 Performance/resilience

- [ ] No unnecessary WebGL/canvas.
- [ ] GSAP/@gsap-react and Embla are used only for their approved roles; no second motion/carousel system was introduced.
- [ ] Below-fold media loading is controlled.
- [ ] Video has poster/fallback.
- [ ] Continuous motion has a reduced-motion equivalent.
- [ ] Core page remains usable if optional motion fails.

## 19.13 Final visual QA

- [ ] Mobile 390 render compared with supplied Figma evidence.
- [ ] Desktop 1920 render compared with supplied Figma evidence.
- [ ] Intermediate transitions do not break hierarchy/content.
- [ ] Proven mismatches were fixed through scoped patches, not unrelated redesign.
- [ ] “Final” is not claimed without rendered verification.

---

# 20. Blocking / pending register

| Item | Status | Consequence |
|---|---|---|
| Ice-bath final looping video | `PENDING` | Can build container/poster; cannot finalize media |
| HD/source image package | `UNVERIFIED` | Add supplied assets to the greenfield repo; request only genuinely missing HD/source files |
| Exact fonts/tokens | `UNVERIFIED` | Verify from supplied design/client assets; provisional values must remain centralized and tunable |
| Form final placement/continuation | `PENDING` | Do not lock conversion architecture |
| Form provider/recipient/validation | `PENDING` | No backend integration yet |
| Canonical form interest labels | `PENDING` | One shared data set must be confirmed |
| Canonical FAQ questions/answers | `PENDING` | Component can be built; final data cannot be locked |
| Mobile navigation behavior | `UNVERIFIED` | Do not invent hamburger/menu |
| Mobile final booking bar fixed/sticky state | `UNVERIFIED` | Implement in-flow unless new evidence appears |
| Hero optional animation | `OPTIONAL` | Defer until baseline fidelity/QA passes |

---

# 21. Definition of current readiness

## Ready to implement now

- page shell;
- hero visual composition;
- trusted logo marquee;
- product slider;
- sauna comparison;
- sauna desktop/mobile technical behavior;
- ice-bath section shell and video-ready media surface;
- ice-bath desktop/mobile technical behavior;
- process;
- projects slider;
- consultation visual shell;
- FAQ component behavior;
- final CTA;
- footer;
- responsive endpoint implementation.

## Not ready to finalize

- real ice-bath video until supplied;
- final form behavior/integration;
- final canonical form option copy;
- final canonical FAQ content;
- any invented mobile navigation;
- sticky booking behavior;
- decorative hero motion.

---

# 22. Handoff rule

This document is the single living implementation brief.

After greenfield scaffold verification:

- update only sections affected by new verified project facts;
- do not create parallel planning markdown unless a genuinely separate deliverable is required;
- preserve unresolved items rather than silently resolving them;
- then execute implementation as bounded clusters and verify through rendered evidence.

