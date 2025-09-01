# Production Data Migration Guide

This directory contains all the data exported from your local development database, ready to be imported into production.

## Export Summary

- **Total Records Exported**: 51
- **Export Date**: Generated during export
- **Tables Included**:
  - 15 Career entries
  - 19 Certification entries  
  - 5 Education entries
  - 1 Publication entry
  - 2 Project entries
  - 1 About content entry
  - 8 Site Settings entries

## Files Included

- `complete-export.json` - Full database export with metadata
- `import-to-production.js` - Production import script
- Individual table exports (careers.json, certifications.json, etc.)
- This README file

## Migration Steps

### 1. Backup Production Database (CRITICAL!)

Before importing, **always backup your production database**:

```bash
# If using PostgreSQL
pg_dump your_production_db > backup_$(date +%Y%m%d_%H%M%S).sql

# If using MySQL
mysqldump your_production_db > backup_$(date +%Y%m%d_%H%M%S).sql

# If using SQLite
cp production.db backup_$(date +%Y%m%d_%H%M%S).db
```

### 2. Upload Files to Production

Upload this entire `exports` directory to your production server:

```bash
# Example using SCP
scp -r exports/ user@your-server:/path/to/your/app/scripts/

# Or using rsync
rsync -av exports/ user@your-server:/path/to/your/app/scripts/exports/
```

### 3. Install Dependencies (if needed)

Make sure your production server has the required dependencies:

```bash
npm install @prisma/client
# or
yarn add @prisma/client
```

### 4. Run Database Migration

On your production server:

```bash
cd /path/to/your/app/scripts/exports
node import-to-production.js
```

### 5. Verify Import

After import, verify the data was imported correctly:

- Check the CMS interface (`/cms`)
- Verify public pages display correctly
- Check database record counts match export summary

## Import Script Behavior

The import script will:

1. **Clear existing data** for each table before importing
2. Import data in dependency order to avoid conflicts
3. Remove auto-increment IDs to avoid conflicts
4. **Skip CMS users** for security (create these manually)
5. Preserve sort orders and relationships

## Manual Steps After Import

1. **Create CMS admin user(s)**:
   ```bash
   # Use your CMS interface or create via Prisma
   npx prisma studio
   ```

2. **Verify image paths** - Ensure all logo/image references work in production

3. **Update environment variables** if needed

4. **Test all CMS functionality**

## Rollback Plan

If something goes wrong:

1. Stop your application
2. Restore from the backup you created in step 1
3. Restart your application
4. Investigate and fix issues before re-attempting

## Troubleshooting

### Common Issues

1. **"Table doesn't exist"** - Run `npx prisma db push` first
2. **Permission errors** - Check file permissions and database access
3. **Unique constraint violations** - Existing data conflicts; clear database first

### Getting Help

- Check application logs for detailed error messages
- Verify database schema matches with `npx prisma db pull`
- Ensure all environment variables are properly set

## Production Environment Setup

If this is a fresh production setup, ensure you have:

1. Database properly configured and accessible
2. `DATABASE_URL` environment variable set
3. Prisma schema deployed (`npx prisma db push`)
4. Application built and running (`npm run build && npm start`)

## Data Verification Checklist

After migration, verify:

- [ ] Career entries display correctly on `/about` page
- [ ] Certifications show proper images and links  
- [ ] Education timeline renders properly
- [ ] Projects appear with correct details
- [ ] Site settings (title, description, etc.) are applied
- [ ] CMS interface loads and allows editing
- [ ] All public pages render without errors

---

**Remember**: Always test in a staging environment first if possible!
