import os
import sys
import io
import time
import traceback
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch

# --- MONKEY PATCH FIX FOR basicsr/torchvision Incompatibility ---
# basicsr tries to import functional_tensor from torchvision.transforms, which was removed.
# We map it to torchvision.transforms.functional instead.
import torchvision.transforms.functional as F
try:
    from torchvision.transforms import functional_tensor
except ImportError:
    import types
    functional_tensor = types.ModuleType("torchvision.transforms.functional_tensor")
    functional_tensor.rgb_to_grayscale = F.rgb_to_grayscale
    sys.modules["torchvision.transforms.functional_tensor"] = functional_tensor
# ---------------------------------------------------------------

# --- MONKEY PATCH FIX FOR numpy/basicsr Incompatibility ---
import numpy as np
if not hasattr(np, 'float'):
    np.float = float
if not hasattr(np, 'int'):
    np.int = int
if not hasattr(np, 'bool'):
    np.bool = bool
# ----------------------------------------------------------

from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

app = FastAPI(title="PixelScaleAI API")

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Model Cache
model = None
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def load_model():
    global model
    if model is not None:
        return model

    print(f"Loading Real-ESRGAN model on {device}...")
    try:
        # Ensure weights directory exists
        weights_dir = 'weights'
        os.makedirs(weights_dir, exist_ok=True)
        model_path = os.path.join(weights_dir, 'RealESRGAN_x4plus.pth')

        # Download if missing
        if not os.path.exists(model_path):
            print(f"Weights not found at {model_path}. Downloading...")
            try:
                url = 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth'
                with requests.get(url, stream=True) as r:
                    r.raise_for_status()
                    with open(model_path, 'wb') as f:
                        for chunk in r.iter_content(chunk_size=8192):
                            f.write(chunk)
                print("Weights downloaded successfully.")
            except Exception as dl_err:
                 print(f"Download failed: {dl_err}")
                 # Fallback to let library try (it might fail if no internet/permissions)
                 model_path = None

        # RealESRGAN_x4plus architecture
        experiment_model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
        
        model = RealESRGANer(
            scale=4,
            model_path=model_path, 
            model=experiment_model,
            tile=0,  # 0 for auto-tile (saves VRAM)
            tile_pad=10,
            pre_pad=0,
            half=True if device.type == 'cuda' else False,
            gpu_id=0 if device.type == 'cuda' else None
        )
        print("Model loaded successfully!")
        return model
    except Exception as e:
        print(f"Failed to load model: {e}")
        traceback.print_exc()
        return None

@app.on_event("startup")
async def startup_event():
    # Preload model on startup
    load_model()

@app.post("/upscale")
async def upscale_image(
    file: UploadFile = File(...), 
    scale: int = Form(4),
    quality_tier: str = Form("free")
):
    try:
        start_time = time.time()
        
        # Read Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        print(f"Processing image: {image.size} - Scale: {scale}x - Tier: {quality_tier}")

        # 1. Tier & Resolution Checks
        if quality_tier == "free":
            # Cap max resolution for free users to prevent abuse
            max_pixels = 2000 * 2000 # 4MP limit input
            if image.width * image.height > max_pixels:
                 # Downscale input if too large
                 ratio = (max_pixels / (image.width * image.height)) ** 0.5
                 new_size = (int(image.width * ratio), int(image.height * ratio))
                 image = image.resize(new_size, Image.Resampling.LANCZOS)
                 print(f"Free tier input resized to {new_size}")

        # 2. Upscaling
        upscaler = load_model()
        if not upscaler:
            raise HTTPException(status_code=500, detail="Model not loaded")

        # Inference
        # outscale=scale param allows outputting at specific 2x/4x/8x regardless of model native scale
        output, _ = upscaler.enhance(np.array(image), outscale=scale)
        
        # Convert back to PIL
        output_image = Image.fromarray(output)

        # 3. Save to Buffer
        buf = io.BytesIO()
        output_image.save(buf, format="PNG")
        buf.seek(0)
        
        duration = time.time() - start_time
        print(f"Upscale complete in {duration:.2f}s")

        return Response(content=buf.getvalue(), media_type="image/png")

    except Exception as e:
        print(f"Upscale Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {"status": "PixelScaleAI AI Online", "device": str(device)}

if __name__ == "__main__":
    import uvicorn
    import numpy as np # Implicit dependency for RealESRGANer
    uvicorn.run(app, host="0.0.0.0", port=8001) # Port 8001 to avoid conflict with VormPixyze

