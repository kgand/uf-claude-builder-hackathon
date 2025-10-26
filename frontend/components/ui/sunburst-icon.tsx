import React from 'react';

interface SunburstIconProps {
  className?: string;
}

export const SunburstIcon: React.FC<SunburstIconProps> = ({ className = "" }) => {
  return (
    <svg 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="6" fill="currentColor" />
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12 2V5M12 19V22M22 12H19M5 12H2M18.36 5.64L16.24 7.76M7.76 16.24L5.64 18.36M18.36 18.36L16.24 16.24M7.76 7.76L5.64 5.64" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SunburstIcon;