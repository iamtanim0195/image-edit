import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from rembg import remove, new_session
import io

# Lazy-loaded session so Render starts fast and stays within 512MB RAM
_REMBG_SESSION = None


def get_rembg_session():
    global _REMBG_SESSION
    if _REMBG_SESSION is None:
        _REMBG_SESSION = new_session("u2netp")
    return _REMBG_SESSION


def _resize_for_ai(pil_img: Image.Image, max_dim: int = 1024) -> Image.Image:
    """Downscales very large images before AI segmentation to prevent Render 512MB RAM OOM."""
    w, h = pil_img.size
    if max(w, h) <= max_dim:
        return pil_img
    scale = max_dim / float(max(w, h))
    new_size = (int(w * scale), int(h * scale))
    return pil_img.resize(new_size, Image.Resampling.LANCZOS)


def decode_image(image_bytes: bytes) -> np.ndarray:
    """Converts uploaded bytes to an OpenCV BGR numpy array."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


def encode_image(img: np.ndarray, format_ext: str = ".png") -> bytes:
    """Encodes OpenCV image array to raw image bytes."""
    _, buffer = cv2.imencode(format_ext, img)
    return buffer.tobytes()


def encode_pil_image(img_pil: Image.Image, format_str: str = "PNG") -> bytes:
    """Encodes PIL Image to bytes."""
    buf = io.BytesIO()
    img_pil.save(buf, format=format_str)
    return buf.getvalue()


# --- ENHANCEMENT SERVICES ---
def auto_enhance_image(img: np.ndarray) -> np.ndarray:
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)


def denoise_image(img: np.ndarray, strength: int = 10) -> np.ndarray:
    return cv2.fastNlMeansDenoisingColored(img, None, strength, strength, 7, 21)


def detail_enhance_image(img: np.ndarray, amount: float = 1.5) -> np.ndarray:
    gaussian = cv2.GaussianBlur(img, (0, 0), 3.0)
    return cv2.addWeighted(img, 1.0 + amount, gaussian, -amount, 0)


# --- RESTORATION SERVICES ---
def reduce_blur(img: np.ndarray) -> np.ndarray:
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
    return cv2.filter2D(img, -1, kernel)


def remove_artifacts(img: np.ndarray) -> np.ndarray:
    return cv2.bilateralFilter(img, 9, 75, 75)


def invert_image_colors(img: np.ndarray) -> np.ndarray:
    return cv2.bitwise_not(img)


# --- AI BACKGROUND SERVICES ---
def ai_remove_background(image_bytes: bytes) -> bytes:
    """Uses AI U2-NetP segmentation to detect people/subjects and output a transparent PNG."""
    input_pil = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    orig_size = input_pil.size
    resized_pil = _resize_for_ai(input_pil, max_dim=1024)

    output_pil = remove(resized_pil, session=get_rembg_session())
    if output_pil.size != orig_size:
        output_pil = output_pil.resize(orig_size, Image.Resampling.LANCZOS)

    return encode_pil_image(output_pil, format_str="PNG")


def ai_replace_background(image_bytes: bytes, new_bg_hex: str = "#4F46E5") -> bytes:
    """Removes background via AI and composites the subject onto a solid color background."""
    input_pil = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    orig_size = input_pil.size
    resized_pil = _resize_for_ai(input_pil, max_dim=1024)

    fg_pil = remove(resized_pil, session=get_rembg_session())
    if fg_pil.size != orig_size:
        fg_pil = fg_pil.resize(orig_size, Image.Resampling.LANCZOS)

    new_bg_hex = new_bg_hex.lstrip("#")
    r, g, b = tuple(int(new_bg_hex[i: i + 2], 16) for i in (0, 2, 4))

    bg_pil = Image.new("RGBA", fg_pil.size, (r, g, b, 255))
    composite = Image.alpha_composite(bg_pil, fg_pil)
    return encode_pil_image(composite.convert("RGB"), format_str="PNG")


def ai_blur_background(image_bytes: bytes, blur_strength: int = 25) -> bytes:
    """Creates a DSLR Portrait Bokeh effect by blurring the background while keeping the person sharp."""
    ksize = max(3, blur_strength if blur_strength %
                2 == 1 else blur_strength + 1)

    input_pil = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    orig_size = input_pil.size
    resized_pil = _resize_for_ai(input_pil, max_dim=1024)

    fg_pil = remove(resized_pil, session=get_rembg_session())
    if fg_pil.size != orig_size:
        fg_pil = fg_pil.resize(orig_size, Image.Resampling.LANCZOS)
    fg_np = np.array(fg_pil)

    orig_bgr = decode_image(image_bytes)
    blurred_bgr = cv2.GaussianBlur(orig_bgr, (ksize, ksize), 0)
    blurred_rgb = cv2.cvtColor(blurred_bgr, cv2.COLOR_BGR2RGB)

    alpha = fg_np[:, :, 3:4].astype(np.float32) / 255.0
    fg_rgb = fg_np[:, :, :3].astype(np.float32)
    bg_rgb = blurred_rgb.astype(np.float32)

    blended = (fg_rgb * alpha + bg_rgb * (1.0 - alpha)).astype(np.uint8)
    result_pil = Image.fromarray(blended)
    return encode_pil_image(result_pil, format_str="PNG")


# --- TEXT & WATERMARK SERVICES ---
def add_text_watermark(
    img_bytes: bytes,
    text: str,
    font_size: int = 36,
    color_hex: str = "#FFFFFF",
    opacity: float = 0.8,
    position: str = "bottom-right",
) -> bytes:
    pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
    txt_layer = Image.new("RGBA", pil_img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_layer)

    font = None
    font_candidates = [
        "arial.ttf",
        "DejaVuSans.ttf",
        "DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "FreeSans.ttf",
    ]

    for font_path in font_candidates:
        try:
            font = ImageFont.truetype(font_path, font_size)
            break
        except (IOError, OSError):
            continue

    if font is None:
        font = ImageFont.load_default()

    hex_color = color_hex.lstrip("#")
    r, g, b = tuple(int(hex_color[i: i + 2], 16) for i in (0, 2, 4))
    alpha = int(opacity * 255)

    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    img_w, img_h = pil_img.size
    margin = 20

    if position == "center":
        x = (img_w - text_w) // 2
        y = (img_h - text_h) // 2
    elif position == "top-left":
        x, y = margin, margin
    elif position == "top-right":
        x, y = img_w - text_w - margin, margin
    elif position == "bottom-left":
        x, y = margin, img_h - text_h - margin
    else:
        x, y = img_w - text_w - margin, img_h - text_h - margin

    draw.text((x, y), text, font=font, fill=(r, g, b, alpha))
    composite = Image.alpha_composite(pil_img, txt_layer)
    return encode_pil_image(composite.convert("RGB"))
