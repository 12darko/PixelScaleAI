import React from 'react';
import { Lock, Sparkles, User, Eraser } from 'lucide-react';
import {
    UpscaleOptions,
    QualityPreset,
    QUALITY_PRESET_INFO,
    hasFeatureAccess,
    PremiumTier
} from '../types';

interface UpscaleOptionsPanelProps {
    options: UpscaleOptions;
    onChange: (options: UpscaleOptions) => void;
    userTier?: PremiumTier;
    onUpgradeClick?: () => void;
}

const UpscaleOptionsPanel: React.FC<UpscaleOptionsPanelProps> = ({
    options,
    onChange,
    userTier,
    onUpgradeClick
}) => {

    const canRemoveArtifacts = hasFeatureAccess(userTier, 'ARTIFACT_REMOVAL');
    const canFaceEnhance = hasFeatureAccess(userTier, 'FACE_ENHANCE');
    const canRemoveBg = hasFeatureAccess(userTier, 'REMOVE_BG');
    const can16x = hasFeatureAccess(userTier, '16X_UPSCALE');

    const handleScaleChange = (scale: 2 | 4 | 8 | 16) => {
        if (scale === 16 && !can16x) {
            onUpgradeClick?.();
            return;
        }
        onChange({ ...options, scale });
    };

    // Track current preset based on mode
    const [currentPreset, setCurrentPreset] = React.useState<QualityPreset>(QualityPreset.STANDARD);

    const handlePresetChange = (preset: QualityPreset) => {
        setCurrentPreset(preset);
        const presetInfo = QUALITY_PRESET_INFO[preset];

        let mode: 'photo' | 'anime' = 'photo';
        if (preset === QualityPreset.ANIME) {
            mode = 'anime';
        }

        onChange({
            ...options,
            mode: mode,
            model: presetInfo.backendModel as any
        });
    };

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-4">

            {/* Scale Selection */}
            <div>
                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
                    Büyütme Oranı
                </label>
                <div className="flex gap-2">
                    {([2, 4, 8, 16] as const).map(scale => {
                        const isLocked = scale === 16 && !can16x;
                        return (
                            <button
                                key={scale}
                                onClick={() => handleScaleChange(scale)}
                                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex flex-col items-center justify-center gap-0.5 ${options.scale === scale
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                    : isLocked
                                        ? 'bg-gray-900/50 text-gray-500 border border-gray-700'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    {scale}x
                                    {isLocked && <Lock className="w-3 h-3" />}
                                </span>
                                <span className="text-[10px] font-normal opacity-70">
                                    {scale === 2 && 'Hızlı'}
                                    {scale === 4 && 'Standart'}
                                    {scale === 8 && 'Yüksek'}
                                    {scale === 16 && 'Ultra'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quality Preset Selection */}
            <div>
                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
                    Görsel Tipi
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(QUALITY_PRESET_INFO).map(([preset, info]) => (
                        <button
                            key={preset}
                            onClick={() => handlePresetChange(preset as QualityPreset)}
                            className={`p-3 rounded-lg transition-all text-center group relative overflow-hidden ${currentPreset === preset
                                ? 'bg-purple-600/20 border-2 border-purple-500 text-white shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]'
                                : 'bg-gray-700/50 border border-gray-700 text-gray-300 hover:bg-gray-700/80 hover:border-gray-600'
                                }`}
                        >
                            <span className="text-xl block mb-1 transform group-hover:scale-110 transition-transform duration-300">{info.icon}</span>
                            <span className="font-medium text-sm block">{info.name}</span>
                            <span className="text-[10px] text-gray-400 block leading-tight mt-1 opacity-80">
                                {preset === 'ANIME'
                                    ? "Çizimler için özel hat koruma. Pürüzsüzleştirir."
                                    : info.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Enhancement Toggles */}
            <div className="space-y-2 pt-2 border-t border-gray-700">
                <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
                    Ek İyileştirmeler
                </label>

                {/* JPEG Artifact Removal */}
                <ToggleOption
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Bozulmaları Temizle"
                    description="JPEG sıkıştırma izlerini kaldır"
                    checked={options.removeArtifacts}
                    locked={!canRemoveArtifacts}
                    onChange={(checked) => {
                        if (!canRemoveArtifacts) {
                            onUpgradeClick?.();
                            return;
                        }
                        onChange({ ...options, removeArtifacts: checked });
                    }}
                />

                {/* Face Enhancement */}
                <ToggleOption
                    icon={<User className="w-4 h-4" />}
                    label="Yüzleri İyileştir"
                    description="Portre fotoğraflarda yüzleri netleştir"
                    checked={options.faceEnhance}
                    locked={!canFaceEnhance}
                    tierBadge="Pro"
                    onChange={(checked) => {
                        if (!canFaceEnhance) {
                            onUpgradeClick?.();
                            return;
                        }
                        onChange({ ...options, faceEnhance: checked });
                    }}
                />

                {/* Remove Background */}
                <ToggleOption
                    icon={<Eraser className="w-4 h-4" />}
                    label="Arka Planı Kaldır"
                    description="Sadece ana objeyi bırak"
                    checked={options.removeBackground}
                    locked={!canRemoveBg}
                    tierBadge="Business"
                    onChange={(checked) => {
                        if (!canRemoveBg) {
                            onUpgradeClick?.();
                            return;
                        }
                        onChange({ ...options, removeBackground: checked });
                    }}
                />
            </div>
        </div>
    );
};

// Toggle Option Component
interface ToggleOptionProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    checked: boolean;
    locked: boolean;
    tierBadge?: string;
    onChange: (checked: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({
    icon, label, description, checked, locked, tierBadge, onChange
}) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${checked
            ? 'bg-purple-600/20 border border-purple-500/50'
            : locked
                ? 'bg-gray-900/30 border border-gray-800'
                : 'bg-gray-700/30 border border-gray-700 hover:bg-gray-700/50'
            }`}
    >
        <div className="flex items-center gap-3">
            <span className={checked ? 'text-purple-400' : 'text-gray-500'}>{icon}</span>
            <div className="text-left">
                <div className="flex items-center gap-2">
                    <span className={`text-sm ${checked ? 'text-white' : locked ? 'text-gray-500' : 'text-gray-300'}`}>
                        {label}
                    </span>
                    {tierBadge && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                            {tierBadge}
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-gray-500">{description}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {locked ? (
                <Lock className="w-4 h-4 text-amber-400" />
            ) : (
                <div className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-gray-600'
                    }`}>
                    <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${checked ? 'ml-5' : 'ml-0.5'
                        }`} />
                </div>
            )}
        </div>
    </button>
);

export default UpscaleOptionsPanel;
