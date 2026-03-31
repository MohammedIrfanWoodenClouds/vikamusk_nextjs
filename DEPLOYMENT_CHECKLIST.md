# Vikamusk Website - Deployment Checklist

Complete this checklist before launching your website to production.

## Pre-Deployment Setup

- [ ] Sanity CMS project created
- [ ] Sanity dataset initialized with "production" name
- [ ] Sanity Studio deployed
- [ ] At least one category created
- [ ] At least 3 sample products added with images
- [ ] Email service configured (Gmail/SendGrid/etc.)
- [ ] Email credentials verified and tested
- [ ] Admin email address configured
- [ ] Contact form tested locally
- [ ] All environment variables set in `.env.local`

## Code Quality Checks

- [ ] No console.log debug statements in production code
- [ ] TypeScript builds without errors: `pnpm tsc`
- [ ] No unused imports or variables
- [ ] All links work and navigate correctly
- [ ] All images load properly
- [ ] Animations run smoothly without stuttering
- [ ] Mobile responsive testing completed
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

## Content Preparation

- [ ] Company information updated
- [ ] Team member photos added (or use placeholder)
- [ ] Contact information current
- [ ] Social media links configured
- [ ] About page content written
- [ ] Product brochures uploaded to Sanity
- [ ] High-quality product images ready
- [ ] Category descriptions written

## SEO & Performance

- [ ] Metadata updated in `layout.tsx`
- [ ] Open Graph images prepared
- [ ] Favicon and apple icon added
- [ ] Google Analytics setup (optional)
- [ ] Sitemap.xml generated
- [ ] robots.txt configured
- [ ] Lighthouse score checked (>90)
- [ ] Core Web Vitals optimized

## Vercel Deployment

- [ ] GitHub repository connected (if using GitHub)
- [ ] Vercel project created
- [ ] Environment variables added to Vercel:
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_SANITY_DATASET`
  - [ ] `NEXT_PUBLIC_SANITY_API_VERSION`
  - [ ] `EMAIL_HOST`
  - [ ] `EMAIL_PORT`
  - [ ] `EMAIL_SECURE`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `EMAIL_FROM`
  - [ ] `ADMIN_EMAIL`
- [ ] Test deployment on preview URL
- [ ] All features tested on staging environment
- [ ] Production environment configured

## Domain & DNS

- [ ] Custom domain registered
- [ ] DNS records updated:
  - [ ] A record pointing to Vercel
  - [ ] CNAME record configured (if needed)
  - [ ] Email MX records updated (if needed)
- [ ] SSL certificate auto-generated (Vercel automatic)
- [ ] Domain verified in Vercel
- [ ] Redirect from www to non-www (or vice versa)
- [ ] HTTPS enforced

## Post-Deployment Testing

- [ ] Website loads on custom domain
- [ ] All pages accessible
- [ ] Navigation works correctly
- [ ] Product filtering works
- [ ] Contact form submits and sends emails
- [ ] Email arrives in admin inbox
- [ ] Customer confirmation email received
- [ ] Images load correctly
- [ ] Animations work smoothly
- [ ] Mobile viewing tested on actual device
- [ ] Fast initial load times

## Security

- [ ] No sensitive data in client code
- [ ] Environment variables not exposed
- [ ] API routes have proper validation
- [ ] Contact form has rate limiting (optional)
- [ ] CORS headers configured (if needed)
- [ ] Security headers set (Vercel defaults usually sufficient)
- [ ] Check for security vulnerabilities: `npm audit`

## Analytics & Monitoring

- [ ] Google Analytics configured (optional)
- [ ] Vercel Analytics enabled
- [ ] Error tracking setup (Sentry optional)
- [ ] Uptime monitoring configured (optional)
- [ ] Email delivery monitoring setup

## Backup & Maintenance

- [ ] Sanity CMS backups enabled
- [ ] Regular content update schedule planned
- [ ] Team member access granted to Sanity Studio
- [ ] Documentation shared with team
- [ ] Deployment process documented
- [ ] Emergency contact procedures established

## Communication

- [ ] Team notified of launch
- [ ] Client notified of launch
- [ ] Launch announcement prepared
- [ ] Customer support guidelines ready
- [ ] Contact form responses assigned to team member
- [ ] Email notifications forwarded to appropriate team

## Final Verification

- [ ] Verify site is live: `https://yourdomain.com`
- [ ] Test 404 page
- [ ] Check favicon appears
- [ ] Verify footer links work
- [ ] Confirm contact form working end-to-end
- [ ] Spot-check product pages
- [ ] Test browser back/forward buttons
- [ ] Clear browser cache and test again

## Post-Launch (First Week)

- [ ] Monitor error logs daily
- [ ] Check Google Search Console
- [ ] Respond to customer inquiries promptly
- [ ] Monitor analytics for traffic patterns
- [ ] Fix any reported issues immediately
- [ ] Update status page if applicable
- [ ] Review performance metrics

## Optional Enhancements

- [ ] Setup email notifications for new enquiries
- [ ] Configure Slack integration for form submissions
- [ ] Add chat support widget
- [ ] Setup abandoned form recovery emails
- [ ] Add customer testimonials section
- [ ] Setup blog/news section
- [ ] Add video product demos
- [ ] Implement booking/appointment system

## Success Indicators

Your deployment is successful when:
- ✅ Website is live and accessible
- ✅ All features working as expected
- ✅ Contact forms receiving emails
- ✅ Fast page load times
- ✅ Mobile-friendly experience
- ✅ High quality score (Lighthouse >90)
- ✅ Team and customers can navigate easily

## Need Help?

- Review SETUP.md for detailed instructions
- Check Vercel docs: https://vercel.com/docs
- Sanity docs: https://www.sanity.io/docs
- Next.js docs: https://nextjs.org/docs

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Sign Off**: _______________
