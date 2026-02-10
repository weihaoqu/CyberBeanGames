
import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  wallpaper?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, wallpaper }) => {
  const defaultWallpaper = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center p-0 sm:p-4 overflow-hidden z-50 select-none">
      <div 
        className="relative bg-black rounded-[2.5rem] shadow-2xl ring-1 ring-white/10 overflow-hidden box-border border-[4px] sm:border-[6px] border-black z-20 transition-all duration-300 ease-in-out"
        style={{
            height: 'min(80vh, 820px)', 
            width: 'auto',
            maxWidth: '90vw', 
            aspectRatio: '10 / 19', 
            boxShadow: '0 0 0 4px #1f2937, 0 30px 60px -10px rgba(0, 0, 0, 0.9), 0 0 60px rgba(6, 182, 212, 0.3)'
        }}
      >
        
        {/* Notch (Attached to top border) */}
        <div className="absolute top-0 inset-x-0 h-7 z-50 flex justify-center pointer-events-none">
            <div className="w-[35%] h-[24px] bg-black rounded-b-[16px] flex items-center justify-center shadow-sm">
                 <div className="w-12 h-1 bg-[#111] rounded-full"></div>
            </div>
        </div>
        
        {/* Screen Content */}
        <div 
            className="w-full h-full bg-black rounded-[2.0rem] overflow-hidden relative isolate mask-image bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url('${wallpaper || defaultWallpaper}')` }}
        >
             {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[35%] h-[4px] bg-white/30 rounded-full z-50 pointer-events-none mix-blend-difference backdrop-blur-sm"></div>
      </div>
    </div>
  );
};
