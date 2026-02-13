import React, { useState, useRef, useCallback } from 'react';
import { X, Check, RotateCcw, Crop } from 'lucide-react';

interface CropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    onCropComplete: (cropData: CropData) => void;
}

export interface CropData {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const CropModal: React.FC<CropModalProps> = ({ isOpen, onClose, imageUrl, onCropComplete }) => {
    const [cropArea, setCropArea] = useState<CropData>({ x: 0, y: 0, width: 100, height: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent, type: 'move' | 'resize') => {
        e.preventDefault();
        setIsDragging(true);
        setDragType(type);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragType(null);
    }, []);

    const handleReset = () => {
        setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    };

    const handleApply = () => {
        onCropComplete(cropArea);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative z-10 w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col max-h-[90vh] animate-fade-in">

                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crop className="w-5 h-5 text-purple-400" />
                        <h2 className="text-lg font-bold text-white">Görsel Kırpma</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Aspect Ratio Selection */}
                <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
                    <span className="text-xs text-gray-400">En-Boy Oranı:</span>
                    {(['free', '1:1', '16:9', '4:3'] as const).map(ratio => (
                        <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${aspectRatio === ratio
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {ratio === 'free' ? 'Serbest' : ratio}
                        </button>
                    ))}
                </div>

                {/* Crop Area */}
                <div
                    ref={containerRef}
                    className="flex-1 p-4 flex items-center justify-center overflow-hidden bg-gray-900"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="relative max-w-full max-h-[60vh]">
                        <img
                            src={imageUrl}
                            alt="Crop preview"
                            className="max-w-full max-h-[60vh] object-contain"
                            draggable={false}
                        />

                        {/* Crop Overlay */}
                        <div
                            className="absolute border-2 border-purple-500 bg-purple-500/10 cursor-move"
                            style={{
                                left: `${cropArea.x}%`,
                                top: `${cropArea.y}%`,
                                width: `${cropArea.width}%`,
                                height: `${cropArea.height}%`
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'move')}
                        >
                            {/* Corner Handles */}
                            {['nw', 'ne', 'sw', 'se'].map(corner => (
                                <div
                                    key={corner}
                                    className={`absolute w-4 h-4 bg-purple-500 border-2 border-white rounded-sm cursor-${corner}-resize ${corner.includes('n') ? 'top-0' : 'bottom-0'
                                        } ${corner.includes('w') ? 'left-0' : 'right-0'
                                        } -translate-x-1/2 -translate-y-1/2`}
                                    style={{
                                        transform: `translate(${corner.includes('e') ? '50%' : '-50%'}, ${corner.includes('s') ? '50%' : '-50%'})`
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleMouseDown(e, 'resize');
                                    }}
                                />
                            ))}

                            {/* Size Display */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-xs text-white px-2 py-1 rounded whitespace-nowrap">
                                {Math.round(cropArea.width)}% × {Math.round(cropArea.height)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex justify-between">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Sıfırla
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                        >
                            <Check className="w-4 h-4" />
                            Uygula
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropModal;
