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


def update_json_key(keys_path, new_value):
    json_file_path = sys.argv[1]
    
    try:
        # Open the JSON file for reading
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)

        # Traverse the nested dictionary to reach the desired key
        current = data
        for key in keys_path[:-1]:
            if key in current:
                current = current[key]
            else:
                raise KeyError(f"Key '{key}' not found in the JSON structure")

        # Update the specified key with the new value
        current[keys_path[-1]] = new_value

        # Write the updated data back to the JSON file
        with open(json_file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)

        print(f"Updated '{keys_path}' in '{json_file_path}' to '{new_value}'")
    except FileNotFoundError:
        print(f"File '{json_file_path}' not found.")
    except KeyError as e:
        print(f"Key error: {str(e)}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")



def get_current_utc_timestamp():
    # Get the current UTC time
    current_utc_time = datetime.datetime.utcnow()

    # Format it as a UTC timestamp string
    utc_timestamp_str = current_utc_time.strftime('%a, %d %b %Y %H:%M:%S GMT')

    return utc_timestamp_str


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
update_json_key(["quote-data", "quote"], text);

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

update_json_key(["quote-data", "author"], get_author())

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

# Update change time
update_json_key(["time-data", "last-change"], get_current_utc_timestamp())