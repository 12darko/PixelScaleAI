import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const validateAndProcess = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Lütfen geçerli bir resim dosyası yükleyin.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("Dosya boyutu çok büyük (Maks. 10MB).");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Outer Glassmorphism Container */}
      <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-3xl shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] group cursor-pointer overflow-hidden transition-all hover:shadow-[0_0_60px_-10px_rgba(168,85,247,0.5)]">

        {/* Animated Glow Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 blur-xl"></div>

        <div
          className={`relative rounded-[22px] bg-[#0a0a0f]/80 p-12 transition-all duration-300 ease-out
            ${dragActive ? 'bg-purple-900/40' : 'hover:bg-[#0f0f16]/90'}
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon Container with Glow */}
            <div className={`relative p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 ${dragActive ? 'scale-110 shadow-[0_0_30px_rgba(168,85,247,0.6)]' : 'animate-pulse-slow'}`}>
              <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-colors"></div>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
              ) : (
                <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-purple-300' : 'text-gray-400 group-hover:text-purple-200'} transition-colors`} />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-purple-100 transition-colors">
                {isProcessing ? 'Büyü Başlıyor...' : 'Fotoğrafı Buraya Bırakın'}
              </h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto font-light leading-relaxed">
                PNG, JPG veya WEBP (Maks. 10MB)<br />
                <span className="text-xs text-purple-300/70 mt-2 block font-medium tracking-wide uppercase">Yapay Zeka ile 4K Dönüşüm</span>
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger since parent has onClick
                onButtonClick();
              }}
              className="px-8 py-3 bg-white text-black hover:bg-purple-50 rounded-full font-semibold transition-all text-sm shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.5)] active:scale-95"
            >
              Dosya Seç
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

    </div>
  );
};

export default UploadZone;