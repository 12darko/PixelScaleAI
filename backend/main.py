import os
import io
import time
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
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
        # Use RealESRGAN_x4plus model
        model_path = os.path.join('weights', 'RealESRGAN_x4plus.pth')
        
        # Auto-download weights if missing (realesrgan package handles this usually, but we can be explicit)
        # For now relying on library defaults or pre-downloaded weights
        
        # RealESRGAN_x4plus architecture
        experiment_model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
        
        model = RealESRGANer(
            scale=4,
            model_path=None, # None triggers download/cache check by library
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

