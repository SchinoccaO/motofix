import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size }) => {
  return (
    <img
      src="/assets/MOTO-logo.png"
      alt="MotoFIX"
      className={`h-10 sm:h-12 w-auto ${className}`}
      style={size ? { height: size } : undefined}
    />
  );
};

export default Logo;
