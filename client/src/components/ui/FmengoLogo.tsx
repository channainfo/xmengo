import React from 'react';

interface FmengoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const FmengoLogo: React.FC<FmengoLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  // Size mapping
  const sizeMap = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    md: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl' },
    xl: { icon: 'h-12 w-12', text: 'text-3xl' },
  };

  // Generate unique IDs for each instance to avoid gradient conflicts
  const uniqueId = React.useId();
  const fireGradientId = `fireGradient-${uniqueId}`;
  const heartGradientId = `heartGradient-${uniqueId}`;
  const connectGradientId = `connectGradient-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;

  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        className={`${sizeMap[size].icon} mr-2`} 
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id={fireGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7E5F"/>
            <stop offset="100%" stopColor="#FF4E50"/>
          </linearGradient>
          <linearGradient id={heartGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4E50"/>
            <stop offset="100%" stopColor="#F9D423"/>
          </linearGradient>
          <linearGradient id={connectGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8A00"/>
            <stop offset="100%" stopColor="#FF2E63"/>
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        
        {/* Background circle with subtle glow */}
        <circle cx="256" cy="256" r="248" fill="white" stroke={`url(#${fireGradientId})`} strokeWidth="16"/>
        
        {/* Heart-shaped flame with realistic curves */}
        <g filter={`url(#${glowId})`}>
          {/* Heart-shaped base */}
          <path 
            d="M256 400C256 400 400 320 400 220C400 160 350 140 310 180C290 200 270 230 256 260C242 230 222 200 202 180C162 140 112 160 112 220C112 320 256 400 256 400Z" 
            fill={`url(#${heartGradientId})`} 
            opacity="0.85"
          />
          
          {/* Main flame shape inside heart */}
          <path 
            d="M256 380C180 320 160 240 170 200C180 160 210 140 230 160C250 180 256 220 256 220C256 220 262 180 282 160C302 140 332 160 342 200C352 240 332 320 256 380Z" 
            fill={`url(#${fireGradientId})`} 
            opacity="0.9"
          />
          
          {/* Secondary flame details */}
          <path 
            d="M256 340C200 300 190 240 200 210C210 180 230 170 240 180C250 190 256 220 256 220C256 220 262 190 272 180C282 170 302 180 312 210C322 240 312 300 256 340Z" 
            fill={`url(#${fireGradientId})`} 
            opacity="0.8"
          />
          
          {/* Inner flame details with more curves */}
          <path 
            d="M256 300C220 270 210 230 215 210C220 190 235 180 245 190C250 195 256 220 256 220C256 220 262 195 267 190C277 180 292 190 297 210C302 230 292 270 256 300Z" 
            fill={`url(#${connectGradientId})`} 
            opacity="0.7"
          />
          
          {/* Flame center with curves */}
          <path 
            d="M256 260C236 240 230 210 235 195C240 180 250 175 256 190C262 175 272 180 277 195C282 210 276 240 256 260Z" 
            fill="#FFDD00" 
            opacity="0.9"
          />
                
          {/* Flame highlights */}
          <path 
            d="M246 220C246 220 250 200 256 190C262 200 266 220 266 220C266 220 261 230 256 230C251 230 246 220 246 220Z" 
            fill="#FFFFFF" 
            opacity="0.7"
          />
        </g>
        
        {/* Connection dots and lines representing relationship */}
        <circle cx="200" cy="200" r="12" fill={`url(#${connectGradientId})`}/>
        <circle cx="312" cy="200" r="12" fill={`url(#${connectGradientId})`}/>
        <path 
          d="M200 200 Q256 160 312 200" 
          stroke={`url(#${connectGradientId})`} 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M200 200 Q256 240 312 200" 
          stroke={`url(#${connectGradientId})`} 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
          strokeDasharray="4 4"
        />
        
        {/* Spark elements */}
        <circle cx="180" cy="150" r="5" fill="#FFDD00"/>
        <circle cx="330" cy="230" r="4" fill="#FFDD00"/>
        <circle cx="256" cy="130" r="6" fill="#FFDD00"/>
      </svg>
      
      {showText && (
        <span className={`${sizeMap[size].text} font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text`}>
          Fmengo
        </span>
      )}
    </div>
  );
};

export default FmengoLogo;
