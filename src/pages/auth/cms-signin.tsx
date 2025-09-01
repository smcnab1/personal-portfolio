import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const CMSSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { callbackUrl } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        // Redirect to CMS or callback URL
        const redirectUrl = (callbackUrl as string) || '/cms';
        router.push(redirectUrl);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white'>
            CMS Access Only
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
            Administrative access required
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <FiMail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm'
                  placeholder='Email address'
                />
              </div>
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <FiLock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm'
                  placeholder='Password'
                />
              </div>
            </div>
          </div>

          {error && (
            <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/20'>
              <div className='flex'>
                <FiAlertCircle className='h-5 w-5 text-red-400' />
                <div className='ml-3'>
                  <p className='text-sm text-red-800 dark:text-red-200'>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isLoading ? 'Signing in...' : 'Sign in to CMS'}
            </button>
          </div>
        </form>

        <div className='text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            This is a restricted administrative area.
            <br />
            OAuth login is not permitted for CMS access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CMSSignIn;
