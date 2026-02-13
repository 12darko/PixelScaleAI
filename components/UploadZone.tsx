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
      {/* Outer Premium Container */}
      <div className="relative p-2 rounded-3xl bg-gray-800/30 border border-white/5 backdrop-blur-sm shadow-xl">
        <div
          className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out cursor-pointer
            ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600/50 bg-gray-900/50 hover:bg-gray-800/80 hover:border-gray-500'}
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

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className={`p-4 rounded-full bg-gray-800 transition-transform duration-300 group-hover:scale-110 ${dragActive ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400'}`}>
              {isProcessing ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                {isProcessing ? 'İşleniyor...' : 'Fotoğrafı Sürükle veya Seç'}
              </h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                PNG, JPG veya WEBP (Maks. 10MB)<br />
                <span className="text-xs text-gray-500 mt-1 block">Yapay zeka ile 4K çözünürlüğe kadar yükseltin</span>
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent double trigger since parent has onClick
                onButtonClick();
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors text-sm shadow-lg shadow-purple-900/20"
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

      {/* Demo Images */}
      {!isProcessing && (
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-3 text-center">Veya örnek bir fotoğraf ile dene:</p>
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer border border-gray-700 hover:border-purple-500 transition-all opacity-70 hover:opacity-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  const res = await fetch(`https://picsum.photos/300/300?random=${i}`);
                  const blob = await res.blob();
                  const file = new File([blob], "sample.jpg", { type: "image/jpeg" });
                  validateAndProcess(file);
                }}
              >
                <img
                  src={`https://picsum.photos/300/300?random=${i}`}
                  alt={`Örnek İyileştirme ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;