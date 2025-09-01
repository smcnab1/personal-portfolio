import { getCalApi } from '@calcom/embed-react';
import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiClock, FiVideo, FiAlertCircle } from 'react-icons/fi';

interface CalComponentProps {
  isVisible: boolean;
}

const CalComponent15min: React.FC<CalComponentProps> = ({ isVisible }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isCalInitialized, setIsCalInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isVisible || isCalInitialized) return;

    const initializeCal = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Wait for the DOM to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check if Cal.com script is already loaded
        if (typeof window !== 'undefined' && !window.Cal) {
          // Wait a bit more for the script to load if it's not there yet
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (!window.Cal) {
            throw new Error('Cal.com script not loaded');
          }
        }

        const cal = await getCalApi({});

        // Configure Cal.com UI
        cal('ui', {
          styles: {
            branding: {
              brandColor: '#38b2ac',
            },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });

        setIsCalInitialized(true);

        // Longer delay to ensure Cal.com is fully initialized and iframe is created
        setTimeout(() => {
          if (buttonRef.current) {
            try {
              buttonRef.current.click();
            } catch (error) {
              console.error('Error clicking Cal.com button:', error);
              setHasError(true);
            }
          }
        }, 500);
      } catch (error) {
        console.error('Failed to initialize Cal.com:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (!isCalInitialized) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    initializeCal();

    return () => clearTimeout(timeoutId);
  }, [isVisible, isCalInitialized]);

  const handleClick = () => {
    if (!isCalInitialized || isLoading || hasError) {
      return;
    }

    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const handleRetry = () => {
    setIsCalInitialized(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div className='flex flex-col space-y-5 rounded-2xl border bg-white bg-gradient-to-tr px-6 py-5 dark:border-teal-500 dark:from-teal-950 dark:to-teal-800 dark:text-white'>
        <div className='flex items-start justify-between gap-5'>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 text-base font-medium md:text-lg'>
              <FiAlertCircle className='text-red-500' size={20} />
              <span>Calendar Unavailable</span>
            </div>
            <p className='text-sm dark:text-neutral-300 md:text-base'>
              Unable to load calendar. Please try again or contact me directly.
            </p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className='rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      data-aos-duration='1000'
      className={`flex cursor-pointer flex-col space-y-5 rounded-2xl border bg-white bg-gradient-to-tr px-6 py-5 transition-all duration-300 hover:scale-[101%] hover:shadow-sm dark:border-teal-500 dark:from-teal-950 dark:to-teal-800 dark:text-white ${
        !isCalInitialized || isLoading ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <div className='flex items-start justify-between gap-5'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-base font-medium md:text-lg'>
            <span>Quick Chat</span>
            {isLoading && (
              <span className='text-sm text-gray-500'>Loading...</span>
            )}
          </div>
          <p className='text-sm dark:text-neutral-300 md:text-base'>
            Let’s find some time to talk about anything
          </p>
        </div>
        <div className='rounded-full border-2 border-neutral-400 p-3 dark:border-teal-600 dark:text-neutral-100'>
          <FiCalendar size={22} />
        </div>
      </div>
      <div className='flex items-center gap-5 text-sm dark:text-neutral-200'>
        <div className='flex items-center gap-2'>
          <FiClock size={18} />
          <span>15 Minutes</span>
        </div>
        <div className='flex items-center gap-2'>
          <FiVideo size={18} />
          <span>Online</span>
        </div>
      </div>
      <button
        ref={buttonRef}
        style={{ display: 'none' }}
        data-cal-namespace=''
        data-cal-link='nexoradevlabs/15min'
        data-cal-config='{"layout":"month_view"}'
        disabled={!isCalInitialized || isLoading}
      >
        Click me
      </button>
    </div>
  );
};

export default CalComponent15min;
