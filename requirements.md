# Vikamusk Website Rebuild - Requirements & Technical Blueprint

## 1. Core Objective
Transition the existing WordPress website ([vikamusk.com](https://vikamusk.com/)) to a modern, high-performance Next.js platform. The goal is to evolve from a simple showcase into a **Product + Brand + Lead Generation Platform** that reflects Vikamusk's global presence as an engineering and equipment solutions provider.

### Key Metrics
- **Legacy:** WordPress-based, limited interactivity.
- **Future:** Next.js (App Router), Framer Motion animations, structured CMS, localized for UAE/India/China.
- **Product Depth:** 6 categories, 35+ series, 100+ models.

---

## 2. Technical Stack
| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15+ (App Router) | SEO, Performance, Server Components. |
| **Styling** | Tailwind CSS v4 | Rapid UI development, modern utility-first approach. |
| **Animations** | Framer Motion | Smooth, premium micro-interactions. |
| **CMS** | Sanity CMS (Recommended) | Real-time preview, flexible schema for products. |
| **Deployment** | Vercel | Optimized Next.js hosting and global CDN. |
| **Database** | PostgreSQL/Supabase (if needed) | Structured data for enquiries and complex relationships. |

---

## 3. Website Architecture (Page Map)
1.  **Home:** High-impact hero, product categories, and brand story.
2.  **About Us:** History, vision, and global footprint.
3.  **Products (Listing):** Structured grid with filters.
4.  **Product Detail (Dynamic):** Specialized specs, features, and brochures.
5.  **Services / Support:** Maintenance and technical excellence.
6.  **Industries / Applications:** Construction, Logistics, Maintenance.
7.  **Careers:** Modern recruitment portal.
8.  **Contact:** Lead capture with product-specific enquiries.
9.  **Global Presence:** Interactive map for UAE, India, and China offices.
10. **Downloads:** Accessible library for PDF brochures.

---

## 4. Product System & Data Model
The website must treat products as dynamic data entities rather than static pages.

### Product Hierarchy (as per brochure)
1.  **Material Handling:** Diesel/Electric Forklifts, Reach Trucks.
2.  **Aerial Platforms:** Scissor Lifts, Boom Lifts, Order Pickers.
3.  **Construction Equipment:** Excavators, Mixers, Lighting Towers.
4.  **Airport Equipment:** Tow/Baggage Tractors.
5.  **Cleaning Equipment:** Floor Scrubbers, Sweepers.
6.  **Attachments:** Clamps, Pallet Trucks.

### Product Schema
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "category": "reference",
  "images": ["url"],
  "specs": {
    "capacity": "string",
    "liftingHeight": "string",
    "engineType": "string",
    "battery": "string"
  },
  "features": ["string"],
  "brochure_url": "url",
  "featured": "boolean"
}
```

---

## 5. UI/UX Design System
### Aesthetics & References
- **Analysis:** Inspired by [LTMG](https://www.ltmg.com/), [SANY](https://www.sanyglobal.com/), and [Komatsu](https://www.komatsu.com/).
- **Vibe:** Industrial, Bold, Professional, and High-Tech.
- **Palette:**
    - **Primary:** Deep Industrial Blue (#001f3f) / Solid Black (#000000).
    - **Accent:** Vibrant Construction Yellow/Orange (#ffa500).
    - **Surface:** Clean Whites (#FFFFFF) and Light Greys (#f3f4f6).
- **Typography:** Bold Sans-serif (e.g., Inter, Montserrat, or Poppins).

### Layout Blueprint (Hero Section)
- **Visual:** Full-width high-definition equipment video or 3D parallax imagery.
- **Headline:** "A World of Creativity & Engineering Excellence."
- **CTA:** "Explore Products" | "Contact Sales."

---

## 6. Animation Strategy (Framer Motion)
Animations should feel premium and deliberate, not distracting.

| Trigger | Animation Type | Implementation |
| :--- | :--- | :--- |
| **Page Load** | Staggered Fade Up | Nav links, Hero text elements. |
| **Scroll Reveal** | Slide & Fade | Product cards, feature sections as they enter viewport. |
| **Numbers** | Counter Animation | Stats (300+ Customers, 10+ Divisions). |
| **Hover** | Scale & Glow | Product category cards, primary buttons. |
| **Product Detail** | Tab/Image Transitions | Smooth layout shifts when switching specs or gallery images. |

---

## 7. Development Roadmap & Architecture
### Folder Structure
```bash
/app
  /(site)              # Main website routes
    /products/[slug]   # Dynamic product pages
    /about
    /contact
  /components
    /ui                # Atomic components (Buttons, Inputs)
    /sections          # Reusable page sections (Hero, Stats)
    /product           # Product-specific components
/lib                   # CMS clients and utility functions
/types                 # TypeScript interfaces
```

### CMS Strategy (Sanity)
- **Product Document:** Field for name, category, specs object, and image gallery.
- **Global Config:** Editable header/footer details and contact info.
- **Leads:** Enquiries submitted via the website should be stored in the CMS or forwarded to CRM/Email.

---

## 8. SEO & Performance Requirements
- **Core Web Vitals:** Target "Good" scores (>90) for LCP, FID, and CLS.
- **Structured Data:** Use JSON-LD `Product` and `Organization` schemas for rich search results.
- **Dynamic Meta:** Unique titles and descriptions for every product and category.
- **Image Optimization:** Use Next.js `<Image />` for automatic WebP conversion and lazy loading.

---

## 9. Future Updates & Risks
### Risks
- **Content Mismatch:** Discrepancies between current site content and brochure specs must be resolved by the client.
- **Asset Quality:** High-res transparent PNGs for all products are required for the new design.
- **Service definitions:** Maintenance and "Vikamusk Design Studio" services need clearer definitions for the new pages.

### Future Expansion
- **E-commerce Ready:** The architecture should allow for pricing and "Request Quote" logic in the future.
- **Multi-language:** Scalable for Arabic and Chinese localized versions.
