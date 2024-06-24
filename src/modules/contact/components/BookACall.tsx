import { useState } from 'react';

import  CalComponent30min from './CalComponent30min';

const BookACall = () => {
  const [isCalVisible, setIsCalVisible] = useState(false);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCalVisible(true);
  };
  return (
    <div className='space-y-5 pb-2'>
      <h3 className='text-lg font-medium'>Book a Call</h3>
      <div onClick={handleLinkClick}>
        <CalComponent30min isVisible={isCalVisible} />
      </div>
    </div>
  );
};

export default BookACall;
