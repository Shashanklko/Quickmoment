import React, { useState } from 'react';

interface GearMathLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  interactive?: boolean;
  className?: string;
}

export const GearMathLogo: React.FC<GearMathLogoProps> = ({
  size = 'md',
  showText = false,
  interactive = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [speedUp, setSpeedUp] = useState(false);

  const sizeDimensions = {
    xs: { icon: 24, font: 'text-base', tag: 'text-[9px]' },
    sm: { icon: 32, font: 'text-lg', tag: 'text-[10px]' },
    md: { icon: 42, font: 'text-xl', tag: 'text-xs' },
    lg: { icon: 54, font: 'text-2xl', tag: 'text-sm' },
    xl: { icon: 72, font: 'text-3xl', tag: 'text-base' },
  };

  const currentSize = sizeDimensions[size];

  return (
    <div 
      className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}
      onMouseEnter={() => {
        if (interactive) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (interactive) {
          setIsHovered(false);
          setSpeedUp(false);
        }
      }}
      onClick={() => {
        if (interactive) setSpeedUp(!speedUp);
      }}
      title="QuickMoments — Smart Calculators & Mathematical Simulations"
    >
      {/* SVG Gear & Math Symbols Icon */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        {/* Glowing backdrop halo */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-brand-500/30 via-accent-500/20 to-indigo-500/30 blur-md transition-all duration-500 ${
          isHovered ? 'scale-125 opacity-100' : 'scale-100 opacity-60'
        }`} />

        {/* Outer Rotating Gear with Teeth */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full text-brand-600 dark:text-brand-400 drop-shadow-md transition-transform duration-300 ${
            speedUp 
              ? 'animate-[spin_2s_linear_infinite]' 
              : isHovered 
                ? 'animate-[spin_6s_linear_infinite]' 
                : 'animate-spin-slow'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="coreGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* 12 Precision Gear Teeth & Rim */}
          <path
            d="M50 15 
               C52 15 53 12 55 12 L57 12 C59 12 60 15 62 16 
               C65 17 68 15 70 14 L72 13 C74 12 76 14 77 16 
               C78 19 81 19 84 21 L85 22 C87 23 88 26 88 28 
               C87 31 89 33 91 35 L92 37 C93 39 92 42 90 44 
               C88 46 89 49 90 52 L90 54 C90 56 88 59 86 60 
               C83 62 83 65 83 68 L83 70 C82 72 80 74 77 75 
               C74 76 73 79 72 82 L71 84 C69 86 66 86 64 85 
               C61 84 58 86 56 88 L54 89 C52 90 49 89 47 87 
               C45 85 42 86 39 86 L37 86 C35 86 33 83 32 81 
               C31 78 28 78 25 76 L24 75 C22 74 21 71 21 69 
               C22 66 20 64 18 62 L17 60 C16 58 17 55 19 53 
               C21 51 20 48 19 45 L19 43 C19 41 21 38 23 37 
               C26 35 26 32 26 29 L26 27 C27 25 29 23 32 22 
               C35 21 36 18 37 15 L38 13 C40 11 43 11 45 12 
               C48 13 50 15 50 15 Z"
            stroke="url(#gearGradient)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fill="none"
            className="opacity-90"
          />

          {/* Internal Gear Webbing & Circular Rail */}
          <circle
            cx="50"
            cy="50"
            r="27"
            stroke="url(#gearGradient)"
            strokeWidth="2.5"
            strokeDasharray="4 3"
            className="opacity-60"
          />

          {/* Precision Spokes */}
          <line x1="50" y1="23" x2="50" y2="35" stroke="url(#gearGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="65" x2="50" y2="77" stroke="url(#gearGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="23" y1="50" x2="35" y2="50" stroke="url(#gearGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="50" x2="77" y2="50" stroke="url(#gearGradient)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="31" y1="31" x2="39" y2="39" stroke="url(#gearGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="69" y1="69" x2="61" y2="61" stroke="url(#gearGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="69" y1="31" x2="61" y2="39" stroke="url(#gearGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="31" y1="69" x2="39" y2="61" stroke="url(#gearGradient)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

          {/* Inner Math Core Ring */}
          <circle
            cx="50"
            cy="50"
            r="16"
            fill="url(#coreGradient)"
            className="drop-shadow-sm opacity-95"
          />
        </svg>

        {/* Counter-rotating or Floating Mathematical Symbols Inside & Orbiting */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Centerpiece Pi Symbol with subtle counter-spin / stable alignment */}
          <span 
            className="text-white font-bold math-symbol leading-none drop-shadow select-none transition-transform"
            style={{ 
              fontSize: currentSize.icon * 0.38,
              transform: isHovered ? 'scale(1.15)' : 'scale(1)'
            }}
          >
            π
          </span>
        </div>

        {/* Mini Orbiting Math Glyphs around the Gear */}
        <div className="absolute -top-1 -right-1 pointer-events-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-accent-500/90 text-white font-mono text-[9px] font-extrabold shadow-sm">
            ∑
          </span>
        </div>
        <div className="absolute -bottom-1 -left-1 pointer-events-none transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-brand-600/90 text-white font-mono text-[9px] font-extrabold shadow-sm">
            √
          </span>
        </div>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-black tracking-tight ${currentSize.font} text-slate-900 dark:text-white`}>
              Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-400 to-accent-500">Moments</span>
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
              PRO
            </span>
          </div>
          <span className={`${currentSize.tag} font-medium text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wide`}>
            Smart Calculators & Simulations
          </span>
        </div>
      )}
    </div>
  );
};
export default GearMathLogo;
