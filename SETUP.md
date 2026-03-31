# Vikamusk Website - Setup Guide

This is a modern, professional construction equipment website built with Next.js 16, Sanity CMS, and Framer Motion animations.

## Quick Start

### 1. Environment Variables Setup

Copy `.env.example` to `.env.local` and fill in your configuration:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

#### Sanity CMS
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Usually "production"
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (2024-01-01 recommended)

#### Email Configuration (Nodemailer)
- `EMAIL_HOST` - SMTP server (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (e.g., 587)
- `EMAIL_SECURE` - Use SSL (true/false)
- `EMAIL_USER` - Email address for sending
- `EMAIL_PASSWORD` - Email password or app password
- `EMAIL_FROM` - Sender email address
- `ADMIN_EMAIL` - Where to send enquiries

### 2. Sanity CMS Setup

#### Option A: Create New Sanity Project

```bash
npx sanity@latest init
```

Select these options:
- Create new project
- Choose dataset name: "production"
- Select "Blog" template or blank template

#### Option B: Use Existing Project

Update `.env.local` with your existing Sanity project credentials.

### 3. Deploy Sanity Studio

```bash
npx sanity deploy
```

This will deploy your content management interface at `{project-id}.sanity.build`

### 4. Add Sample Data

Login to your Sanity Studio and create:

1. **Categories** - Add the 6 default categories:
   - Forklifts
   - Excavators
   - Loaders
   - Dumpers
   - Rollers
   - Telehandlers

2. **Products** - Add sample products with:
   - Title, Model, Description
   - Images (thumbnail and gallery)
   - Specifications
   - Category reference
   - Mark some as "Featured"

3. **Enquiries** - Will be auto-created when customers submit contact form

### 5. Email Configuration

#### Gmail Setup (Recommended)
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password as `EMAIL_PASSWORD`

#### Other Email Services
- SendGrid, AWS SES, Office 365, etc. - configure SMTP settings accordingly

### 6. Install Dependencies & Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Project Structure

```
/app
  /api/contact          - Contact form API endpoint
  /about               - About page
  /contact             - Contact page
  /products            - Product listing page
  /products/[slug]     - Product detail page
  layout.tsx           - Root layout with Header/Footer
  page.tsx             - Home page
  globals.css          - Global styles & design tokens

/components
  header.tsx           - Navigation header
  footer.tsx           - Footer with links
  hero.tsx             - Hero section component
  stats-section.tsx    - Statistics counter section
  featured-products.tsx - Featured products carousel
  category-showcase.tsx - Category grid
  product-card.tsx     - Individual product card
  product-detail-client.tsx - Product detail page
  contact-form-client.tsx   - Contact form
  scroll-to-top.tsx    - Floating scroll button
  scroll-reveal.tsx    - Scroll animation wrapper
  number-counter.tsx   - Animated number counter
  page-transition.tsx  - Page transition animation

/lib
  sanity.ts            - Sanity CMS client
  image-url.ts         - Image URL builder
  queries.ts           - GROQ queries
  email.ts             - Email sending utility
  utils.ts             - Utility functions

/sanity
  /schemaTypes
    category.ts        - Category document schema
    product.ts         - Product document schema
    enquiry.ts         - Enquiry document schema

/types
  index.ts             - TypeScript interfaces

/public
  - Static assets
```

## Key Features

### 1. Product Management
- Sanity CMS dashboard for easy content management
- Rich product descriptions with images
- Specifications, pricing, and availability status
- PDF brochure uploads
- Featured product rotation

### 2. Advanced Animations
- Framer Motion for smooth transitions
- Scroll-triggered animations
- Animated number counters
- Hero section with animated background
- Smooth page transitions
- Hover effects and interactions

### 3. Professional Design
- Navy blue brand colors (#001F3F primary)
- Gold accent color (#FFB800)
- Responsive mobile-first design
- Semantic HTML with ARIA labels
- Accessibility-focused components

### 4. Performance
- Static generation with ISR
- Image optimization
- Component code splitting
- Efficient Sanity queries

### 5. SEO
- Dynamic metadata generation
- Open Graph tags
- Structured data ready
- Sitemap generation

## Content Management

### Add New Product

1. Login to Sanity Studio
2. Create new "Product" document
3. Fill in:
   - Title (e.g., "VK-2000 Excavator")
   - Model/Series
   - Category (required)
   - Description
   - Full description (blocks)
   - Specifications (array of label/value pairs)
   - Images (thumbnail + gallery)
   - PDF brochure
   - Price
   - Availability status
4. Click "Publish"
5. Website updates automatically

### Add Category

1. Login to Sanity Studio
2. Create new "Category" document
3. Add title, slug, description, icon, image
4. Set display order
5. Publish

### View Enquiries

All contact form submissions appear in:
- Sanity Studio (Enquiries collection)
- Admin email inbox
- Customer receives confirmation email

## Customization

### Colors

Edit `/app/globals.css` CSS variables:

```css
:root {
  --primary: 217 32% 17%;      /* Navy blue */
  --accent: 30 100% 50%;       /* Gold */
  --background: 0 0% 100%;     /* White */
  /* ... other colors ... */
}
```

### Typography

Fonts are defined in `layout.tsx` using Google Fonts:
- Geist (sans-serif) - headings and body
- Geist Mono (monospace) - code

### Navigation

Edit menu items in `/components/header.tsx` `navLinks` array.

### Stats Numbers

Update `/app/page.tsx` stats array with your actual data.

## Deployment

### Deploy to Vercel

```bash
# Using Vercel CLI
vercel

# Or push to GitHub and connect to Vercel dashboard
```

### Set Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### Deploy Sanity Studio

```bash
npx sanity deploy
```

## API Routes

### Contact Form

**POST** `/api/contact`

Handles contact form submissions:
- Sends email to admin
- Sends confirmation to customer
- Optionally saves to Sanity

Request body:
```json
{
  "fullName": "John Smith",
  "email": "john@example.com",
  "phone": "555-1234",
  "company": "Acme Corp",
  "message": "Interested in excavators...",
  "country": "USA"
}
```

## Troubleshooting

### Sanity Connection Issues
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Verify project exists in Sanity dashboard
- Check API token if using private dataset

### Images Not Loading
- Ensure images are uploaded to Sanity
- Check Sanity image CDN access
- Verify image URL builder configuration

### Email Not Sending
- Check email credentials in `.env.local`
- Test SMTP connection separately
- Enable "Less secure apps" for Gmail (if applicable)
- Check admin email address is valid

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check TypeScript errors: `pnpm tsc`

## Performance Optimization

1. **Images**: Use Sanity's image CDN with transformations
2. **Caching**: ISR revalidation set to 60 seconds
3. **Code splitting**: Automatic with Next.js
4. **Animations**: GPU-accelerated with Framer Motion
5. **Fonts**: Preloaded in layout

## Security

- Sensitive emails configured via environment variables
- No API keys in client code
- CORS protection on API routes
- Sanitized HTML input handling
- Row-level security available in Sanity (if using)

## Next Steps

1. ✅ Setup environment variables
2. ✅ Create Sanity project
3. ✅ Add sample products and categories
4. ✅ Configure email service
5. ✅ Test contact form
6. ✅ Deploy to Vercel
7. ✅ Configure custom domain
8. ✅ Monitor analytics

## Support

For issues or questions:
- Sanity docs: https://www.sanity.io/docs
- Next.js docs: https://nextjs.org/docs
- Framer Motion: https://www.framer.com/motion/
- GitHub issues: Create an issue in your repo

## License

This project is proprietary to Vikamusk. All rights reserved.
