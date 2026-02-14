import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Download, ArrowRight, RefreshCw, Eye, Maximize2, X } from 'lucide-react';

interface ComparisonViewProps {
  originalUrl: string;
  processedUrl: string;
  onDownload: () => void;
  onReset?: () => void;
  scaleFactor?: number; // 2, 4, 8, or 16
  processingTime?: number; // Duration in seconds
  minimal?: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, processedUrl, onDownload = () => { }, onReset, scaleFactor = 4, processingTime = 0, minimal = false }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isHolding, setIsHolding] = useState(false);

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSliderPosition, setFullscreenSliderPosition] = useState(50);

  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
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
      {!minimal && (
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
      )}

      {/* Fixed Background Container (Glassmorphism) */}
      <div className="flex justify-center w-full">
        {/* Outer Glow Container */}
        <div className="relative p-[1px] rounded-3xl bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

          {/* Inner Fixed Box */}
          <div className="relative h-[320px] w-full rounded-[23px] bg-black/60 flex items-center justify-center p-0 overflow-hidden group">

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Image Slider Component (Centered & Contained) */}
            <div
              className="relative shadow-2xl overflow-hidden z-10"
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
                  style={{ maxHeight: '320px' }} // Full height usage
                  draggable={false}
                  loading="lazy"
                />

                {!isHolding && (
                  <>
                    {/* Labels */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full z-20 pointer-events-none shadow-lg">
                      SONRA <span className="text-purple-400">({getResolutionLabel()})</span>
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
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                        ÖNCE
                      </div>
                    </div>

                    {/* Slider Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center pointer-events-none z-10 -translate-x-1/2 backdrop-blur-sm"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/40 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center transform hover:scale-110 transition-transform hover:bg-white/20 cursor-grab active:cursor-grabbing">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-3 bg-white/80 rounded-full"></div>
                          <div className="w-0.5 h-3 bg-white/80 rounded-full"></div>
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

      {!minimal && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <p className="text-gray-400 text-xs uppercase mb-1">Çözünürlük</p>
            <p className="text-white font-mono font-semibold">{getResolutionLabel()} ({scaleFactor}x)</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <p className="text-gray-400 text-xs uppercase mb-1">Format</p>
            <p className="text-white font-mono font-semibold">PNG (Yüksek Kalite)</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 cursor-pointer hover:bg-gray-700/50 transition-colors" onClick={() => setIsFullscreen(true)}>
            <p className="text-gray-400 text-xs uppercase mb-1">Görünüm</p>
            <p className="text-purple-400 font-bold flex items-center justify-center gap-1"><Maximize2 className="w-3 h-3" /> Tam Ekran</p>
          </div>
        </div>
      )}

      {/* Landing page specific fullscreen trigger for minimal mode */}
      {minimal && (
        <div className="flex justify-center -mt-2">
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-gray-400 hover:text-white transition-all backdrop-blur-sm"
          >
            <Maximize2 className="w-3 h-3" />
            Tam Ekran İncele
          </button>
        </div>
      )}


      {/* Fullscreen Modal - Portalled to body to escape parent stacking contexts */}
      {isFullscreen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* Fullscreen Slider */}
            <div
              ref={fullscreenContainerRef}
              className="relative w-full h-full flex items-center justify-center cursor-ew-resize select-none"
              onMouseDown={() => { isDragging.current = true; }}
              onMouseMove={(e) => {
                if (isDragging.current && fullscreenContainerRef.current) {
                  const rect = fullscreenContainerRef.current.getBoundingClientRect();
                  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                  setFullscreenSliderPosition((x / rect.width) * 100);
                }
              }}
              onTouchStart={() => { isDragging.current = true; }}
              onTouchMove={(e) => {
                if (isDragging.current && fullscreenContainerRef.current) {
                  const rect = fullscreenContainerRef.current.getBoundingClientRect();
                  const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                  setFullscreenSliderPosition((x / rect.width) * 100);
                }
              }}
            >
              {/* Processed (Background) */}
              <img
                src={processedUrl}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                draggable={false}
                alt="After"
              />

              {/* Original (Overlay) */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ clipPath: `inset(0 ${100 - fullscreenSliderPosition}% 0 0)` }}
              >
                <img
                  src={originalUrl}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                  alt="Before"
                />
                {/* Before Label */}
                <div className="absolute top-8 left-8 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20">ÖNCE</div>
              </div>

              {/* After Label (Outside clip path) */}
              <div className="absolute top-8 right-8 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white font-bold border border-white/20 pointer-events-none">SONRA</div>

              {/* Handle Line */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-ew-resize z-20"
                style={{ left: `${fullscreenSliderPosition}%` }}
              >
                {/* Handle Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/40 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-0.5 h-4 bg-white/80 rounded-full"></div>
                    <div className="w-0.5 h-4 bg-white/80 rounded-full"></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div className="bg-black/80 backdrop-blur-md text-white px-6 py-2 rounded-full mt-4 text-sm border border-white/10 z-50">
            Esc ile çıkış yapabilirsiniz
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ComparisonView;