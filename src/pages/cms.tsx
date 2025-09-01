import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import AboutManager from '@/common/components/elements/CMS/AboutManager';
import CareerManager from '@/common/components/elements/CMS/CareerManager';
import CertificationManager from '@/common/components/elements/CMS/CertificationManager';
import EducationManager from '@/common/components/elements/CMS/EducationManager';
import ProjectManager from '@/common/components/elements/CMS/ProjectManager';
import PublicationManager from '@/common/components/elements/CMS/PublicationManager';
import SettingsManager from '@/common/components/elements/CMS/SettingsManager';
import { CMSTabs } from '@/common/components/elements/CMSTabs';
import Container from '@/common/components/elements/Container';
import Loading from '@/common/components/elements/Loading';
import { useCMSAuth } from '@/common/hooks/useCMSAuth';

const CMSInterface = () => {
  const { isAuthenticated, isLoading, login, logout, user } = useCMSAuth();
  const [activeTab, setActiveTab] = useState('careers');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const tabs = [
    { id: 'careers', label: 'Careers', icon: '💼' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'publications', label: 'Publications', icon: '📚' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const result = await login(email, password);

    if (!result.success) {
      setLoginError(result.error || 'Login failed');
    }

    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow dark:bg-gray-800'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold'>CMS Login</h2>
            <p className='mt-2 text-center text-sm text-gray-600 dark:text-gray-400'>
              Sign in to access the content management system
            </p>
          </div>
          <form onSubmit={handleLogin} className='mt-8 space-y-6'>
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

            {loginError && (
              <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/20'>
                <p className='text-sm text-red-800 dark:text-red-200'>
                  {loginError}
                </p>
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={isLoggingIn}
                className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
              >
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'careers':
        return <CareerManager />;
      case 'certifications':
        return <CertificationManager />;
      case 'education':
        return <EducationManager />;
      case 'publications':
        return <PublicationManager />;
      case 'projects':
        return <ProjectManager />;
      case 'about':
        return <AboutManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <CareerManager />;
    }
  };

  return (
    <Container>
      <div className='py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Content Management System</h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Manage your portfolio content and site settings
            </p>
            {user && (
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-500'>
                Logged in as {user.email} ({user.role}) via{' '}
                {user.provider === 'credentials' ? 'CMS Login' : user.provider}
              </p>
            )}
          </div>
          <Button
            onClick={handleLogout}
            className='bg-gray-600 hover:bg-gray-700'
          >
            Logout
          </Button>
        </div>

        <Card className='p-6'>
          {user?.provider !== 'credentials' && (
            <div className='mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20'>
              <div className='flex'>
                <div className='ml-3'>
                  <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                    <strong>Security Notice:</strong> You are accessing the CMS
                    via {user?.provider}. For enhanced security, consider using
                    the dedicated CMS login instead.
                  </p>
                </div>
              </div>
            </div>
          )}

          <CMSTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className='mt-6'>{renderTabContent()}</div>
        </Card>
      </div>
    </Container>
  );
};

export default CMSInterface;
