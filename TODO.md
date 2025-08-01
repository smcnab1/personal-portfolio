# TODO - CMS & Website Integration

## 🎯 Current Status
- ✅ Database schema created with Prisma
- ✅ API endpoints for all content types
- ✅ Basic CMS authentication
- ✅ Data migration from constants to database
- ⚠️ CMS UI components need import/export fixes
- ⚠️ Website still uses static constants instead of CMS data

## 📋 CMS & Website Integration TODOs

### 1. **CMS CRUD & UI** 
- [ ] Restore full CRUD UI for all content types (Careers, Certs, Education, Publications, Projects, About, Settings) in `/cms`
- [ ] Ensure all components are imported/exported correctly (no more "element type is invalid" errors)
- [ ] Make all tab content in CMS live-editable and reflect changes instantly

### 2. **Website Data Source Refactor**
- [ ] Refactor all public-facing pages (about, projects, education, etc) to fetch data from the database (via API or server-side props) instead of constants files
- [ ] Remove or archive the old constants files once all data is dynamic
- [ ] Ensure site settings (site name, description, social links, etc) are loaded from the CMS-controlled settings table

### 3. **Settings Integration**
- [ ] Add a settings tab in the CMS for site-wide config (site name, description, social links, feature toggles)
- [ ] Update the website header/footer/meta to use these settings dynamically

### 4. **Performance Improvements**
- [ ] Enable Next.js static generation (SSG) or server-side rendering (SSR) for all main pages, using CMS data
- [ ] Add SWR or React Query for client-side data fetching/caching where appropriate
- [ ] Optimize images (use next/image, compress assets, lazy-load offscreen images)
- [ ] Remove unused JS/CSS and audit bundle size
- [ ] Use dynamic imports for heavy/rarely-used components (e.g. code playground, dashboard widgets)
- [ ] Add a loading skeleton or shimmer for slow-loading content
- [ ] Enable HTTP caching headers for API responses

### 5. **General Streamlining**
- [ ] Remove any dead code, unused components, or legacy routes
- [ ] Clean up the navigation/menu to match the new CMS-driven structure
- [ ] Add error boundaries and user-friendly error messages for all dynamic content

### 6. **Advanced (Optional)**
- [ ] Add incremental static regeneration (ISR) for near-instant updates on public pages
- [ ] Add a CDN for static assets (images, fonts, etc)
- [ ] Add monitoring for slow API/database queries

## 🐛 Known Issues
- CMS page has "element type is invalid" errors due to import/export mismatches
- Dashboard page has GitHub API 401 errors (missing/invalid token)
- Some images using deprecated "onLoadingComplete" property

## 🚀 Quick Wins
1. Fix CMS component imports/exports
2. Add basic CRUD UI to CMS
3. Make one page (e.g., About) use CMS data instead of constants
4. Add site settings to CMS

## 📝 Notes
- Database is SQLite for development, can be migrated to PostgreSQL for production
- All existing content has been migrated to the database
- CMS authentication is basic (admin/admin123) - needs proper auth for production
- Current CMS URL: `http://localhost:3001/cms`

## 🔧 Commands
```bash
# Setup CMS
npm run setup:cms

# Run data migration
npm run migrate:data

# View database
npm run db:studio

# Reset database
npx prisma migrate reset
``` 