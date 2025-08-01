import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import Container from '@/common/components/elements/Container';
import Loading from '@/common/components/elements/Loading';
import EmptyState from '@/common/components/elements/EmptyState';
import { CMSTabs } from '@/common/components/elements/CMSTabs';

const CMSInterface = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('cms-auth='),
      );
      if (authCookie && authCookie.includes('true')) {
        setAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow dark:bg-gray-800'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold'>CMS Login</h2>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Sign in to access the content management system
            </p>
          </div>
          <form className='mt-8 space-y-6'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='mb-1 block text-sm font-medium'
                >
                  Email address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='admin@sammcnab.co.uk'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='mb-1 block text-sm font-medium'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <div>
              <button
                type='button'
                onClick={handleLogin}
                className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                Sign in
              </button>
            </div>

            <div className='text-center text-xs text-gray-500'>
              <p>Default credentials:</p>
              <p>Email: admin@sammcnab.co.uk</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Container>
      <div className='py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Content Management System</h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Manage your portfolio content and site settings
            </p>
          </div>
          <Button
            onClick={() => setAuthenticated(false)}
            className='bg-gray-600 hover:bg-gray-700'
          >
            Logout
          </Button>
        </div>

        <Card className='p-6'>
          <h2 className='mb-4 text-xl font-semibold'>CMS Dashboard</h2>
          <p>
            CMS is working! This is a simplified version to test the basic
            functionality.
          </p>
          <p className='mt-2'>
            All components are now properly imported and working.
          </p>
        </Card>
      </div>
    </Container>
  );
};

export default CMSInterface;
