import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, X, CheckCircle } from 'lucide-react';

export interface QueuedFile {
    id: string;
    file: File;
    preview: string;
    status: 'queued' | 'processing' | 'done' | 'error';
    result?: string;
    error?: string;
}

interface BatchUploadZoneProps {
    onFilesSelect: (files: QueuedFile[]) => void;
    onProcessAll: () => void;
    queue: QueuedFile[];
    onRemoveFile: (id: string) => void;
    isProcessing: boolean;
    maxFiles?: number;
}

const BatchUploadZone: React.FC<BatchUploadZoneProps> = ({
    onFilesSelect,
    onProcessAll,
    queue,
    onRemoveFile,
    isProcessing,
    maxFiles = 10
}) => {
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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    }, [queue.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
            e.target.value = '';
        }
    };

    const handleFiles = (files: File[]) => {
        setError(null);

        // Check max files
        const remainingSlots = maxFiles - queue.length;
        if (files.length > remainingSlots) {
            setError(`Maksimum ${maxFiles} dosya yükleyebilirsiniz. ${remainingSlots} slot kaldı.`);
            files = files.slice(0, remainingSlots);
        }

        const validFiles: QueuedFile[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                continue;
            }

            validFiles.push({
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                preview: URL.createObjectURL(file),
                status: 'queued'
            });
        }

        if (validFiles.length > 0) {
            onFilesSelect(validFiles);
        }
    };

    const onButtonClick = () => {
        inputRef.current?.click();
    };

    const queuedCount = queue.filter(f => f.status === 'queued').length;
    const processingCount = queue.filter(f => f.status === 'processing').length;
    const doneCount = queue.filter(f => f.status === 'done').length;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Drop Zone */}
            <div
                className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out cursor-pointer
          ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-500'}
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
                    multiple
                    disabled={isProcessing}
                />

                <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className={`p-3 rounded-full bg-gray-800 transition-transform duration-300 group-hover:scale-110 ${dragActive ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400'}`}>
                        <UploadCloud className="w-6 h-6" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Toplu Yükleme
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Birden fazla fotoğraf sürükleyin (Maks. {maxFiles} dosya)
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {/* Queue */}
            {queue.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">
                            İşlem Kuyruğu ({queue.length})
                        </h4>
                        <div className="flex gap-2 text-xs">
                            {queuedCount > 0 && (
                                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded">
                                    Bekliyor: {queuedCount}
                                </span>
                            )}
                            {processingCount > 0 && (
                                <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded">
                                    İşleniyor: {processingCount}
                                </span>
                            )}
                            {doneCount > 0 && (
                                <span className="px-2 py-1 bg-green-600/30 text-green-300 rounded">
                                    Tamamlandı: {doneCount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* File Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {queue.map((item) => (
                            <div
                                key={item.id}
                                className={`relative rounded-lg overflow-hidden border-2 transition-colors ${item.status === 'done' ? 'border-green-500' :
                                        item.status === 'processing' ? 'border-purple-500' :
                                            item.status === 'error' ? 'border-red-500' :
                                                'border-gray-700'
                                    }`}
                            >
                                <img
                                    src={item.result || item.preview}
                                    alt={item.file.name}
                                    className="w-full aspect-square object-cover"
                                />

                                {/* Status Overlay */}
                                {item.status === 'processing' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}

                                {item.status === 'done' && (
                                    <div className="absolute top-1 right-1">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                )}

                                {/* Remove Button */}
                                {item.status === 'queued' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFile(item.id);
                                        }}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}

                                {/* File Name */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                                    <p className="text-[10px] text-gray-300 truncate">
                                        {item.file.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Process All Button */}
                    {queuedCount > 0 && (
                        <button
                            onClick={onProcessAll}
                            disabled={isProcessing}
                            className="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <UploadCloud className="w-5 h-5" />
                            Tümünü İşle ({queuedCount} dosya)
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BatchUploadZone;
