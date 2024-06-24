import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";
import { FiCalendar, FiClock, FiVideo } from 'react-icons/fi';

interface CalComponentProps {
  isVisible: boolean;
}

const CalComponent30min: React.FC<CalComponentProps> = ({ isVisible }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        "styles": {
          "branding": {
            "brandColor": "#38b2ac"
          }
        },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });

      if (buttonRef.current) {
        buttonRef.current.click();
      }
    })();
  }, [isVisible]);

  return (
    <div
      onClick={() => {
        if (buttonRef.current) {
          buttonRef.current.click();
        }
      }}
      data-aos-duration="1000"
      className="flex cursor-pointer flex-col space-y-5 rounded-2xl border bg-white bg-gradient-to-tr px-6 py-5 transition-all duration-300 hover:scale-[101%] hover:shadow-sm dark:border-teal-500 dark:from-teal-950 dark:to-teal-800 dark:text-white"
    >
      <div className='flex items-start justify-between gap-5'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-base font-medium md:text-lg'>
            <span>Quick Chat</span>
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
          <span>30 Minutes</span>
        </div>
        <div className='flex items-center gap-2'>
          <FiVideo size={18} />
          <span>Online</span>
        </div>
      </div>
      <button
        ref={buttonRef}
        style={{ display: 'none' }}
        data-cal-namespace=""
        data-cal-link="sam-mcnab-7lmpet/30min"
        data-cal-config='{"layout":"month_view"}'
      >
        Click me
      </button>
    </div>
  );
};

export default CalComponent30min;
