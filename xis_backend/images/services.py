from PIL import Image as PILImage, UnidentifiedImageError
import io, math

def analyze_image(file) -> dict:
    try:
        file.seek(0)
        data = file.read()

        if not data:
            return {"error": "Empty file"}

        size_kb = round(len(data) / 1024, 2)

        # Open image safely
        img = PILImage.open(io.BytesIO(data)).convert("RGB")
        width, height = img.size

        # Downsample for performance
        thumb = img.resize((100, 100))
        pixels = list(thumb.getdata())

        total_pixels = len(pixels)

        # ── RGB Averages ──
        r_avg = sum(p[0] for p in pixels) / total_pixels
        g_avg = sum(p[1] for p in pixels) / total_pixels
        b_avg = sum(p[2] for p in pixels) / total_pixels

        brightness = (r_avg + g_avg + b_avg) / 3

        # ── Contrast (std dev of luminance) ──
        lum = [(p[0]*0.299 + p[1]*0.587 + p[2]*0.114) for p in pixels]
        mean_lum = sum(lum) / total_pixels
        contrast = math.sqrt(sum((l - mean_lum) ** 2 for l in lum) / total_pixels)

        # ── Saturation ──
        sat_vals = []
        for r, g, b in pixels:
            mx = max(r, g, b)
            mn = min(r, g, b)
            sat_vals.append((mx - mn) / mx if mx > 0 else 0)

        saturation = sum(sat_vals) / total_pixels

        # ── Aspect Ratio ──
        aspect = width / height if height > 0 else 1

        # ── Orientation ──
        if aspect > 1.6:
            orientation = "landscape"
        elif aspect < 0.7:
            orientation = "portrait"
        else:
            orientation = "square"

        # ── Label Logic ──
        if brightness < 60:
            label = "Dark Scene"
        elif brightness > 200:
            label = "Bright Scene"
        elif saturation < 0.1:
            label = "Monochrome"
        elif contrast > 60:
            if r_avg > g_avg and r_avg > b_avg:
                label = "High-Contrast Warm"
            else:
                label = "High-Contrast"
        elif r_avg > g_avg + 20 and r_avg > b_avg + 20:
            label = "Warm Tones"
        elif b_avg > r_avg + 20 and b_avg > g_avg + 10:
            label = "Cool Tones"
        elif g_avg > r_avg + 15 and g_avg > b_avg + 15:
            label = "Nature / Green"
        elif saturation > 0.45:
            label = "Vibrant"
        elif aspect > 1.6:
            label = "Wide Landscape"
        elif aspect < 0.7:
            label = "Portrait"
        else:
            label = "Balanced"

        return {
            "size_kb": size_kb,
            "width": width,
            "height": height,
            "aspect_ratio": round(aspect, 2),
            "orientation": orientation,

            "brightness": round(brightness, 2),
            "contrast": round(contrast, 2),
            "saturation": round(saturation, 3),

            "dominant_color": {
                "r": int(r_avg),
                "g": int(g_avg),
                "b": int(b_avg)
            },

            "label": label
        }

    except UnidentifiedImageError:
        return {"error": "Invalid image file"}

    except Exception as e:
        return {"error": str(e)}