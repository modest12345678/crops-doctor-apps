from PIL import Image, ImageDraw
import os

def crop_to_circle(image_path, output_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        
        # Create a circular mask
        mask = Image.new("L", img.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0) + img.size, fill=255)
        
        # Apply the mask
        result = Image.new("RGBA", img.size, (0, 0, 0, 0))
        result.paste(img, (0, 0), mask=mask)
        
        result.save(output_path)
        print(f"Successfully saved circular logo to: {output_path}")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# Paths
source_logo = r"f:\APPS\Crop-Doctor FINAL\Crop-Doctor\client\public\logo.png"
output_logo = r"f:\APPS\Crop-Doctor FINAL\Crop-Doctor\client\public\logo-circular.png"

crop_to_circle(source_logo, output_logo)
