# IQCars — Project Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Project Structure](#4-project-structure)
5. [Pages](#5-pages)
6. [Components](#6-components)
   - [Layout](#61-layout-components)
   - [Cars](#62-car-components)
   - [Search & Filters](#63-search--filter-components)
7. [Data Layer](#7-data-layer)
8. [Internationalization](#8-internationalization)
9. [State Management](#9-state-management)
10. [Performance Patterns](#10-performance-patterns)
11. [Known Gaps & Notes](#11-known-gaps--notes)

---

## 1. Project Overview

IQCars is a Next.js (App Router) car listing platform built for the Iraqi market. It allows users to browse, search, and filter new and used car listings fetched from a Strapi v5 CMS backend. The interface supports three languages — English, Arabic, and Kurdish — with full RTL layout switching for Arabic and Kurdish.

The site is a single-page listing experience: all filtering is client-side on a preloaded dataset of up to 200 cars. There is no pagination from the server; instead, a "Load More" pattern reveals cards in batches of 12.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Rendering | Server Component for data fetch + Client Component for interactivity |
| Styling | Tailwind CSS v4 + CSS custom properties (design tokens) |
| Fonts | Syne (display/headings) + DM Sans (body) via Google Fonts |
| Images | `next/image` with `fill` + `sizes` for responsive optimization |
| CMS / API | Strapi v5 (`/api/cars?populate=*`) |
| Language | React 18 with hooks; no external state library |

---

## 3. Design System

All tokens are declared in `globals.css` as CSS custom properties on `:root` and consumed everywhere via `var(--token)`.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0d0d0d` | Page background |
| `--bg-card` | `#1a1a1a` | Cards, header, footer, modals |
| `--bg-subtle` | `#242424` | Hover states, tag backgrounds |
| `--border` | `#2e2e2e` | All dividers and borders |
| `--text` | `#f0f0f0` | Primary text |
| `--text-muted` | `#8a8888` | Labels, secondary text, placeholders |
| `--accent` | `#c0151a` | Crimson red — CTAs, active states, prices |
| `--accent-dark` | `#8b0000` | Darker accent (reserved) |
| `--green` | `#1a8a5a` | "Private Seller" badge |
| `--pink` | `#d4185e` | "Free Plate" badge |

### Typography

| Token | Value |
|---|---|
| `--font-display` | `'Syne', sans-serif` — headings, prices, logo area |
| `--font-body` | `'DM Sans', sans-serif` — all body text |

Base font size is 15px with a 1.6 line-height.

### Spacing & Shape

| Token | Value |
|---|---|
| `--radius` | `10px` |
| `--shadow-sm` | Subtle card lift |
| `--shadow-md` | Hover-state card elevation |
| `--shadow-lg` | Dropdowns and modals |
| `--transition` | `200ms cubic-bezier(.4, 0, .2, 1)` |

### Animations

All animations are GPU-accelerated (transform + opacity only):

| Class / Keyframe | Behavior |
|---|---|
| `animate-card` | Cards fade up on entrance, staggered by `index % 8 × 70ms` |
| `dropdown-menu` | Dropdowns scale in from top |
| `animate-slide-up` | Mobile search modal slides up from bottom |
| `skeleton` | Shimmer loading placeholder |
| `page-enter` | Fade in on route transitions |
| `::view-transition` | Blur-dissolve theme transition (View Transitions API) |

---

## 4. Project Structure

```
src/app/
├── globals.css              # Design tokens + global styles + animations
├── layout.jsx               # Root HTML shell, font preconnects, metadata
├── page.jsx                 # Home page — server component, fetches cars
├── loading.jsx              # Next.js loading UI (skeleton grid)
├── not-found.jsx            # Custom 404 page
├── HomeClient.jsx           # Main client component — all filter state lives here
├── Translations.js          # i18n strings for EN / AR / KU
│
└── Components/
    ├── layout/
    │   ├── Header.jsx       # Sticky header with logo + language picker
    │   ├── Footer.jsx       # Footer with contact info + social links
    │   └── Icons.jsx        # All shared SVG icons (named exports)
    │
    ├── cars/
    │   ├── CarCard.jsx      # Single listing card (image, title, price, tags)
    │   └── CarCardSkeleton.jsx  # Shimmer placeholder for CarCard
    │
    └── search/
        ├── searchConstants.js       # BRANDS, IRAQ_CITIES, MILEAGE_OPTIONS, PRICE_OPTIONS
        ├── FilterBar.jsx            # Desktop filter bar (hidden on mobile)
        ├── BrandStrip.jsx           # Row 1 of FilterBar: city + brand logo quick-picks
        ├── CityPicker.jsx           # City dropdown within BrandStrip
        ├── AllBrandsPanel.jsx       # Full brand search panel (modal overlay)
        ├── DesktopModelDropdown.jsx # Searchable model dropdown for desktop
        ├── DesktopYearDropdown.jsx  # Year From/To range picker for desktop
        ├── YearPicker.jsx           # Single From or To year picker (used in pairs)
        ├── SearchDropdown.jsx       # Generic dropdown — desktop + mobile variants
        ├── FilterBarActions.jsx     # Reset link + "Show N Cars" button
        ├── MobileSearchBar.jsx      # Sticky search trigger bar on mobile
        ├── FloatingSearchInput.jsx  # Animated floating-label text input
        └── SearchModal.jsx          # Mobile bottom-sheet search modal
```

---

## 5. Pages

### 5.1 Home Page (`/`)

**File:** `page.jsx` (server) + `HomeClient.jsx` (client)

The home page is split across two components following the Next.js App Router pattern:

`page.jsx` is a **server component** that:
- Fetches up to 200 cars from Strapi (`/api/cars?populate=*`, revalidated every 60s)
- Normalizes raw Strapi response into a flat `car` object via `formatCar()`
- Resolves image URLs (relative paths prefixed with `STRAPI_BASE`, absolute URLs passed through)
- Passes `initialCars` and `initialError` as props to `HomeClient`

`HomeClient.jsx` is a **client component** that:
- Holds all filter state (see §9 State Management)
- Applies client-side filtering via a `useMemo` over the full cars array
- Renders `Header`, `MobileSearchBar`, `SearchModal`, `FilterBar`, the car grid, and `Footer`
- Implements a "Load More" button revealing cards 12 at a time

**Layout:** Full-width page with a centered `max-w-6xl` content column, bordered on the sides.

**Car Grid:** `1 col → 2 col (sm) → 4 col (lg)`, gap-4.

---

### 5.2 Loading UI (`/loading.jsx`)

Shown by Next.js App Router while the page JS chunk loads. Renders:
- A skeleton header bar
- A skeleton filter bar
- 8 `CarCardSkeleton` elements in the same 4-column grid

Uses the `.skeleton` shimmer class — no JS, pure CSS animation.

---

### 5.3 404 Page (`/not-found.jsx`)

Custom 404 with:
- A crimson accent square showing "404"
- Heading + description text
- "Back to Home" link button in accent color

---

## 6. Components

### 6.1 Layout Components

#### `Header.jsx`
**Path:** `Components/layout/Header.jsx`

Sticky header (`top-0 z-50`) with scroll-shadow effect. Contains:
- **Logo** — `next/link` to `/`, renders `/logo.png`
- **Language Selector** — Globe icon + flag thumbnail + language code, opens a dropdown (`listbox` role) listing EN / AR / KU with flag images. Closes on outside click.

Memoized with `React.memo`. Note: the search button was deliberately removed from the header and relocated to `MobileSearchBar`.

**Props:** `lang`, `setLang`, `t`

---

#### `Footer.jsx`
**Path:** `Components/layout/Footer.jsx`

Three-column grid on desktop, stacked on mobile:
- **Brand column** — logo + tagline
- **Contact column** — phone (tel link), address (pin icon), email (mailto link); labels from `t` translations
- **Bottom bar** — copyright text (left) + social icon links (right): Facebook, Instagram, TikTok, X

Social links currently use `href="#"` placeholders.

Memoized with `React.memo`. **Props:** `t`

---

#### `Icons.jsx`
**Path:** `Components/layout/Icons.jsx`

Central registry of all shared SVG icons as named exports. Each icon accepts a `className` prop (default size provided). Icons:

`PinIcon`, `SearchIcon`, `PhoneIcon`, `MailIcon`, `GlobeIcon`, `MoonIcon`, `SunIcon`, `ChevronDownIcon` (rotates 180° when `open={true}`), `ChevronRightIcon`, `XIcon`

---

### 6.2 Car Components

#### `CarCard.jsx`
**Path:** `Components/cars/CarCard.jsx`

A `next/link` card linking to `/cars/:id`. Displays:
- **Image** — `next/image` with `fill`, `4/3` aspect ratio (CLS prevention), eager-loads first 4 cards
- **TypeBadge** — absolute-positioned badge: pink "Free Plate" or green "Private Seller" depending on `car.type`
- **Title** — localized make + model in Syne font
- **Price** — accent-colored, USD (`$`) or IQD with currency label
- **Spec tags** — year, odometer, transmission as small uppercase chips
- **Location** — pin icon + location string, separated by a top border

Entrance animation: `animate-card` with staggered delay (`index % 8 × 70ms`).

**Props:** `car`, `lang`, `index`, `t`

**Car object shape:**
```js
{
  id, make, makeAr, makeKu, model, year,
  odometer, price, priceFormatted, priceCurrency,
  image, transmission, fuelType, location, type, color
}
```

---

#### `CarCardSkeleton.jsx`
**Path:** `Components/cars/CarCardSkeleton.jsx`

Static shimmer skeleton matching the exact layout of `CarCard`: image placeholder (4/3), title bar, price bar, three tag bars, location bar. CSS-only (`.skeleton` class), no props.

---

### 6.3 Search & Filter Components

#### `searchConstants.js`
**Path:** `Components/search/searchConstants.js`

Single source of truth for all static filter data:

- **`BRANDS`** — array of `{ name, logo }` for 30 car brands; logos served from `/new/*.png`
- **`IRAQ_CITIES`** — 10 Iraqi cities
- **`MILEAGE_OPTIONS`** — 5 range strings (e.g. `"Under 10,000 km"`)
- **`PRICE_OPTIONS`** — 5 range strings (e.g. `"$5,000 – $15,000"`)

---

#### `FilterBar.jsx`
**Path:** `Components/search/FilterBar.jsx`

Desktop-only (`hidden md:block`). A two-row card:

**Row 1 — `BrandStrip`:** City picker + 8 brand logo quick-picks + "all brands" arrow

**Row 2 — 4 dropdowns + actions:**
| Slot | Component | Filter |
|---|---|---|
| 1 | `DesktopModelDropdown` | `model` |
| 2 | `DesktopYearDropdown` | `year` (range string) |
| 3 | `SearchDropdown` | `mileage` |
| 4 | `SearchDropdown` | `price` |
| 5 | `FilterBarActions` | Reset + Show button |

Slots are divided by `divide-x` borders. **Props:** `t`, all filter state pairs, `models`, `years`, `onReset`, `totalCount`

---

#### `BrandStrip.jsx`
**Path:** `Components/search/BrandStrip.jsx`

Top row of `FilterBar`. Contains:
- `CityPicker` pinned left
- 8 brand logo buttons (first 8 from `BRANDS`). Active brand gets a 2px accent border
- A `ChevronRight` button that opens `AllBrandsPanel`

**Props:** `make`, `setMake`, `city`, `setCity`

---

#### `CityPicker.jsx`
**Path:** `Components/search/CityPicker.jsx`

Compact dropdown showing "Iraq – [city]" or "Iraq – Select city". Opens a scrollable list of `IRAQ_CITIES`. Closes on outside click. **Props:** `city`, `setCity`

---

#### `AllBrandsPanel.jsx`
**Path:** `Components/search/AllBrandsPanel.jsx`

A centered fixed modal (`z-50`) with a dark backdrop. Contains:
- A `FloatingSearchInput` for filtering brands (auto-focused on open)
- A scrollable list of all 30 brands with logo + name + active dot
- Closes on Escape key or backdrop click

**Props:** `make`, `setMake`, `onClose`

---

#### `DesktopModelDropdown.jsx`
**Path:** `Components/search/DesktopModelDropdown.jsx`

FilterBar slot dropdown for car model. Has a `FloatingSearchInput` inside the panel to search through available models. Closes on outside click or Escape. **Props:** `value`, `onChange`, `options`

---

#### `DesktopYearDropdown.jsx`
**Path:** `Components/search/DesktopYearDropdown.jsx`

FilterBar slot dropdown for year range. Contains two `YearPicker` instances ("From Year" / "To Year") side by side. Emits a formatted string: `"2015 – 2022"`, `"From 2018"`, or `""`. Has a "Done" button to confirm. **Props:** `value`, `onChange`

---

#### `YearPicker.jsx`
**Path:** `Components/search/YearPicker.jsx`

Single From or To year selector. Renders a trigger with a floating border label and a scrollable year list (current year down to 1930). Selected year auto-scrolls into view when opened. **Props:** `label`, `value`, `onChange`, `yearList`, `onDone`

---

#### `SearchDropdown.jsx`
**Path:** `Components/search/SearchDropdown.jsx`

Generic reusable dropdown with two visual variants:
- **`desktop`** — stacked label above value, used in FilterBar slots
- **`mobile`** — single-line pill, used in SearchModal

Renders a clear option ("All") at the top of the list. Closes on outside click. **Props:** `label`, `value`, `onChange`, `options`, `placeholder`, `variant`

---

#### `FilterBarActions.jsx`
**Path:** `Components/search/FilterBarActions.jsx`

Right end of the FilterBar row. Contains:
- **Reset** link — only visible when `hasFilters` is true; calls `onReset`
- **"Show N Cars"** button — accent background, displays `totalCount` (decorative; filtering is reactive)

**Props:** `hasFilters`, `onReset`, `totalCount`

---

#### `MobileSearchBar.jsx`
**Path:** `Components/search/MobileSearchBar.jsx`

Visible only on mobile (`md:hidden`). A full-width tappable bar sitting between the header and car grid. Shows a search icon, placeholder text with car count, and a "Filters" badge. Tapping opens `SearchModal`. **Props:** `onSearchOpen`, `totalCount`

---

#### `FloatingSearchInput.jsx`
**Path:** `Components/search/FloatingSearchInput.jsx`

Animated floating-label text input. The label lifts above the border when the field is focused or has a value (CSS transition, no JS layout). Border color transitions to `--accent` on focus. Includes a search icon on the right. Used in `AllBrandsPanel` and `DesktopModelDropdown`. **Props:** `value`, `onChange`, `inputRef`, `label`

---

#### `SearchModal.jsx`
**Path:** `Components/search/SearchModal.jsx`

Mobile-only bottom-sheet modal (`md:hidden`). Slides up via `animate-slide-up`. Locks body scroll while open. Contains:
- City dropdown (full-width)
- Brand logo grid (4 columns, all 30 brands)
- Model + Year dropdowns (2-column grid)
- Min/Max Mileage dropdowns (2-column grid)
- Min/Max Price dropdowns (2-column grid)
- Transmission dropdown (full-width)
- Fuel Type dropdown (full-width)
- "Show N Cars" footer button that closes the modal

**Props:** `open`, `onClose`, all individual filter state pairs, `models`, `years`, `transmissions`, `fuelTypes`, `totalCount`, `t`

---

## 7. Data Layer

### Strapi Fetch (`page.jsx`)

```
GET {STRAPI_BASE}/api/cars?populate=*&pagination[pageSize]=200
```

Revalidated every 60 seconds via Next.js ISR (`next: { revalidate: 60 }`).

### `formatCar()` — Field Mapping

| Strapi field | App field | Notes |
|---|---|---|
| `documentId` / `id` | `id` | `documentId` preferred (Strapi v5) |
| `Brand` | `make` | |
| `BrandAr` | `makeAr` | Arabic make name |
| `BrandKu` | `makeKu` | Kurdish make name |
| `Name` | `model` | |
| `Year` | `year` | Coerced to string |
| `Kilometers` | `odometer` | Formatted with `toLocaleString()` + " km" |
| `Price` | `price` / `priceFormatted` | `Number()` parse + `toLocaleString()` |
| `Currency` | `priceCurrency` | Defaults to `"$"` |
| `Image.data[0]` | `image` | Prefers `formats.small.url`, falls back to `url` |
| `Transmission` | `transmission` | |
| `Fuel` / `FuelType` | `fuelType` | |
| `Location` | `location` | Defaults to `"Iraq"` |
| `Type` | `type` | `"freePlate"` or `"privateSeller"` |
| `Color` | `color` | |

---

## 8. Internationalization

Languages: **English (`en`)**, **Arabic (`ar`)**, **Kurdish (`ku`)**

- Language state lives in `HomeClient` and is set via the `Header` language picker
- On change, `document.documentElement.dir` is set to `"rtl"` for `ar`/`ku`, `"ltr"` for `en`
- `document.documentElement.lang` is updated to match
- All UI strings are accessed via `t = Translations[lang]`
- Car make names support localized variants: `makeAr`, `makeKu` (used in `CarCard`)
- The `Translations.js` file (not uploaded) provides all string keys

---

## 9. State Management

All filter state is co-located in `HomeClient`. There is no external state library.

### Filter State Variables

| Variable | Type | Used by |
|---|---|---|
| `searchTerm` | string | Desktop (unused in current FilterBar UI) |
| `make` | string | BrandStrip, AllBrandsPanel, SearchModal |
| `model` | string | DesktopModelDropdown, SearchModal |
| `year` | string | DesktopYearDropdown, SearchModal |
| `city` | string | CityPicker, SearchModal |
| `mileage` | string | Desktop SearchDropdown (not wired to filter logic) |
| `price` | string | Desktop SearchDropdown (not wired to filter logic) |
| `minPrice` | string | SearchModal → `filtered` memo |
| `maxPrice` | string | SearchModal → `filtered` memo |
| `minMileage` | string | SearchModal (not wired to filter logic) |
| `maxMileage` | string | SearchModal (not wired to filter logic) |
| `transmission` | string | SearchModal |
| `fuelType` | string | SearchModal |
| `page` | number | Pagination ("Load More") |
| `searchModalOpen` | boolean | SearchModal open/close |

### Filtering Logic (`filtered` useMemo)

Filters applied: `searchTerm` (make+model text match), `make`, `model`, `year`, `minPrice`, `maxPrice`, `transmission`, `fuelType`.

`page` resets to 1 whenever any filter changes.

---

## 10. Performance Patterns

| Pattern | Where | Detail |
|---|---|---|
| Server-side fetch | `page.jsx` | Data arrives with the HTML; no client waterfall |
| ISR (60s revalidate) | `page.jsx` | Stale-while-revalidate |
| `React.memo` | `Header`, `Footer` | Prevents re-render on parent state changes |
| `useMemo` | `HomeClient` | `makes`, `models`, `years`, `filtered`, `visible` all memoized |
| `useCallback` | `HomeClient` | `onReset` stable reference |
| GPU animations | `globals.css` | All keyframes use only `transform` + `opacity` |
| `will-change` | `.animate-card` | Applied sparingly, only on staggered cards |
| Eager image loading | `CarCard` | First 4 cards use `loading="eager"` |
| `next/image` sizing | `CarCard` | `sizes` prop avoids oversized image downloads |
| Aspect-ratio reserve | `CarCard`, `loading.jsx` | Prevents CLS on image load |
| CSS-only skeleton | `CarCardSkeleton` | No JS shimmer; `background-position` animation |
| Font preconnect | `layout.jsx` | `<link rel="preconnect">` for Google Fonts |
| `font-display: swap` | `globals.css` comment | Prevents FOIT on mobile |

---

## 11. Known Gaps & Notes

**Desktop mileage/price filters not connected to car filtering.** The `mileage` and `price` state variables used by the desktop `FilterBar` hold formatted range strings (e.g. `"$5,000 – $15,000"`). The `filtered` useMemo in `HomeClient` only checks `minPrice`/`maxPrice` (mobile modal state). Desktop mileage and price selections have no effect on the displayed results.

**`FilterBarActions` "Show Cars" button has no `onClick`.** Filtering is reactive (useMemo), so the button is cosmetic. It does not trigger anything.

**`searchTerm` state is declared but has no input field.** The `FloatingSearchInput` components inside dropdowns search their own local lists, not the global car list.

**`minMileage` / `maxMileage` not in filter logic.** These are collected by the mobile modal but the `filtered` memo does not read them.

**`CarCard` links to `/cars/:id`.** A car detail page (`/cars/[id]/page.jsx`) is not included in the uploaded files.

**Social links are placeholder `#` hrefs** in `Footer.jsx`.

**`BRANDS` list ordering** in `searchConstants.js` is not alphabetical and does not match the visual order in `BrandStrip` (first 8 shown).

**`Translations.js`** was not uploaded. String keys referenced throughout include: `t.noResults`, `t.loadMore`, `t.freePlate`, `t.privateSeller`, `t.information`, `t.phoneNumber`, `t.address`, `t.email`, `t.copyright`.


I want you to search for the latest versions of "next": "^16.2.6", 
"next-intl": "^4.12.0", 
"react": "19.2.4", 
"react-dom": "19.2.4"
In order to give better results



I want you to write me a comment  git add .

git commit -m ""

git push origin main