# DESIGN_RULES.md
# Master UI/UX Constitution — Professional Grade
# Stack: React Native + Expo Router | Laravel + Livewire | React | Next.js
# Author discipline: Human-level, exception-grade UI

> This file is the law. Every screen, every component, every interaction must
> pass this checklist before it is considered done. AI agents must read and
> follow this before touching any UI file.

---

## 0. THE GOLDEN RULES (Never Break These)

```
1. One screen = one primary action. Never two competing CTAs.
2. Every state must exist: loading → empty → error → success.
3. Every number comes from the spacing scale. No magic numbers.
4. Every pressable element must give feedback. No silent taps.
5. Hierarchy first. If everything is bold, nothing is bold.
```

---

## 1. SPACING & LAYOUT SYSTEM

### The 8pt Grid
All spacing, padding, margin, gap — must be a multiple of 4.
No arbitrary values like 7, 11, 13, 22.

```
SPACING SCALE
─────────────────────────────
$space-1   →   4px   (micro gap, icon spacing)
$space-2   →   8px   (tight, inline elements)
$space-3   →  12px   (compact cards, small padding)
$space-4   →  16px   (standard screen horizontal padding)
$space-5   →  20px   (section gap, card inner)
$space-6   →  24px   (section header margin)
$space-8   →  32px   (large section spacing)
$space-10  →  40px   (hero padding)
$space-12  →  48px   (screen top padding)
$space-16  →  64px   (major section dividers)
```

### Screen Padding Rules (React Native)
```
Horizontal screen padding:  16px  (compact) | 20px (comfortable)
Top padding (below header):  16px
Bottom padding (above nav):  16px + bottom safe area inset
Card inner padding:          12px (compact) | 16px (default)
List item padding vertical:  12px
List item padding horizontal: 16px (matches screen)
Section gap between groups:  24px
```

### Web (React / Next.js / Laravel Blade)
```
Container max-width:         1200px (content) | 1440px (full bleed)
Page horizontal padding:     16px mobile | 24px tablet | 48px desktop
Section vertical spacing:    64px mobile | 96px desktop
Card padding:                20px mobile | 24px desktop
Gap in grid layouts:         16px mobile | 24px desktop
```

---

## 2. TYPOGRAPHY SYSTEM

### Scale (use ONLY these sizes)
```
MOBILE (React Native)
─────────────────────────────
$text-xs    →  11px  — legal, timestamps, tiny badges
$text-sm    →  13px  — captions, secondary hints
$text-base  →  15px  — body text (default)
$text-md    →  17px  — primary body, list items
$text-lg    →  20px  — card titles, section labels
$text-xl    →  24px  — screen titles
$text-2xl   →  28px  — hero numbers, big stats
$text-3xl   →  34px  — display, marketing splash

WEB
─────────────────────────────
$text-xs    →  12px
$text-sm    →  14px
$text-base  →  16px
$text-lg    →  18px
$text-xl    →  20px
$text-2xl   →  24px
$text-3xl   →  30px
$text-4xl   →  36px
$text-5xl   →  48px
```

### Weight Hierarchy
```
400 (Regular)   — body text, descriptions, secondary
500 (Medium)    — list labels, buttons, active nav
600 (SemiBold)  — card titles, section headers
700 (Bold)      — screen titles, hero text, key numbers
```

### Line Height
```
Tight (headings):  1.1–1.2
Normal (body):     1.4–1.5
Relaxed (long form): 1.6–1.7
```

