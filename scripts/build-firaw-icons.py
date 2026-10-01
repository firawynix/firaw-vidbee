"""Generate original Firaw - VidBee icons from vector-like geometry."""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SIZE = 1024
SCALE = 2
canvas = Image.new("RGBA", (SIZE * SCALE, SIZE * SCALE), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)

def point(x, y):
    return (round(x * SCALE), round(y * SCALE))

draw.rounded_rectangle(
    [point(34, 34), point(990, 990)],
    radius=215 * SCALE,
    fill="#0c1726",
    outline="#2488a4",
    width=18 * SCALE,
)
draw.rounded_rectangle(
    [point(80, 80), point(944, 944)],
    radius=175 * SCALE,
    outline="#1b465b",
    width=7 * SCALE,
)

# The Firaw terminal arrow becomes a play mark and ends in a download line.
cyan = "#34d2ee"
draw.line([point(226, 313), point(482, 510), point(226, 706)], fill=cyan, width=76 * SCALE, joint="curve")
for x, y in [(226, 313), (482, 510), (226, 706)]:
    r = 38 * SCALE
    px, py = point(x, y)
    draw.ellipse((px-r, py-r, px+r, py+r), fill=cyan)
draw.polygon([point(565, 324), point(809, 510), point(565, 696)], fill="#55dbef")
draw.rounded_rectangle([point(306, 785), point(718, 835)], radius=25*SCALE, fill="#17b8d6")

icon = canvas.resize((SIZE, SIZE), Image.Resampling.LANCZOS)
paths = [
    ROOT / "apps/desktop/build/icon.png",
    ROOT / "apps/desktop/resources/icon.png",
    ROOT / "apps/desktop/src/renderer/public/app-icon.png",
    ROOT / "apps/desktop/src/renderer/src/assets/app-icon.png",
    ROOT / "apps/web/public/app-icon.png",
    ROOT / "apps/web/public/logo512.png",
]
for path in paths:
    path.parent.mkdir(parents=True, exist_ok=True)
    icon.save(path)

icon.resize((192, 192), Image.Resampling.LANCZOS).save(ROOT / "apps/web/public/logo192.png")
icon.save(ROOT / "apps/desktop/build/icon.ico", sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
icon.save(ROOT / "apps/web/public/favicon.ico", sizes=[(16,16),(32,32),(48,48),(64,64)])
icon.save(ROOT / "apps/desktop/build/icon.icns")
icon.resize((256, 256), Image.Resampling.LANCZOS).save(ROOT / "apps/desktop/resources/tray-icon.png")

appx = ROOT / "apps/desktop/build/appx"
appx.mkdir(parents=True, exist_ok=True)
for name, dimensions in {
    "StoreLogo.png": (50, 50),
    "Square44x44Logo.png": (44, 44),
    "Square150x150Logo.png": (150, 150),
    "Wide310x150Logo.png": (310, 150),
}.items():
    tile = Image.new("RGBA", dimensions, "#0c1726")
    scale = min(dimensions) * 0.86
    mark = icon.resize((round(scale), round(scale)), Image.Resampling.LANCZOS)
    tile.alpha_composite(mark, ((dimensions[0] - mark.width)//2, (dimensions[1] - mark.height)//2))
    tile.save(appx / name)
