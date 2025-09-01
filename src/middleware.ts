import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isCMSRoute = req.nextUrl.pathname.startsWith('/cms');

    // If accessing CMS routes and user is authenticated, check for proper access
    if (isCMSRoute && token) {
      // Only allow credentials provider users or users with admin/editor roles
      const hasCMSAccess =
        token.provider === 'credentials' ||
        ['admin', 'editor'].includes(token.role);

      if (!hasCMSAccess) {
        // Redirect OAuth users without CMS access to home
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For CMS routes, allow access (authentication will be handled by the page)
        if (req.nextUrl.pathname.startsWith('/cms')) {
          return true;
        }

        // For other routes, allow access
        return true;
      },
    },
  },
);

export const config = {
  matcher: ['/cms/:path*', '/api/cms/:path*'],
};
