# Importing libraries
from PIL import Image, ImageFont, ImageDraw, ImageGrab
import requests
import json
import os
import datetime
import ctypes
import json
import sys

def hex_to_rgba(hex_color):
    hex_color = hex_color.lstrip("#")
    if len(hex_color) == 6:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        a = 255  # Default alpha value if not provided
    elif len(hex_color) == 8:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        a = int(hex_color[6:8], 16)
    else:
        raise ValueError("Invalid hex color code")
    return r, g, b, a

# Vars
CONFIG = json.load(open(sys.argv[1], "r"));

font_size = int(CONFIG["settings"]["text"]["size"])
_text_color_hex = "#" + CONFIG["settings"]["text"]["color"]
text_color = hex_to_rgba(_text_color_hex)

display_author = CONFIG["settings"]["display-author"]
author_offset = int(CONFIG["settings"]["author-quote-offset"])


# Functions
def get_pixel_size(font_size: int, text: str, ppi: int = 72) -> int:
    return int(((font_size*ppi)/72))


def get_quote() -> str:
    response = requests.get("https://zenquotes.io/api/today")
    return json.loads(response.text.replace("[", "").replace("]", ""))["q"]


def get_author() -> str:
    response = requests.get("https://zenquotes.io/api/today")
    return json.loads(response.text.replace("[", "").replace("]", ""))["a"]


# Get screen size
screen = ImageGrab.grab()
screen_size = screen.size 
screen = None

if not CONFIG["settings"]["wallpaper-size"]["width"] == "screen":
    width = int(CONFIG["settings"]["wallpaper-size"]["width"])
else:
    width = screen_size[0]

if not CONFIG["settings"]["wallpaper-size"]["height"] == "screen":
    height = int(CONFIG["settings"]["wallpaper-size"]["height"])
else:
    height = screen_size[1]

print(f"Screen Size: {width}x{height}")

# Load font
font = ImageFont.truetype(CONFIG["settings"]["quote-font"], font_size)

# Draw a black image
bg_image = Image.new("RGBA", (width, height), color=(0, 0, 0, 255))
image = Image.new("RGBA", (width, height))
draw = ImageDraw.Draw(image)

# Draw text to image
text = get_quote()
print(f"Quote: {text}")

# Get text size
text_box = draw.textbbox((0, 0), text, font=font)
text_size = text_box[2], text_box[3]
text_position = (screen_size[0]//2 - text_size[0]//2, screen_size[1]//2 + text_size[1]//2)

print(f"Text Size: {text_size}")

# Draw the text
draw.text(text_position, text, align="center", font=font, fill=text_color)

if display_author:
    # Do same with author name
    author_text = f"{' ' * (len(text) - len(get_author()))}- " + get_author()
    print(f"Author: {author_text}")

    font = ImageFont.truetype(CONFIG["settings"]["author-font"], font_size)

    # Get text size
    author_text_box = draw.textbbox((0, 0), text, font=font)
    author_text_size = author_text_box[2], author_text_box[3]
    text_position = (screen_size[0]//2, screen_size[1]//2 + text_size[1] + author_text_size[1]//2 + author_offset)

    print(f"Text Size: {text_size}")

    # Draw the text
    draw.text(text_position, author_text, align="center", font=font, fill=text_color)

dir_path = f"C:\\Users\\{os.getlogin()}\\Pictures\\Sentic"
if not os.path.exists(dir_path):
    os.makedirs(dir_path)

file_name = dir_path + f"\\Quote_{datetime.datetime.now().strftime('%d-%m-%Y')}.png"

imageF = Image.alpha_composite(bg_image, image)

imageF.save(file_name)

# Set the wallpaper

SPI_SETDESKWALLPAPER = 20
WALLPAPER_PATH = file_name  # Replace with the actual path to your image

# Set the wallpaper
ctypes.windll.user32.SystemParametersInfoW(SPI_SETDESKWALLPAPER, 0, WALLPAPER_PATH, 3)