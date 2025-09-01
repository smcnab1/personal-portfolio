import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/common/libs/prisma';
import bcrypt from 'bcryptjs';

// Extend the default NextAuth types
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
    provider?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: string;
      provider?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    provider?: string;
  }
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: 'CMS Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.cMSUser.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          return isValid
            ? ({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                provider: 'credentials',
              } as any)
            : null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.provider = account?.provider || user.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Only allow CMS users to sign in via credentials
      if (account?.provider === 'credentials') {
        return true; // Allow CMS users
      }

      // For OAuth users, check if they have CMS access
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Check if this OAuth user has a corresponding CMS user record
        const cmsUser = await prisma.cMSUser.findFirst({
          where: {
            email: user.email!,
            role: { in: ['admin', 'editor'] }, // Only allow admin/editor roles
          },
        });

        if (cmsUser) {
          // Update the user's role to match CMS role
          user.role = cmsUser.role;
          return true;
        }

        // OAuth users without CMS access are redirected to regular site
        return '/';
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects based on user role and provider
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/cms-signin',
    error: '/auth/error',
  },
});
