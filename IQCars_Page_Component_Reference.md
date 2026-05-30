# IQCars — Page-by-Page Component Reference

Each section below maps a single route/page to its component tree,
showing exactly which components render, how they relate to each other,
and what props flow between them.

---

## Page: `/` — Home

```
page.jsx  (Server Component)
│
│  fetches: GET /api/cars?populate=*&pagination[pageSize]=200
│  normalizes: formatCar() → Car[]
│  passes: initialCars, initialError
│
└── HomeClient.jsx  (Client Component — owns ALL filter + pagination state)
    │
    ├── Header.jsx
    │     props: lang, setLang, t
    │     └── [Language Dropdown]  (inline, no sub-component)
    │           LANGS: EN / AR / KU with flag images
    │
    ├── MobileSearchBar.jsx          [mobile only: hidden md:block]
    │     props: onSearchOpen, totalCount
    │
    ├── SearchModal.jsx              [mobile only: md:hidden, rendered only when open]
    │     props: open, onClose,
    │            make/setMake, model/setModel, year/setYear, city/setCity,
    │            minPrice/setMinPrice, maxPrice/setMaxPrice,
    │            minMileage/setMinMileage, maxMileage/setMaxMileage,
    │            transmission/setTransmission, fuelType/setFuelType,
    │            models, years, transmissions, fuelTypes,
    │            totalCount, t
    │     │
    │     ├── SearchDropdown  ×7  (City, Model, Year, MinMileage, MaxMileage,
    │     │                        MinPrice, MaxPrice)
    │     │     variant="mobile"
    │     │
    │     ├── SearchDropdown  ×2  (Transmission, FuelType)
    │     │     variant="mobile"
    │     │
    │     └── [Brand Logo Grid]  (inline — maps all BRANDS, no sub-component)
    │
    ├── <main>
    │   │
    │   ├── FilterBar.jsx            [desktop only: hidden md:block]
    │   │     props: t, make/setMake, model/setModel, year/setYear,
    │   │            city/setCity, mileage/setMileage, price/setPrice,
    │   │            models, years, onReset, totalCount
    │   │     │
    │   │     ├── BrandStrip.jsx
    │   │     │     props: make, setMake, city, setCity
    │   │     │     │
    │   │     │     ├── CityPicker.jsx
    │   │     │     │     props: city, setCity
    │   │     │     │     └── [City Dropdown List]  (IRAQ_CITIES)
    │   │     │     │
    │   │     │     ├── [Brand Logo Buttons ×8]  (first 8 of BRANDS, inline)
    │   │     │     │
    │   │     │     ├── [All Brands Button]  (ChevronRight arrow, inline)
    │   │     │     │
    │   │     │     └── AllBrandsPanel.jsx  (rendered when panelOpen=true)
    │   │     │           props: make, setMake, onClose
    │   │     │           └── FloatingSearchInput.jsx
    │   │     │                 props: value, onChange, inputRef, label="Search brand"
    │   │     │
    │   │     ├── DesktopModelDropdown.jsx
    │   │     │     props: value, onChange, options (models)
    │   │     │     └── FloatingSearchInput.jsx
    │   │     │           props: value, onChange, inputRef, label="Search model"
    │   │     │
    │   │     ├── DesktopYearDropdown.jsx
    │   │     │     props: value, onChange
    │   │     │     └── YearPicker.jsx  ×2  ("From Year" + "To Year")
    │   │     │           props: label, value, onChange, yearList
    │   │     │
    │   │     ├── SearchDropdown.jsx  ("Mileage")
    │   │     │     props: label="Mileage", value, onChange,
    │   │     │            options=MILEAGE_OPTIONS, variant="desktop"
    │   │     │
    │   │     ├── SearchDropdown.jsx  ("Price")
    │   │     │     props: label="Price", value, onChange,
    │   │     │            options=PRICE_OPTIONS, variant="desktop"
    │   │     │
    │   │     └── FilterBarActions.jsx
    │   │           props: hasFilters, onReset, totalCount
    │   │
    │   ├── [Error message]  (inline — shown only when initialError is set)
    │   │
    │   ├── [No results message]  (inline — shown when filtered.length === 0)
    │   │
    │   ├── [Car Grid]  (CSS grid: 1→2→4 cols)
    │   │     └── CarCard.jsx  ×N  (one per visible car)
    │   │           props: car, lang, index, t
    │   │           └── TypeBadge  (internal sub-component, not exported)
    │   │
    │   └── [Load More Button]  (inline — shown when hasMore=true)
    │
    └── Footer.jsx
          props: t
```

---

## Page: `/` — Loading State (`loading.jsx`)

Shown automatically by Next.js App Router while `page.jsx` is streaming.

