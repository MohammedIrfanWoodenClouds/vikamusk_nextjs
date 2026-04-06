// ============================================
// Vikamusk - Company Data & Seed Templates
// All products & categories are managed via Admin → MongoDB
// ============================================

/* ---------- Shared types ---------- */

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specs: Record<string, string>;
  image: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Location {
  id: string;
  country: string;
  city: string;
  address: string;
  isHeadOffice: boolean;
  mapUrl?: string;
}

/* ---------- Seed data (used ONLY for initial DB seeding) ---------- */

// Minimal category templates used by seedDatabase() in db.ts.
// Once seeded the admin panel is the single source of truth.
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Forklifts & Reach Trucks',
    slug: 'forklifts-reach-trucks',
    description:
      'Diesel & Electric Forklifts, Reach Trucks, VNA Forklifts and specialized attachments for efficient material handling.',
    icon: '🏗️',
    image: '/images/products/diesel-heavy-forklift.png',
    productCount: 0,
  },
  {
    id: 'cat-2',
    name: 'Aerial Work Platforms',
    slug: 'aerial-work-platforms',
    description:
      'Scissor Lifts, Boom Lifts, Telehandlers for safe and productive elevated work at height.',
    icon: '⬆️',
    image: '/images/products/electric-scissor-lift.png',
    productCount: 0,
  },
];

// Minimal product seeds — admin should manage the full catalog.
export const products: Product[] = [];

/* ---------- Locations (static company info) ---------- */

export const locations: Location[] = [
  {
    id: 'loc-1',
    country: 'UAE',
    city: 'Ajman',
    address:
      'PO Box 932, Ajman Free Zone, Sheikh Rashid Bin Saeed Al Maktoum St, Ajman, UAE',
    isHeadOffice: true,
    mapUrl:
      'https://www.google.com/maps/place/Vikamusk+Construction+Equipment+FZE/@25.419355,55.45035,860m',
  },
  {
    id: 'loc-2',
    country: 'India',
    city: 'Kochi',
    address:
      'PO 682031, Shanmugham Rd, Marine Drive, Kochi, Ernakulam, Kerala, India',
    isHeadOffice: false,
  },
];

/* ---------- Stats (company‑level metrics) ---------- */

export const stats = [
  { label: 'Customers', value: 300, suffix: '+' },
  { label: 'Equipment Sold', value: 350, suffix: '+' },
  { label: 'Sales Divisions', value: 20, suffix: '+' },
  { label: 'Service Divisions', value: 10, suffix: '+' },
  { label: 'Years Experience', value: 10, suffix: '+' },
  { label: 'Manufacturing Partners', value: 10, suffix: '+' },
];
