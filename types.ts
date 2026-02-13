export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  credits: number;
  premiumTier?: PremiumTier;
}

export enum AppState {
  LANDING = 'landing',
  PROCESSING = 'processing',
  RESULT = 'result',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  CONTACT = 'contact'
}

export interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  createdAt: number;
}

// --- TIER SYSTEM ---

export interface UserStats {
  credits: number;
  isPremium: boolean;
  lastResetDate: string; // YYYY-MM-DD
  premiumExpiryDate?: string;
  dailyLimit?: number;
  premiumTier?: PremiumTier;
}

export type PremiumTier = 'starter' | 'pro' | 'business';

export const MAX_FREE_CREDITS = 10;  // Günlük ücretsiz kredi
export const COST_PER_UPSCALE = 1;
export const REFERRAL_BONUS = 3;     // Referans bonusu (her iki tarafa)

export const TIER_LEVELS: Record<string, number> = {
  'free': 0,
  'starter': 1,
  'pro': 2,
  'business': 3
};

// Tier-specific benefits
export const TIER_BENEFITS: Record<PremiumTier | 'free', {
  speedMultiplier: number;
  speedLabel: string;
  credits: number;
  maxUpscale: number;
  batchLimit: number;
  hasHistory: boolean;
  hasApi: boolean;
}> = {
  'free': {
    speedMultiplier: 1,
    speedLabel: 'Normal Hız',
    credits: 10,       // Günlük
    maxUpscale: 4,
    batchLimit: 1,
    hasHistory: false,
    hasApi: false
  },
  'starter': {
    speedMultiplier: 1,
    speedLabel: 'Normal Hız',
    credits: 75,       // Tek seferlik
    maxUpscale: 8,
    batchLimit: 1,
    hasHistory: false,
    hasApi: false
  },
  'pro': {
    speedMultiplier: 2,
    speedLabel: '2x Hızlı',
    credits: 200,      // Tek seferlik
    maxUpscale: 8,
    batchLimit: 5,
    hasHistory: true,
    hasApi: false
  },
  'business': {
    speedMultiplier: 4,
    speedLabel: '4x Hızlı',
    credits: 600,      // Tek seferlik
    maxUpscale: 16,
    batchLimit: 20,
    hasHistory: true,
    hasApi: true
  }
};

// Feature access requirements (min tier level)
export const FEATURE_REQUIREMENTS: Record<string, number> = {
  'BASIC_UPSCALE': 0,      // Free
  '8X_UPSCALE': 1,         // Starter+
  'BATCH_UPLOAD': 1,       // Starter+
  'NO_ADS': 1,             // Starter+
  'CROP': 2,               // Pro+
  'HISTORY': 2,            // Pro+
  'ANIME_MODE': 2,         // Pro+
  'AI_MODEL_SELECT': 2,    // Pro+
  'ARTIFACT_REMOVAL': 2,   // Pro+
  '16X_UPSCALE': 3,        // Business
  'REMOVE_BG': 3,          // Business
  'FACE_ENHANCE': 3,       // Business
  'API_ACCESS': 3          // Business
};

/**
 * Check if user tier has access to feature
 */
export function hasFeatureAccess(tier: PremiumTier | undefined, feature: string): boolean {
  const userLevel = tier ? TIER_LEVELS[tier] ?? 0 : 0;
  const requiredLevel = FEATURE_REQUIREMENTS[feature] ?? 0;
  return userLevel >= requiredLevel;
}

// --- QUALITY PRESETS (User-Friendly) ---

export enum QualityPreset {
  STANDARD = 'standard',
  HIGH = 'high',
  ANIME = 'anime'
}

export const QUALITY_PRESET_INFO: Record<QualityPreset, {
  name: string;
  description: string;
  icon: string;
  backendModel: string;
}> = {
  [QualityPreset.STANDARD]: {
    name: 'Standart',
    description: 'Dengeli hız ve kalite',
    icon: '⚡',
    backendModel: 'real-esrgan'
  },
  [QualityPreset.HIGH]: {
    name: 'Yüksek Kalite',
    description: 'En iyi sonuç, daha uzun süre',
    icon: '✨',
    backendModel: 'real-esrgan'
  },
  [QualityPreset.ANIME]: {
    name: 'Anime & Çizim',
    description: 'Anime ve illüstrasyonlar için',
    icon: '🎌',
    backendModel: 'anime-4x'
  }
};

// Legacy enums for backward compatibility
export enum AIModel {
  REAL_ESRGAN = 'real-esrgan',
  ANIME_4X = 'anime-4x'
}

export enum UpscaleMode {
  PHOTO = 'photo',
  ANIME = 'anime'
}

// --- UPSCALE OPTIONS ---

export interface UpscaleOptions {
  scale: 2 | 4 | 8 | 16;
  mode: UpscaleMode;
  model: AIModel;
  removeArtifacts: boolean;
  faceEnhance: boolean;
  removeBackground: boolean;
}

export const DEFAULT_UPSCALE_OPTIONS: UpscaleOptions = {
  scale: 4,
  mode: UpscaleMode.PHOTO,
  model: AIModel.REAL_ESRGAN,
  removeArtifacts: false,
  faceEnhance: false,
  removeBackground: false
};

// Pricing Plan Interface (for PricingModal)
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  credits: number;
  features: string[];
  recommended?: boolean;
}