### Rules
- MAX 3 font sizes visible on one screen at the same time
- Never use the same size AND weight for two different hierarchy levels
- Primary text: full opacity | Secondary: 60–70% opacity | Hint: 40% opacity
- Never use pure black (#000) for text — use #111827 or equivalent

---

## 3. COLOR SYSTEM

### Structure
```
Every project defines:

Primary      — main brand action color (buttons, links, active states)
Primary Dark — 15% darker, for pressed states
Secondary    — supporting brand color (rarely used)
Accent       — pop color, 1 per screen max, used for 1 thing only
Success      — #22C55E or brand equivalent
Warning      — #F59E0B or brand equivalent
Error        — #EF4444 or brand equivalent
Info         — #3B82F6 or brand equivalent
```

### Neutral Scale (always define these)
```
neutral-50   → near white background
neutral-100  → card background / subtle divider
neutral-200  → borders, dividers
neutral-400  → disabled text, placeholders
neutral-600  → secondary text
neutral-800  → primary text
neutral-900  → headings / near black
```

### Rules
- One accent color per screen. Never two competing accents.
- Destructive actions (delete, remove) → always Error red, never primary
- Disabled state → neutral-400, never primary at reduced opacity
- Background never pure white (#FFF) or pure black (#000) — offset slightly
- Dark mode is not an afterthought. Define both palettes upfront.

### Gradients
```
Use gradients for:
- Hero / banner sections (directional, 135–145deg)
- Overlay on images (bottom fade: transparent → rgba(0,0,0,0.7))
- FAB or special action button
- Empty state illustration background

Never use gradient on:
- Body text
- Standard form inputs
- Navigation items
```

---

## 4. COMPONENT RULES

### Buttons
```
Hierarchy (use only these, never invent new ones):
  Primary    — filled, brand color, main CTA (1 per screen)
  Secondary  — outlined or subtle fill, supporting action
  Ghost      — text only, lowest emphasis
  Destructive— red filled or red outlined (delete, remove, exit)
  Icon-only  — with tooltip always

Sizes:
  sm  → height 32px, text 13px, px 12px
  md  → height 44px, text 15px, px 16px  ← default
  lg  → height 52px, text 17px, px 24px

States (ALL must be implemented):
  default → hover/focus → pressed (scale 0.97) → loading → disabled

Rules:
- Loading state replaces label with spinner, never removes button
- Disabled = opacity 0.4, never just grey text
- Never two Primary buttons on same screen
- FAB (Floating Action Button): bottom-right, 16px from edges + safe area
```

### Inputs / Form Fields
```
Anatomy: Label → Input → Helper text / Error message

States:
  default → focused (brand border) → filled → error → disabled

Rules:
- Label always above input, never placeholder-only
- Placeholder is a hint, not the label. Don't use same text for both.
- Error message appears below input, in Error red, with ⚠ icon
- Success validation: show checkmark inline (right side of input)
- Character counter (if limit): bottom-right of input, subtle
- Required fields: asterisk * after label (never before)
- Group related fields in fieldsets with 24px gap between groups
```

### Cards
```
Anatomy: Container → [Image?] → Content (title, body, meta) → [Action?]

Rules:
- Cards never have more than 1 primary action
- Tappable cards: entire card is pressable, not just a button inside
- Shadow levels:
    subtle  → for cards on white bg (elevation 1)
    medium  → for modals, dropdowns (elevation 3)
    strong  → for bottom sheets, overlays (elevation 8)
- Never nest a card inside a card
- Card border-radius consistent across whole app (12px or 16px, pick one)
```

### Lists
```
- List items: 44px minimum height (touch target)
- Separator: 1px, neutral-200, starts after icon/avatar (not full bleed)
- If list can be empty: show empty state (see Empty States section)
- Swipe actions: max 2 (e.g. delete + archive), destructive is always red
- Section headers: uppercase, $text-xs, letter-spacing 0.08em, neutral-500
```

### Bottom Sheets
```
Use for:
- Secondary actions for an item (share, edit, delete options)
- Filters and sort panels
- Confirmations that aren't critical (use modal/dialog for critical)
- Quick forms (2–3 fields max)

Rules:
- Always has a handle bar at top (32x4px, neutral-300, rounded)
- Backdrop: rgba(0,0,0,0.4), tappable to dismiss
- Max height: 90% of screen
- Keyboard-aware: sheet rises with keyboard
- Destructive options in red, always at bottom of action list
- Never use bottom sheet for critical confirmations (use Alert/Dialog)
```

### Modals & Dialogs
```
Use for:
- Critical confirmations (delete account, cancel subscription)
- Blocking errors that need user decision
- Small focused forms that must complete before continuing

Rules:
- Max width: 320px (mobile) | 480px (web)
- Always has: title + description + 1–2 actions
- Primary action on right, cancel/dismiss on left
- Destructive dialog: primary action is red, cancel is ghost
- Never open a modal from inside a modal
- Backdrop always dismisses non-critical modals
```

### Navigation
```
MOBILE:
- Bottom tab bar: 4–5 items max, never 6+
- Active tab: primary color icon + label | Inactive: neutral-400
- Tab label: always visible (never icon-only on bottom nav)
- Stack header: back button left, title center, 1 action right max
- Large title (iOS-style): collapses on scroll, always implemented

WEB:
- Sidebar nav items: 44px height, 16px horizontal padding
- Active state: left border accent OR filled background (pick one)
- Breadcrumb: for 3+ level deep navigation
- Mobile web: hamburger → slide-in drawer, never horizontal scrolling nav
```

---

## 5. STATES (The Professional Difference)

Every data-driven component MUST handle all 5 states:

### Loading State
```
- Use skeleton loaders (not spinners) for content lists and cards
- Skeleton: neutral-200 background, shimmer animation, same shape as content
- Full-screen loading: centered spinner + optional "Loading..." text
- Button loading: replace text with spinner, keep button dimensions
- Inline loading (search, autocomplete): small spinner in input right side
```

### Empty State
```
Structure: Illustration/Emoji → Title → Description → CTA (optional)

Rules:
- NEVER show a blank screen. Ever.
- Use emoji as illustration for fast implementation (2–3em size)
- Title: direct and human ("No messages yet", not "Empty")
- Description: tell them what to do ("Send a message to get started")
- CTA: primary action that resolves the emptiness (optional but preferred)

Examples by context:
  Search no results: 🔍 "No results for '[query]'" → "Try different keywords"
  Empty feed:        ✨ "Nothing here yet" → "Follow people to see posts"
  Empty cart:        🛍️ "Your cart is empty" → [Browse Products] button
  No notifications:  🔔 "You're all caught up" → no CTA needed
  Error loading:     😕 "Something went wrong" → [Try Again] button
```

### Error State
```
- Inline error (field): red helper text + red border, icon prefix ⚠
- Toast/Snackbar error: red, auto-dismiss 4s, swipeable
- Full-page error: illustration + message + retry CTA
- Network error: distinguish "no internet" vs "server error"
- Never expose raw error codes or stack traces to users
```

### Success State
```
- Form submit: brief success message or navigate away (don't stay on form)
- Action success: green toast, auto-dismiss 3s
- Critical success (payment, account created): dedicated success screen
- Never just silently succeed — always confirm to the user
```

### Disabled State
```
- opacity: 0.4 on the entire element
- cursor: not-allowed (web)
- Never interactive when disabled (no hover, no press feedback)
- Always pair with a reason why if not obvious (tooltip or helper text)
```

---

## 6. FEEDBACK & INTERACTION

### Touch / Press Feedback (React Native)
```
- Use Pressable with:
    scale: 0.97 on press (spring animation)
    opacity: 0.8 as fallback
- Duration: 100ms press, 200ms release
- Never use TouchableOpacity for primary interactions (use Pressable)
- Never silent press — always visual response
```

### Hover States (Web)
```
- Interactive elements: cursor: pointer always
- Cards on hover: subtle translateY(-2px) + shadow increase
- Buttons on hover: 10% darker background
- Links on hover: underline or color shift
- Transition: all 150–200ms ease
```

### Haptics (React Native)
```
Use expo-haptics:
  Light impact  — button presses, selections
  Medium impact — confirmations, tab switches
  Heavy impact  — errors, destructive confirmations
  Success       — task completed, form submitted
  Warning       — soft warning, reminder
  Error         — failed action, invalid input
```

---

## 7. ANIMATION & MICRO-INTERACTIONS

### Timing Scale
```
$duration-instant  →  0ms    (no animation, immediate)
$duration-micro    → 100ms   (press feedback, opacity flicker)
$duration-fast     → 200ms   (hover states, small toggles)
$duration-normal   → 300ms   (standard transitions)
$duration-slow     → 400ms   (emphasis, modals entering)
$duration-lazy     → 600ms   (page transitions, hero reveals)
```

### Easing
```
ease-out    — elements entering the screen (decelerate)
ease-in     — elements leaving the screen (accelerate)
ease-in-out — elements moving within the screen
spring      — interactive feedback (button press, drag)
```

### Rules
```
- Animate WITH purpose. No animation for animation's sake.
- Enter animations: fade + translateY(8px) → 0 (subtle lift)
- Exit animations: fade out, 150ms (faster than enter)
- List stagger: 50ms delay per item, max 5 items staggered (then skip)
- Screen transitions: platform-native feel (slide on mobile, fade on web)
- Never animate layout shifts (no animating width/height, use opacity+scale)
- Loading shimmer: 1.5s linear infinite, always moving left to right
```

### What Must Be Animated
```
✅ Modal/sheet open & close
✅ Toast/snackbar enter & exit
✅ Tab switching (active indicator)
✅ Button press (scale)
✅ Success checkmark (draw animation)
✅ Accordion expand/collapse
✅ Page/screen transitions
✅ Skeleton shimmer
```

### What Must NOT Be Animated
```
❌ Error messages appearing (instant — urgency)
❌ Disabled state changes
❌ Pure data updates (numbers changing, text swapping)
❌ Form validation feedback (instant response needed)
```

---

## 8. ICONOGRAPHY

```
Rules:
- One icon library across the entire project. Never mix.
  Mobile:  @expo/vector-icons → Ionicons or Feather (pick one)
  Web:     lucide-react (preferred) OR heroicons (pick one)

- Consistent stroke width: 1.5 for Feather/Lucide (never mix 1.5 and 2)
- Icon sizes:
    xs  → 14px  (badges, inline with tiny text)
    sm  → 16px  (inline with body text, labels)
    md  → 20px  (default, list items, buttons)
    lg  → 24px  (tab bar, headers, prominent actions)
    xl  → 32px  (empty states, feature icons)
    2xl → 48px+ (illustrations, hero icons)

- Icon color matches its text context (same opacity rules)
- Never use icon without accessible label (screen readers)
- Filled vs Outlined: Filled = active/selected | Outlined = default
  (Be consistent — never random)
```

---

## 9. IMAGES & MEDIA

```
- Always define aspect ratios before images load (prevent layout shift)
- Placeholder: neutral-200 background while loading
- Failed image: neutral-100 background + broken-image icon centered
- Avatar fallback: initials on brand color background (never default grey)
- Hero images: always have a dark overlay if text sits on top
  (gradient: transparent top → rgba(0,0,0,0.6) bottom)

Image radius:
  Avatars:         9999px (circle)
  Thumbnails:      8px
  Card images:     top corners only, matches card radius
  Full-bleed hero: 0px
```

---

## 10. OVERLAYS & MODALITY

### Overlay Opacity Guide
```
Light overlay  → rgba(0,0,0,0.3)  — drawers, side panels
Standard       → rgba(0,0,0,0.4)  — bottom sheets, modals
Heavy          → rgba(0,0,0,0.6)  — critical dialogs, image viewers
Blur (web)     → backdrop-filter: blur(8px) + rgba(0,0,0,0.3)
```

### Z-Index Scale
```
$z-base       →   0   (normal content)
$z-sticky     →  10   (sticky headers, pinned elements)
$z-dropdown   →  20   (dropdowns, popovers)
$z-overlay    →  30   (backdrop overlays)
$z-modal      →  40   (modals, bottom sheets)
$z-toast      →  50   (toasts, snackbars — always on top)
$z-tooltip    →  60   (tooltips — always visible)
```

---

## 11. SEARCH

```
Search bar:
- Visible on screens where search is a primary action (not buried)
- Show clear (×) button as soon as user types
- Debounce: 300ms before triggering search

States:
  idle        → show recent searches OR popular suggestions
  typing      → show live suggestions / autocomplete (if available)
  searching   → skeleton results (not blank)
  results     → list with match highlights
  no results  → empty state: 🔍 "No results for '[query]'"
               + suggestion: "Try searching for [alternative]"
  error       → "Search unavailable" + retry

Rules:
- Highlight matched text in results (bold or brand color)
- Recent searches: max 5, each dismissible with ×
- Never show "0 results" with no guidance — always suggest next step
```

---

## 12. SCREEN ANATOMY TEMPLATES

### Standard List Screen (Mobile)
```
[Safe Area Top]
[Header: Title + optional right action]
[Search bar — if searchable]
[Filter chips — if filterable, horizontal scroll]
[Content: FlatList with proper keyExtractor]
  → Loading: skeleton rows
  → Empty: emoji + message + CTA
  → Error: message + retry
  → Data: list items with consistent padding
[FAB — if primary action exists]
[Bottom Tab Bar]
[Safe Area Bottom]
```

### Standard Detail Screen (Mobile)
```
[Safe Area Top]
[Back header + title + optional action (share, edit)]
[Hero image / media — optional, defined aspect ratio]
[Scrollable content area]
  → Primary info (title, key stat)
  → Secondary info (description, meta)
  → Related sections
[Sticky bottom action bar — primary CTA]
[Safe Area Bottom]
```

### Standard Form Screen (Mobile)
```
[Safe Area Top]
[Header: Back + "New [Thing]" or "Edit [Thing]"]
[ScrollView with keyboard-aware behavior]
  → Section 1: [Label, Input, Helper]
  → 24px gap
  → Section 2: [Label, Input, Helper]
[Submit button — full width, fixed bottom or scroll-end]
[Safe Area Bottom]
```

---

## 13. ACCESSIBILITY

```
Minimum touch target:   44 × 44px (Apple) | 48 × 48dp (Android)
Color contrast:         4.5:1 for body text | 3:1 for large text
Never convey info with color alone — always add icon or text
All images: accessibilityLabel prop (React Native) | alt attribute (web)
Form inputs: always associated label
Focusable elements: visible focus ring (web) — never remove outline without replacement
Dynamic text: support font scaling (React Native: don't hardcode lineHeight in px)
```

---

## 14. PERFORMANCE RULES (That Affect UX)

```
React Native:
- FlatList always (never ScrollView for long lists)
- keyExtractor: always stable unique id (never index)
- Images: expo-image (not Image) — caching + blurhash placeholder
- Heavy lists: windowSize, maxToRenderPerBatch tuned
- No inline function definitions in render (useCallback)

Web:
- Images: next/image or lazy loading always
- Fonts: preload, font-display: swap
- LCP element: no lazy load on above-the-fold hero image
- Avoid layout shift: define width + height on media before load
```

---

## 15. THE PRE-SHIP CHECKLIST

Before any screen or component is marked done, verify:

```
LAYOUT
[ ] All spacing from the scale (no magic numbers)
[ ] Safe area insets applied (mobile)
[ ] Horizontal padding consistent with screen standard
[ ] No content clipped or overflowing on small screens (375px min)

TYPOGRAPHY
[ ] Max 3 font sizes on screen
[ ] Hierarchy is clear (size + weight variation)
[ ] No placeholder text used as label

STATES
[ ] Loading state implemented (skeleton or spinner)
[ ] Empty state: emoji + message (+ CTA if useful)
[ ] Error state: message + retry option
[ ] Success state: confirmed to user

INTERACTION
[ ] Every pressable/clickable has visible feedback
[ ] Buttons have loading state
[ ] Forms have validation (inline error messages)
[ ] Disabled elements are visually distinct

ICONS
[ ] Consistent icon library used
[ ] Consistent stroke weight
[ ] Active = filled, Inactive = outlined (or opposite — but consistent)

ACCESSIBILITY
[ ] Touch targets ≥ 44px
[ ] Images have alt/accessibilityLabel
[ ] Color not the only indicator of state

ANIMATION
[ ] Modals / sheets animate in and out
[ ] No jarring instant layout shifts
[ ] Stagger on lists (if applicable)

POLISH
[ ] Dark mode tested (if supported)
[ ] No Lorem Ipsum in production
[ ] No hardcoded colors outside theme file
[ ] No console.log left in UI code
```

---

## 16. LANGUAGE & COPY RULES

```
- Titles: Title Case for screen names, Sentence case for body
- Buttons: Verb + Noun ("Save Changes", "Add Item", "Delete Account")
  Never just "OK" or "Yes" — always descriptive
- Error messages: human, not technical ("Check your internet connection"
  not "Network request failed with status 503")
- Empty states: encouraging, not cold ("Nothing here yet" not "No data")
- Confirmations: spell out what will happen ("This will permanently
  delete your account and all data. This cannot be undone.")
- Loading messages: optional but delightful ("Getting things ready...")
```

---

*This document is a living standard. Update it as new patterns are established.*
*Version: 1.0 | Stack: React Native (Expo Router) + React + Next.js + Laravel*
