
import React from 'react';
interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  withText?: boolean;
}
const Logo: React.FC<LogoProps> = ({
  size = 'md',
  withText = true
}) => {
  // Size mapping
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
  return <div className="flex items-center gap-2">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold`}>
        <span className={`${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl'}`}>M</span>
      </div>
      {withText && <div>
          <h1 className={`${textSizes[size]} font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400`}>
            Mio AI
          </h1>
        </div>}
    </div>;
};
export default Logo;
