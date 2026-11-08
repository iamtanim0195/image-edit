import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import io


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
    """Applies CLAHE (Contrast Limited Adaptive Histogram Equalization) and color balance."""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    enhanced = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    return enhanced


def denoise_image(img: np.ndarray, strength: int = 10) -> np.ndarray:
    """Applies Non-Local Means Denoising."""
    return cv2.fastNlMeansDenoisingColored(img, None, strength, strength, 7, 21)


def detail_enhance_image(img: np.ndarray, amount: float = 1.5) -> np.ndarray:
    """Applies Unsharp Masking for detail sharpening."""
    gaussian = cv2.GaussianBlur(img, (0, 0), 3.0)
    sharpened = cv2.addWeighted(img, 1.0 + amount, gaussian, -amount, 0)
    return sharpened

# --- RESTORATION SERVICES ---


def reduce_blur(img: np.ndarray) -> np.ndarray:
    """Reduces motion and out-of-focus blur using Laplacian sharpening."""
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32)
    return cv2.filter2D(img, -1, kernel)


def remove_artifacts(img: np.ndarray) -> np.ndarray:
    """Bilateral Filter to remove compression artifacts while preserving edges."""
    return cv2.bilateralFilter(img, 9, 75, 75)


def invert_image_colors(img: np.ndarray) -> np.ndarray:
    """Inverts image colors to produce a negative effect (255 - pixel)."""
    return cv2.bitwise_not(img)

# --- BACKGROUND SERVICES ---


def remove_background_by_color(img: np.ndarray, hex_color: str = "#FFFFFF", tolerance: int = 30) -> np.ndarray:
    """Removes a dominant background color within a tolerance range, generating RGBA transparent image."""
    hex_color = hex_color.lstrip('#')
    r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    bg_bgr = np.array([b, g, r], dtype=np.uint8)
    lower_bound = np.clip(bg_bgr - tolerance, 0, 255)
    upper_bound = np.clip(bg_bgr + tolerance, 0, 255)

    mask = cv2.inRange(img, lower_bound, upper_bound)

    rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = np.where(mask > 0, 0, 255)
    return rgba


def replace_background_color(img: np.ndarray, target_hex: str, new_bg_hex: str, tolerance: int = 40) -> np.ndarray:
    """Replaces background color with a specified solid preset color."""
    target_hex = target_hex.lstrip('#')
    tb, tg, tr = tuple(int(target_hex[i:i+2], 16) for i in (4, 2, 0))

    new_bg_hex = new_bg_hex.lstrip('#')
    nb, ng, nr = tuple(int(new_bg_hex[i:i+2], 16) for i in (4, 2, 0))

    lower_bound = np.clip(np.array([tb, tg, tr]) - tolerance, 0, 255)
    upper_bound = np.clip(np.array([tb, tg, tr]) + tolerance, 0, 255)

    mask = cv2.inRange(img, lower_bound, upper_bound)
    result = img.copy()
    result[mask > 0] = [nb, ng, nr]
    return result

# --- TEXT & WATERMARK SERVICES ---


def add_text_watermark(
    img_bytes: bytes,
    text: str,
    font_size: int = 36,
    color_hex: str = "#FFFFFF",
    opacity: float = 0.8,
    position: str = "bottom-right"
) -> bytes:
    """Overlays styled text or watermark onto an image using Pillow (Cross-Platform)."""
    pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
    txt_layer = Image.new("RGBA", pil_img.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(txt_layer)

    # Cross-platform font loader with fallback order for Windows & Linux
    font = None
    font_candidates = [
        "arial.ttf",
        "DejaVuSans.ttf",
        "DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
        "FreeSans.ttf"
    ]

    for font_path in font_candidates:
        try:
            font = ImageFont.truetype(font_path, font_size)
            break
        except (IOError, OSError):
            continue

    if font is None:
        # Fallback if no TTF font is found on the operating system
        font = ImageFont.load_default()

    hex_color = color_hex.lstrip('#')
    r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    alpha = int(opacity * 255)

    # Calculate text bounding box
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
    else:  # bottom-right
        x, y = img_w - text_w - margin, img_h - text_h - margin

    draw.text((x, y), text, font=font, fill=(r, g, b, alpha))
    composite = Image.alpha_composite(pil_img, txt_layer)
    return encode_pil_image(composite.convert("RGB"))
