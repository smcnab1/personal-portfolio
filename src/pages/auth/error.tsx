import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import Button from '@/common/components/elements/Button';

const AuthErrorPage: NextPage = () => {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please contact support.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The sign in link is no longer valid. It may have expired or been already used.';
      case 'OAuthSignin':
        return 'Error occurred during OAuth sign in. Please try again.';
      case 'OAuthCallback':
        return 'Error occurred during OAuth callback. Please try again.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth provider user account. Please try again.';
      case 'EmailCreateAccount':
        return 'Could not create email provider user account. Please try again.';
      case 'Callback':
        return 'Error occurred during callback. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'To confirm your identity, sign in with the same account you used originally.';
      case 'EmailSignin':
        return 'Check your email address.';
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      case 'Default':
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <NextSeo title='Authentication Error - Sam McNab' />
      <Container data-aos='fade-up'>
        <PageHeading
          title='Authentication Error'
          description='Something went wrong during sign in'
        />

        <div className='mx-auto mt-8 max-w-md text-center'>
          <div className='mb-6 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
            <p className='text-red-800 dark:text-red-200'>
              {getErrorMessage(error as string)}
            </p>
          </div>

          {error === 'OAuthSignin' ||
            (error === 'OAuthCallback' && (
              <div className='mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20'>
                <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                  <strong>Common causes:</strong>
                  <br />
                  • OAuth app not configured for this domain
                  <br />
                  • Redirect URI mismatch in OAuth settings
                  <br />• Environment variables not set correctly
                </p>
              </div>
            ))}

          <div className='space-y-3'>
            <Button
              onClick={handleRetry}
              className='w-full bg-blue-600 hover:bg-blue-700'
            >
              Try Again
            </Button>

            <Button
              onClick={handleGoHome}
              className='w-full bg-gray-600 hover:bg-gray-700'
            >
              Go Home
            </Button>
          </div>

          <div className='mt-6 text-sm text-gray-600 dark:text-gray-400'>
            <p>
              Error code:{' '}
              <code className='rounded bg-gray-100 px-2 py-1 dark:bg-gray-800'>
                {error}
              </code>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AuthErrorPage;
