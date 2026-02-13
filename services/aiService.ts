// PixelScaleAI Service (Server-Based)
// Connects to the Python FastApi backend for Real-ESRGAN processing

import { UpscaleOptions, PremiumTier } from '../types';

export interface UpscaleResult {
  success: boolean;
  imageBase64?: string;
  processingTimeMs: number;
  usedFallback: boolean;
  error?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

/**
 * Main upscale function
 */
export const upscaleImage = async (
  file: File,
  options: Partial<UpscaleOptions> = {},
  userTier: PremiumTier = 'free'
): Promise<string> => {
  const fileBlob = file;
  const startTime = Date.now();

  try {
    const formData = new FormData();
    formData.append('file', fileBlob);
    formData.append('scale', options.scale?.toString() || '4');
    formData.append('quality_tier', userTier);

    // Call Backend
    const response = await fetch(`${API_URL}/upscale`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server Error: ${errText}`);
    }

    const blob = await response.blob();

    // Convert Blob to Base64 for display
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error: any) {
    console.error("Upscale failed:", error);
    throw new Error(error.message || "Upscaling failed on server.");
  }
};

/**
 * Health Check
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/`);
    return res.ok;
  } catch (e) {
    return false;
  }
};