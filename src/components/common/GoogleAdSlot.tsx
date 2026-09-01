import React, { useEffect } from 'react';

interface GoogleAdSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && slotId) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore adsbygoogle push error if script is still loading or adblocker is active
    }
  }, [slotId]);

  if (!slotId) return null;

  return (
    <div className={`w-full overflow-hidden text-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1808690241826937"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
