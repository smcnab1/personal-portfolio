import { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Container } from './Container';

interface CMSLoginProps {
  onLogin: () => void;
}

export const CMSLogin = ({ onLogin }: CMSLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cms/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <Card className='w-full max-w-md space-y-8 p-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold'>CMS Login</h2>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Sign in to access the content management system
            </p>
          </div>
          <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='••••••••'
                />
              </div>
            </div>

            {error && (
              <div className='text-center text-sm text-red-600'>{error}</div>
            )}

            <div>
              <Button type='submit' disabled={loading} className='w-full'>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <div className='text-center text-xs text-gray-500'>
              <p>Default credentials:</p>
              <p>Email: admin@sammcnab.co.uk</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </Card>
      </div>
    </Container>
  );
};
