# Vikamusk Website - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser / User                        │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────────┐           ┌──────────────┐
   │   Next.js   │◄─────────►│  Sanity CMS  │
   │  Frontend   │           │  Headless    │
   │  SSG/ISR    │           │  Backend     │
   └─────┬───────┘           └──────────────┘
         │                          ▲
         │                          │ GROQ Queries
         │                          │
         ├──────────┐               │
         │          │               │
         ▼          ▼               │
    ┌────────┐  ┌────────┐         │
    │  Pages │  │  API   │─────────┘
    │ (SSG)  │  │ Routes │
    └────────┘  └────────┘
         │          │
         ▼          ▼
    ┌──────────────────────┐
    │  Vercel CDN / Edge   │
    │   (Production)       │
    └──────────────────────┘
```

## Data Flow - Product Display

```
User visits /products
        │
        ▼
Next.js page component
        │
        ├─ Fetch from Sanity (GROQ query)
        │         │
        │         ▼
        │    Sanity CMS
        │    (Cloud hosted)
        │         │
        │         ▼
        │    Return JSON
        │
        ├─ Render React components
        │    (Framer Motion animations)
        │
        ├─ Serve CSS
        │    (Tailwind)
        │
        └─ Send to browser
             │
             ▼
          Fully rendered page
```

## Data Flow - Contact Form

```
User submits form
        │
        ▼
Contact form validation
        │
        ├─ Validate email
        ├─ Check required fields
        │
        ▼
POST /api/contact
        │
        ▼
Server-side processing
        │
        ├─ Additional validation
        │
        ├─────────────────────────┐
        │                         │
        ▼                         ▼
Send email (Nodemailer)   Optional: Save to Sanity
        │                         │
        ├─ Admin notification     │
        ├─ Customer confirmation  │
        │                         │
        └─────────────┬───────────┘
                      │
                      ▼
              Return success response
                      │
                      ▼
          Update form UI (success message)
```

## Component Hierarchy

```
RootLayout
├── Header (Navigation)
│   ├── Logo
│   ├── Nav Links (Desktop)
│   └── Mobile Menu
│
├── Main Content
│   ├── Home Page
│   │   ├── Hero
│   │   ├── StatsSection
│   │   │   └── NumberCounter (animated)
│   │   ├── CategoryShowcase
│   │   ├── FeaturedProducts
│   │   │   └── ProductCard (multiple)
│   │   └── CTA sections
│   │
│   ├── Products Page
│   │   ├── Hero
│   │   ├── Search Bar
│   │   ├── Category Filter
│   │   └── ProductCard Grid
│   │
│   ├── Product Detail Page
│   │   ├── Hero
│   │   ├── ProductDetailClient
│   │   │   ├── Image Gallery
│   │   │   ├── Product Info
│   │   │   ├── Specifications
│   │   │   └── Contact CTA
│   │   └── Breadcrumb
│   │
│   ├── About Page
│   │   ├── Hero
│   │   ├── Mission/Vision
│   │   ├── Values Cards
│   │   ├── Timeline
│   │   └── Team Section
│   │
│   └── Contact Page
│       ├── Hero
│       ├── Contact Methods
│       ├── ContactFormClient
│       │   ├── Form Inputs
│       │   ├── Validation
│       │   └── Status Messages
│       └── FAQ Section
│
├── Footer
│   ├── Links
│   ├── Contact Info
│   └── Social Media
│
└── ScrollToTop (floating button)
```

## File Structure - Detailed

```
vikamusk-website/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API
│   │
│   ├── about/
│   │   └── page.tsx              # About page
│   │
│   ├── contact/
│   │   └── page.tsx              # Contact page
│   │
│   ├── products/
│   │   ├── page.tsx              # Products listing
│   │   └── [slug]/
│   │       └── page.tsx          # Product detail
│   │
│   ├── layout.tsx                # Root layout + Header/Footer
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles & theme
│
├── components/
│   ├── header.tsx                # Navigation
│   ├── footer.tsx                # Footer
│   ├── hero.tsx                  # Hero section
│   ├── stats-section.tsx         # Stats counter
│   ├── featured-products.tsx     # Featured grid
│   ├── category-showcase.tsx     # Category cards
│   ├── product-card.tsx          # Product card
│   ├── product-detail-client.tsx # Product detail view
│   ├── contact-form-client.tsx   # Contact form
│   ├── scroll-to-top.tsx         # Floating button
│   ├── scroll-reveal.tsx         # Scroll animation
│   ├── number-counter.tsx        # Counter animation
│   └── page-transition.tsx       # Page transitions
│
├── lib/
│   ├── sanity.ts                 # Sanity client & fetch
│   ├── image-url.ts              # Image URL builder
│   ├── queries.ts                # GROQ queries
│   ├── email.ts                  # Email sending
│   └── utils.ts                  # Utilities
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── public/
│   ├── icon.svg
│   ├── icon-light-32x32.png
│   └── icon-dark-32x32.png
│
├── sanity/
│   ├── schemaTypes/
│   │   ├── category.ts           # Category schema
│   │   ├── product.ts            # Product schema
│   │   ├── enquiry.ts            # Enquiry schema
│   │   └── index.ts
│   └── sanity.config.ts          # Sanity config
│
├── .env.example                  # Example env vars
├── SETUP.md                      # Setup guide
├── DEPLOYMENT_CHECKLIST.md       # Launch checklist
├── PROJECT_SUMMARY.md            # Project overview
├── QUICK_START.md                # 5-min quickstart
├── ARCHITECTURE.md               # This file
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## Database Schema - Sanity

