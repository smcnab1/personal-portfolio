import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useCMSAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    setIsLoading(false);

    // Redirect to CMS signin if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/cms-signin?callbackUrl=/cms');
      return;
    }

    // Check if user has CMS access
    if (status === 'authenticated' && session?.user) {
      // Only allow credentials provider users or users with admin/editor roles
      const hasCMSAccess =
        session.user.provider === 'credentials' ||
        ['admin', 'editor'].includes(session.user.role);

      if (!hasCMSAccess) {
        // Redirect OAuth users without CMS access
        router.push('/');
        return;
      }
    }
  }, [status, session, router]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/cms-signin');
  };

  const isAuthenticated = status === 'authenticated';
  const isAdmin = session?.user?.role === 'admin';
  const isEditor = session?.user?.role === 'editor';
  const hasCMSAccess = isAdmin || isEditor;
  const isCredentialsUser = session?.user?.provider === 'credentials';

  return {
    session,
    isAuthenticated,
    isAdmin,
    isEditor,
    hasCMSAccess,
    isCredentialsUser,
    isLoading,
    login,
    logout,
    user: session?.user,
  };
};
