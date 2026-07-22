# make_transparent.py
from PIL import Image

img = Image.open("public/imagelogodiff.PNG").convert("RGBA")
datas = img.getdata()

new_data = []
for item in datas:
    r, g, b, a = item
    # If pixel is close to white, make it transparent
    if r > 240 and g > 240 and b > 240:
        new_data.append((r, g, b, 0))
    else:
        new_data.append((r, g, b, a))

img.putdata(new_data)
img.save("public/logo-transparent.png", "PNG")
print("Done — saved as public/logo-transparent.png")