```
Categories Collection
├── _id: string
├── title: string
├── slug: slug
├── description: text
├── icon: image
├── image: image
└── order: number

Products Collection
├── _id: string
├── title: string
├── slug: slug
├── category: reference → Categories
├── series: string
├── description: text
├── fullDescription: richText
├── specifications: array
│   ├── label: string
│   └── value: string
├── images: array of images
├── thumbnail: image
├── featured: boolean
├── brochure: file
├── price: string
├── availability: enum
└── publishedAt: datetime

Enquiries Collection
├── _id: string
├── fullName: string
├── email: string
├── phone: string
├── company: string
├── productInterest: array → Products
├── message: text
├── country: string
├── submittedAt: datetime
└── responded: boolean
```

## API Endpoints

```
POST /api/contact
├── Request Body:
│   ├── fullName: string (required)
│   ├── email: string (required)
│   ├── phone?: string
│   ├── company?: string
│   ├── message: string (required)
│   └── country?: string
│
└── Response:
    ├── Success (200):
    │   └── { success: true, message: "..." }
    │
    └── Error (400/500):
        └── { error: "..." }
```

## Animation Pipeline

```
User interaction (scroll/hover/click)
        │
        ▼
Framer Motion detects event
        │
        ├─ useInView hook (scroll)
        ├─ whileHover variant
        └─ whileTap variant
        │
        ▼
Calculate animation
        │
        ├─ Duration
        ├─ Easing
        └─ Delay
        │
        ▼
GPU-accelerated transform
        │
        └─ Smooth 60fps animation
```

## Performance Optimization Flow

```
Build Time
    │
    ├─ Static Pages (SSG)
    │  └─ Cached forever
    │
    ├─ Dynamic Pages (ISR)
    │  └─ Revalidate every 60s
    │
    └─ Images
       └─ Optimized by Sanity CDN
        │
        ▼
   Runtime
        │
        ├─ Vercel Edge Caching
        │
        ├─ Incremental updates
        │
        └─ On-demand revalidation
```

## Security Layers

```
Client → Server
    │
    ├─ HTTPS (encrypted)
    │
    ├─ Environment variables
    │  └─ Never exposed to client
    │
    ├─ API validation
    │  ├─ Email validation
    │  ├─ Required fields check
    │  └─ Input sanitization
    │
    └─ Server-side processing
       ├─ No secrets in logs
       └─ Secure email delivery
```

## Deployment Pipeline

```
Developer commits code
        │
        ▼
GitHub push
        │
        ▼
Vercel detects change
        │
        ├─ Install dependencies
        ├─ Build Next.js app
        ├─ Run tests (optional)
        │
        ▼
Deploy to Edge Functions
        │
        ├─ Serve static files
        ├─ Edge routing
        ├─ API routes
        │
        └─ Global CDN caching
```

## Content Update Flow

```
Content Manager
        │
        ▼
Sanity CMS Studio
        │
        ├─ Create/Edit content
        ├─ Upload images
        └─ Publish
        │
        ▼
Sanity Backend
        │
        ├─ Store data
        ├─ Optimize images
        └─ Provide API
        │
        ▼
Next.js Application
        │
        ├─ ISR detects change
        ├─ Fetches new data
        ├─ Rebuilds page
        │
        └─ ✅ Updated on CDN
```

## Key Integrations

```
Vikamusk Website
    │
    ├─→ Sanity CMS
    │   └─ Product data, images
    │
    ├─→ Vercel
    │   └─ Hosting, CDN, deployment
    │
    ├─→ Email Service
    │   └─ Contact form emails
    │
    └─→ Google Fonts
        └─ Geist typography
```

## Performance Metrics Target

```
Metric                Target      Actual
─────────────────────────────────────────
First Contentful     < 1.2s
Largest Content      < 2.5s
Layout Shift         < 0.1
Time to Interactive  < 3.5s
Lighthouse Score     > 95
Mobile Score         > 90
```

---

**Architecture Version**: 1.0
**Last Updated**: 2024
**Designed for**: Scalability & Maintainability
