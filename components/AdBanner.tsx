import React from 'react';

interface AdBannerProps {
  slotId: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slotId, format = 'auto', className = '' }) => {
  return (
    <div className={`w-full flex justify-center my-6 ${className}`}>
      {/* This is a visual placeholder representing where the AdSense iframe would go */}
      <div className="w-full max-w-4xl bg-gray-800/50 border border-gray-700 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 min-h-[100px]">
        <span className="text-xs uppercase tracking-widest mb-1">Reklam Alanı (AdSense)</span>
        <span className="text-sm">Google reklamları burada görünecek</span>
        {/* Actual AdSense code would look like this in production: */}
        {/* 
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-YOUR_ID"
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script> 
        */}
      </div>
    </div>
  );
};

export default AdBanner;