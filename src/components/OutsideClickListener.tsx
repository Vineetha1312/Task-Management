import React, { useEffect, useRef } from 'react';

interface OutsideClickListenerProps {
  onOutsideClick: () => void;
  children: React.ReactNode;
}

const OutsideClickListener: React.FC<OutsideClickListenerProps> = ({ onOutsideClick, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOutsideClick(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOutsideClick]);

  return <div ref={containerRef}>{children}</div>;
};

export default OutsideClickListener;