import React from 'react';
import spriteUrl from '../assets/icons/sprite.svg';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, className = '', size = 24 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  );
};

export default Icon;