# Quick Start Guide - 5 Minutes

Get Vikamusk website running locally in 5 minutes.

## Step 1: Clone & Install (1 min)

```bash
cd vikamusk-website
pnpm install
```

## Step 2: Get Sanity Credentials (1 min)

1. Go to https://www.sanity.io/
2. Sign up (free account)
3. Create project → Choose "Blog" template
4. Copy your Project ID from project settings

## Step 3: Setup Env (1 min)

Create `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@vikamusk.com
ADMIN_EMAIL=your-email@gmail.com
```

## Step 4: Start Dev Server (1 min)

```bash
pnpm dev
```

Visit http://localhost:3000

## Step 5: Add Sample Data (1 min)

1. Open Sanity Studio: http://localhost:3000/studio
2. Click "Categories" → Create new
3. Add: Forklifts, Excavators, Loaders (repeat for each)
4. Click "Products" → Create new
5. Fill in title, model, category, add an image
6. Click "Publish"

## You're Done! 🎉

Your website is running with:
- ✅ Home page with animations
- ✅ Product listing and search
- ✅ Product detail pages
- ✅ About and contact pages
- ✅ Contact form (email to admin)
- ✅ Responsive mobile design
- ✅ Professional animations

## Common Tasks

### Add More Products
```
Sanity Studio → Products → Create
Fill in details → Publish
```

### Change Colors
Edit `/app/globals.css` - look for CSS variables

### Add Navigation Links
Edit `/components/header.tsx` - update navLinks array

### Customize Home Page
Edit `/app/page.tsx` - update hero, stats, sections

### Update Footer
Edit `/components/footer.tsx` - update company info

## Deploying to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Visit https://vercel.com
# 3. Click "New Project"
# 4. Select your repository
# 5. Add environment variables from .env.local
# 6. Click Deploy
```

Done! Your site is live.

## Troubleshooting

**Page shows "Error fetching products"**
- Check Sanity Project ID in `.env.local`
- Verify products exist in Sanity Studio
- Clear cache: `rm -rf .next`

**Email not sending**
- Check email credentials
- Use Gmail app password (not regular password)
- Verify SMTP settings

**Styles not loading**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server: `pnpm dev`

**Images not showing**
- Add images through Sanity Studio
- Don't hotlink external images

## Next Steps

1. ✅ Follow this guide
2. → Add real product data to Sanity
3. → Deploy to Vercel
4. → Setup custom domain
5. → Monitor analytics

## Need Help?

- Full setup guide: See `SETUP.md`
- Project details: See `PROJECT_SUMMARY.md`
- Deployment checklist: See `DEPLOYMENT_CHECKLIST.md`

## Quick Command Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm tsc              # Check TypeScript errors
pnpm lint             # Run linter

# Sanity
npx sanity deploy     # Deploy studio

# Useful URLs
http://localhost:3000          # Your website
http://localhost:3000/studio   # Sanity CMS
```

---

**Ready to launch?** Check `DEPLOYMENT_CHECKLIST.md` before going live!
