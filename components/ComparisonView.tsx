import React, { useState, useRef, useEffect } from 'react';
import { Download, ArrowRight, RefreshCw, Eye } from 'lucide-react';

interface ComparisonViewProps {
  originalUrl: string;
  processedUrl: string;
  onDownload: () => void;
  onReset: () => void;
  scaleFactor?: number; // 2, 4, 8, or 16
  processingTime?: number; // Duration in seconds
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, processedUrl, onDownload, onReset, scaleFactor = 4, processingTime = 0 }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isHolding, setIsHolding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Dynamic resolution label
  const getResolutionLabel = () => {
    if (scaleFactor >= 16) return '16K Ultra';
    if (scaleFactor >= 8) return '8K';
    if (scaleFactor >= 4) return '4K';
    return '2K';
  };

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const onMouseDown = () => (isDragging.current = true);
  const onMouseUp = () => (isDragging.current = false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-white">Sonuç</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onReset}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Yeni
          </button>
          <button
            onClick={onDownload}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-purple-900/20"
          >
            <Download className="w-4 h-4" /> İndir ({getResolutionLabel()})
          </button>
        </div>
      </div>

      {/* Fixed Background Container (Matches UploadZone) */}
      <div className="flex justify-center w-full">
        {/* Outer Premium Ring */}
        <div className="relative p-2 rounded-3xl bg-gray-800/30 border border-white/5 backdrop-blur-sm shadow-xl w-full max-w-2xl">
          {/* Inner Fixed Box (Dashed Look) - Exact Match to UploadZone Size */}
          <div className="relative h-[320px] w-full border-2 border-dashed border-gray-700/50 rounded-2xl bg-gray-900/50 flex items-center justify-center p-6">

            {/* Image Slider Component (Centered & Contained) */}
            <div
              className="relative shadow-2xl rounded-lg overflow-hidden"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                aspectRatio: 'auto'
              }}
            >
              <div
                ref={containerRef}
                className="relative cursor-ew-resize select-none group"
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onTouchMove={onTouchMove}
              >
                {/* Processed Image (Background) */}
                <img
                  src={isHolding ? originalUrl : processedUrl}
                  alt="İşlenmiş Yüksek Çözünürlüklü Görsel (Sonra)"
                  className="block max-h-full max-w-full object-contain"
                  style={{ maxHeight: '280px' }} // Highly compacted fixed size
                  draggable={false}
                  loading="lazy"
                />

                {!isHolding && (
                  <>
                    {/* Labels */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-white/10 text-white text-xs px-2 py-1 rounded z-20 pointer-events-none">
                      SONRA ({getResolutionLabel()})
                    </div>

                    {/* Original Image (Clipped overlay) */}
                    <div
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img
                        src={originalUrl}
                        alt="Orijinal Düşük Çözünürlüklü Görsel (Önce)"
                        className="w-full h-full object-cover"
                        draggable={false}
                        loading="lazy"
                      />
                      {/* Label Before */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 text-white text-xs px-2 py-1 rounded">
                        ÖNCE
                      </div>
                    </div>

                    {/* Slider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-none z-10 -translate-x-1/2"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform">
                        <div className="flex gap-1">
                          <ArrowRight className="w-4 h-4 text-purple-600 rotate-180" />
                          <ArrowRight className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="md:hidden flex justify-center">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gray-800 rounded-full text-sm font-medium active:bg-gray-700 select-none touch-none"
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
        >
          <Eye className="w-4 h-4" />
          Orijinali Görmek İçin Basılı Tut
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <p className="text-gray-400 text-xs uppercase mb-1">Çözünürlük</p>
          <p className="text-white font-mono font-semibold">{getResolutionLabel()} ({scaleFactor}x)</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <p className="text-gray-400 text-xs uppercase mb-1">Format</p>
          <p className="text-white font-mono font-semibold">PNG (Yüksek Kalite)</p>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
          <p className="text-gray-400 text-xs uppercase mb-1">İşlem Süresi</p>
          <p className="text-green-400 font-mono font-semibold">
            {processingTime >= 60
              ? `${Math.floor(processingTime / 60)}dk ${processingTime % 60}sn`
              : `${processingTime} saniye`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;