```
loading.jsx  (no props, no sub-components)
│
├── [Header Skeleton]        div.skeleton, h-16
├── [FilterBar Skeleton]     div.skeleton, h-32
└── [Card Grid Skeleton]     grid, 1→2→4 cols
      └── [Card Skeleton ×8]
            ├── div.skeleton  (image area, 4/3 aspect)
            └── div.p-4
                  ├── div.skeleton  (title)
                  ├── div.skeleton  (price)
                  ├── [Tag skeletons ×3]
                  └── div.skeleton  (location)
```

Note: `CarCardSkeleton.jsx` exists as a named component with the same
skeleton structure but is not used by `loading.jsx` (it duplicates the
layout inline). `CarCardSkeleton` is imported by `HomeClient` but not
currently rendered anywhere in the uploaded code.

---

## Page: `/404` — Not Found (`not-found.jsx`)

```
not-found.jsx  (no props, no sub-components)
│
├── [404 accent badge]      div, accent background, "404" text
├── [Heading]               h1 — "Page Not Found"
├── [Description]           p — helper text
└── [Back to Home Link]     next/link → "/"
```

---

## Shared Component Inventory

Components used across more than one page or context:

| Component | Used in |
|---|---|
| `SearchDropdown` | `FilterBar` (desktop, ×2) + `SearchModal` (mobile, ×9) |
| `FloatingSearchInput` | `AllBrandsPanel` + `DesktopModelDropdown` |
| `YearPicker` | `DesktopYearDropdown` (×2: From + To) |
| `Icons.jsx` exports | `Header`, `Footer`, `FilterBar`, `BrandStrip`, `CityPicker`, `FilterBarActions`, `FloatingSearchInput`, `SearchDropdown`, `SearchModal`, `YearPicker` |

---

## Data Flow Summary

```
Strapi CMS
    │
    │  HTTP GET (server, ISR 60s)
    ▼
page.jsx  →  formatCar[]
    │
    │  props: initialCars[], initialError
    ▼
HomeClient.jsx
    │
    │  useMemo: filtered[]  (make, model, year, minPrice, maxPrice, transmission, fuelType)
    │  useMemo: visible[]   (filtered.slice(0, page × 12))
    │
    ├──▶  FilterBar  ←──── desktop filter state (make, model, year, city, mileage, price)
    ├──▶  SearchModal ◀─── mobile filter state  (same + minPrice, maxPrice, minMileage, maxMileage)
    └──▶  CarCard ×N  ◀─── visible[]
```

---

## Component–File Quick Reference

| File | Export | Type |
|---|---|---|
| `app/page.jsx` | `HomePage` (default) | Server Component |
| `app/HomeClient.jsx` | `HomeClient` (default) | Client Component |
| `app/layout.jsx` | `RootLayout` (default) | Server Component |
| `app/loading.jsx` | `Loading` (default) | Server Component |
| `app/not-found.jsx` | `NotFound` (default) | Server Component |
| `Components/layout/Header.jsx` | `Header` (default, memo) | Client Component |
| `Components/layout/Footer.jsx` | `Footer` (default, memo) | Client Component |
| `Components/layout/Icons.jsx` | Named exports ×10 | Shared SVGs |
| `Components/cars/CarCard.jsx` | `CarCard` (default) | Server Component |
| `Components/cars/CarCardSkeleton.jsx` | `CarCardSkeleton` (default) | Server Component |
| `Components/search/searchConstants.js` | Named exports ×4 | Static data |
| `Components/search/FilterBar.jsx` | `FilterBar` (default) | Client Component |
| `Components/search/BrandStrip.jsx` | `BrandStrip` (default) | Client Component |
| `Components/search/CityPicker.jsx` | `CityPicker` (default) | Client Component |
| `Components/search/AllBrandsPanel.jsx` | `AllBrandsPanel` (default) | Client Component |
| `Components/search/DesktopModelDropdown.jsx` | `DesktopModelDropdown` (default) | Client Component |
| `Components/search/DesktopYearDropdown.jsx` | `DesktopYearDropdown` (default) | Client Component |
| `Components/search/YearPicker.jsx` | `YearPicker` (default) | Client Component |
| `Components/search/SearchDropdown.jsx` | `SearchDropdown` (default) | Client Component |
| `Components/search/FilterBarActions.jsx` | `FilterBarActions` (default) | Client Component |
| `Components/search/MobileSearchBar.jsx` | `MobileSearchBar` (default) | Client Component |
| `Components/search/FloatingSearchInput.jsx` | `FloatingSearchInput` (default) | Client Component |
| `Components/search/SearchModal.jsx` | `SearchModal` (default) | Client Component |
