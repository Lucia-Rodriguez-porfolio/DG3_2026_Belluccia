import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove GSAP translate/opacity inline styles
html = re.sub(r' style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;"', '', html)
html = re.sub(r' style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;color: [^"]+"', '', html)
html = re.sub(r' style="margin: 24px 0 0 0;"', '', html)

# Proceso-cursos inline styles
html = re.sub(r' style="background-color: #C2A995 !important; max-width: 100% !important; width: 100% !important; color: #000000 !important;"', '', html)
html = re.sub(r' style="color: #000; margin-top: 24px;"', '', html)
html = re.sub(r' style="color: #000;"', '', html)
html = re.sub(r' style="color: rgba\(0,0,0,0.2\);"', '', html)
html = re.sub(r' style="font-size: 30px; color: #000; font-family: var\(--font-primary\);"', '', html)
html = re.sub(r' style="color: #000; border-color: #000; display: block; text-align: center; width: 100%;"', ' class="btn-block"', html)

# Capsula inline styles
html = re.sub(r' style="font-size: 46px; line-height: 1.2; color: rgb\(223, 213, 189\);"', '', html)
html = re.sub(r' style="display: block; margin-bottom: 0.5rem; color:#C2A995;"', '', html)
html = re.sub(r' style="padding-left: 4rem; padding-right: 2rem; flex-shrink: 0; width: 30vw; min-width: 320px; margin-bottom: 0;"', '', html)
html = re.sub(r' style="font-weight: 700;"', '', html)
html = re.sub(r' style="font-size: 0.9rem; color: #ccc;"', '', html)

# Tabs section inline styles
html = re.sub(r' style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1; color: rgb\(245, 239, 228\); font-size: 32px; margin-bottom: 24px;"', '', html)
html = re.sub(r' style="display: flex; align-items: center; gap: 16px; background: transparent; border: none; padding: 16px 0; width: 100%; text-align: left; cursor: pointer;"', '', html)
html = re.sub(r' style="font-family: \'Playfair Display\', serif; font-size: 20px; font-weight: 700; color: rgb\(255, 255, 255\); min-width: 30px;"', '', html)
html = re.sub(r' style="margin: 0; font-family: \'DM Sans\', sans-serif; font-size: 18px; color: #fff; flex-grow: 1;"', '', html)
html = re.sub(r' style="padding-left: 46px;"', '', html)
html = re.sub(r' style="color: #20E7B7; text-decoration: none; font-size: 14px; margin-top: 8px; display: inline-block;"', '', html)
html = re.sub(r' style="font-family: \'Playfair Display\', serif; font-size: 20px; font-weight: 700; color: #20E7B7; min-width: 30px;"', '', html)

# Footer styles
html = re.sub(r' style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; width: 100%;"', '', html)
html = re.sub(r' style="height: 30px; width: auto; display: block; object-fit: contain;"', '', html)
html = re.sub(r' style="height: 30px;"', '', html)

# Intro text image styles
html = re.sub(r' style="width: 100%; overflow: hidden; border-radius: var\(--radius-md\); aspect-ratio: 4/3; translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;"', ' class="verde-image-wrapper"', html)
html = re.sub(r' style="width: 100%; height: 100%; object-fit: cover; display: block;"', '', html)
html = re.sub(r' style="width: 100%; overflow: hidden; border-radius: var\(--radius-md\); aspect-ratio: 4/3;"', ' class="verde-image-wrapper"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Done")
