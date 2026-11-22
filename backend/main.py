import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from services.image_processor import (
    decode_image,
    encode_image,
    auto_enhance_image,
    denoise_image,
    detail_enhance_image,
    reduce_blur,
    remove_artifacts,
    invert_image_colors,
    ai_remove_background,
    ai_replace_background,
    ai_blur_background,
    add_text_watermark,
)

app = FastAPI(title="Pixel Studio Processing Engine", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "online", "system": "Pixel Studio FastAPI Core"}


@app.post("/api/enhance")
async def enhance_endpoint(
    file: UploadFile = File(...),
    mode: str = Form("auto"),
    strength: float = Form(10.0),
):
    contents = await file.read()
    img = decode_image(contents)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    if mode == "auto":
        processed = auto_enhance_image(img)
    elif mode == "denoise":
        processed = denoise_image(img, int(strength))
    elif mode == "detail":
        processed = detail_enhance_image(img, amount=strength / 10.0)
    else:
        processed = img

    result_bytes = encode_image(processed)
    return Response(content=result_bytes, media_type="image/png")


@app.post("/api/restore")
async def restore_endpoint(
    file: UploadFile = File(...),
    mode: str = Form("noise"),
):
    contents = await file.read()
    img = decode_image(contents)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    if mode == "blur":
        processed = reduce_blur(img)
    elif mode == "artifacts":
        processed = remove_artifacts(img)
    elif mode == "negative":
        processed = invert_image_colors(img)
    else:
        processed = denoise_image(img, strength=15)

    result_bytes = encode_image(processed)
    return Response(content=result_bytes, media_type="image/png")


@app.post("/api/background")
async def background_endpoint(
    file: UploadFile = File(...),
    action: str = Form("remove"),
    new_color: str = Form("#4F46E5"),
    blur_strength: int = Form(25),
):
    contents = await file.read()

    if action == "remove":
        result_bytes = ai_remove_background(contents)
    elif action == "replace":
        result_bytes = ai_replace_background(contents, new_bg_hex=new_color)
    elif action == "blur":
        result_bytes = ai_blur_background(
            contents, blur_strength=blur_strength)
    else:
        raise HTTPException(
            status_code=400, detail="Unsupported background action")

    return Response(content=result_bytes, media_type="image/png")


@app.post("/api/watermark")
async def watermark_endpoint(
    file: UploadFile = File(...),
    text: str = Form(...),
    font_size: int = Form(36),
    color: str = Form("#FFFFFF"),
    opacity: float = Form(0.8),
    position: str = Form("bottom-right"),
):
    contents = await file.read()
    result_bytes = add_text_watermark(
        img_bytes=contents,
        text=text,
        font_size=font_size,
        color_hex=color,
        opacity=opacity,
        position=position,
    )
    return Response(content=result_bytes, media_type="image/png")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
