// src/app/components/searchConstants.js
// Single source of truth for all search/filter dropdown data.
// Imported by FilterBar (desktop) and SearchModal (mobile).

export const BRANDS = [
  { name: "Toyota",     logo: "https://www.carlogos.org/car-logos/toyota-logo-2019-3700x1200.png" },
  { name: "Mercedes",   logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo-2011-1920x1080.png" },
  { name: "Kia",        logo: "https://www.carlogos.org/car-logos/kia-logo-2021-download.png" },
  { name: "BYD",        logo: "https://www.carlogos.org/car-logos/byd-logo-2023-download.png" },
  { name: "BMW",        logo: "https://www.carlogos.org/car-logos/bmw-logo-2020-download.png" },
  { name: "Hyundai",    logo: "https://www.carlogos.org/car-logos/hyundai-logo-2011-download.png" },
  { name: "Nissan",     logo: "https://www.carlogos.org/car-logos/nissan-logo-2020-download.png" },
  { name: "Honda",      logo: "https://www.carlogos.org/car-logos/honda-logo-2000-full.png" },
  { name: "Volkswagen", logo: "https://www.carlogos.org/car-logos/volkswagen-logo-2019-download.png" },
  { name: "Tesla",      logo: "https://www.carlogos.org/car-logos/tesla-logo-2007-download.png" },
];

export const IRAQ_CITIES = [
  "Baghdad", "Erbil", "Sulaymaniyah", "Duhok", "Mosul",
  "Basra", "Kirkuk", "Najaf", "Karbala", "Nasiriyah",
];

export const MILEAGE_OPTIONS = [
  "Under 10,000 km",
  "10,000 – 50,000 km",
  "50,000 – 100,000 km",
  "100,000 – 150,000 km",
  "Over 150,000 km",
];

export const PRICE_OPTIONS = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000 – $60,000",
  "Over $60,000",
];