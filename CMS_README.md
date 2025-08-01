# Content Management System (CMS)

This CMS allows you to manage your portfolio content without touching code. All content is stored in a database and can be edited through a web interface.

## Features

- **Live Content Management**: Edit careers, certifications, education, publications, projects, and about content
- **Site Settings**: Configure site-wide settings like contact info, social links, and feature toggles
- **Database Storage**: All content is stored in SQLite database (can be easily migrated to PostgreSQL/MySQL)
- **Modern UI**: Clean, responsive interface that matches your site design
- **Real-time Updates**: Changes are immediately reflected on your site

## Quick Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Set up the database and migrate data**:
   ```bash
   npm run setup:cms
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the CMS**:
   Visit `http://localhost:3000/cms` in your browser

## Database Schema

The CMS uses the following database tables:

- `Career` - Job positions and work experience
- `Certification` - Professional certifications and memberships
- `Education` - Academic background
- `Publication` - Research papers and publications
- `Project` - Portfolio projects
- `About` - About page content
- `SiteSettings` - Site-wide configuration
- `Blog` - Blog posts (for future use)

## API Endpoints

The CMS provides RESTful API endpoints for all content types:

- `GET/POST/PUT/DELETE /api/cms/careers`
- `GET/POST/PUT/DELETE /api/cms/certifications`
- `GET/POST/PUT/DELETE /api/cms/education`
- `GET/POST/PUT/DELETE /api/cms/publications`
- `GET/POST/PUT/DELETE /api/cms/projects`
- `GET/POST/PUT /api/cms/about`
- `GET/POST/PUT/DELETE /api/cms/settings`

## Usage

### Managing Content

1. **Careers**: Add, edit, or remove job positions
   - Position title, company, location, dates
   - Employment type, industry, responsibilities
   - Company logo and website link

2. **Certifications**: Manage professional credentials
   - Certification name, issuing organization
   - Type (Membership, Certification, Qualification)
   - Dates, industry, description

3. **Education**: Academic background
   - Degree, school, major
   - Start/end years, location
   - School logo and website

4. **Publications**: Research and academic work
   - Title, journal, publication type
   - Dates, DOI links, overview

5. **Projects**: Portfolio projects
   - Title, description, tech stack
   - Demo and GitHub links
   - Featured project settings

6. **About**: About page content
   - Rich text content for the about section

### Site Settings

Configure site-wide settings:

- **Site Information**: Name, description, contact email
- **Social Links**: GitHub, LinkedIn, Twitter URLs
- **Feature Toggles**: Enable/disable blog and projects sections

## Data Migration

The setup script automatically migrates your existing content from the constants files to the database. This includes:

- All careers from `src/common/constant/careers.ts`
- All certifications from `src/common/constant/certs.ts`
- All education from `src/common/constant/education.ts`
- All publications from `src/common/constant/publications.ts`
- All projects from `src/common/constant/projects.ts`
- About content from `src/common/constant/about.ts`

## Database Configuration

The CMS uses SQLite by default for simplicity. To use a different database:

1. **PostgreSQL**:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   ```

2. **MySQL**:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/portfolio"
   ```

3. **SQLite** (default):
   ```env
   DATABASE_URL="file:./dev.db"
   ```

## Development

### Adding New Content Types

1. Add the model to `prisma/schema.prisma`
2. Create API endpoint in `src/pages/api/cms/`
3. Update the CMS interface in `src/pages/cms.tsx`
4. Add migration logic in `src/lib/cms/migrate.ts`

### Customizing the UI

The CMS uses your existing UI components:
- `Button` from `@/common/components/elements/Button`
- `Card` from `@/common/components/elements/Card`
- `Container` from `@/common/components/elements/Container`
- `Tabs` from `@/common/components/elements/Tabs`

## Security Considerations

- The CMS currently has no authentication (add this for production)
- Consider adding rate limiting to API endpoints
- Implement proper input validation and sanitization
- Add CSRF protection for forms

## Production Deployment

For production deployment:

1. **Set up a production database** (PostgreSQL recommended)
2. **Add authentication** to the CMS
3. **Configure environment variables**
4. **Set up proper backups**
5. **Add monitoring and logging**

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Check your `DATABASE_URL` in `.env`
   - Ensure the database server is running

2. **Migration failures**:
   - Run `npx prisma migrate reset` to reset the database
   - Check for syntax errors in the schema

3. **CMS not loading**:
   - Check browser console for errors
   - Verify API endpoints are working
   - Check network tab for failed requests

### Useful Commands

```bash
# Reset database and re-run migrations
npx prisma migrate reset

# View database in Prisma Studio
npm run db:studio

# Generate Prisma client
npx prisma generate

# Push schema changes
npm run db:push
```

## Future Enhancements

- [ ] Authentication and user management
- [ ] Image upload and management
- [ ] Rich text editor for content
- [ ] Content versioning and history
- [ ] Bulk import/export functionality
- [ ] Content scheduling and publishing
- [ ] SEO management tools
- [ ] Analytics and insights

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Check the server logs for API errors
4. Verify your database connection and schema

The CMS is designed to be self-contained and easy to use. Once set up, you can manage all your portfolio content through the web interface without touching code! 