import React from "react";
import imgLogoBlanco from '../assets/icons/motofix_png_blanco.png';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size }) => {
  const style = size ? { height: size } : undefined;
  return (
    <div className="relative h-10 sm:h-12 flex-shrink-0" style={style}>
      <img
        src="/assets/moto-logo-fondotransparente.png"
        alt="MotoFIX"
        className={`h-full w-auto transition-opacity duration-150 dark:opacity-0 ${className}`}
      />
      <img
        src={imgLogoBlanco}
        alt="MotoFIX"
        className={`absolute top-0 left-0 h-full w-auto transition-opacity duration-150 opacity-0 dark:opacity-100 ${className}`}
      />
    </div>
  );
};

export default Logo;
