const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Remove GSAP translate/opacity inline styles
html = html.replace(/ style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;"/g, '');

// Clean up p margin inline styles
html = html.replace(/ style="margin: 24px 0 0 0;"/g, '');

// Proceso-cursos inline styles
html = html.replace(/ style="background-color: #C2A995 !important; max-width: 100% !important; width: 100% !important; color: #000000 !important;"/g, '');

// Proceso-cursos text color inline styles
html = html.replace(/ style="color: #000; margin-top: 24px;"/g, '');
html = html.replace(/ style="color: #000;"/g, '');
html = html.replace(/ style="color: rgba\(0,0,0,0.2\);"/g, '');
html = html.replace(/ style="font-size: 30px; color: #000; font-family: var\(--font-primary\);"/g, '');
html = html.replace(/ style="color: #000; border-color: #000; display: block; text-align: center; width: 100%;"/g, ' class="btn-block"');

// Capsula inline styles
html = html.replace(/ style="font-size: 46px; line-height: 1.2; color: rgb\(223, 213, 189\);"/g, '');
html = html.replace(/ style="display: block; margin-bottom: 0.5rem; color:#C2A995;"/g, '');
html = html.replace(/ style="padding-left: 4rem; padding-right: 2rem; flex-shrink: 0; width: 30vw; min-width: 320px; margin-bottom: 0;"/g, '');
html = html.replace(/ style="font-weight: 700;"/g, '');
html = html.replace(/ style="font-size: 0.9rem; color: #ccc;"/g, '');

// Tabs section inline styles
html = html.replace(/ style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1; color: rgb\(245, 239, 228\); font-size: 32px; margin-bottom: 24px;"/g, '');
html = html.replace(/ style="display: flex; align-items: center; gap: 16px; background: transparent; border: none; padding: 16px 0; width: 100%; text-align: left; cursor: pointer;"/g, '');
html = html.replace(/ style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: rgb\(255, 255, 255\); min-width: 30px;"/g, '');
html = html.replace(/ style="margin: 0; font-family: 'DM Sans', sans-serif; font-size: 18px; color: #fff; flex-grow: 1;"/g, '');
html = html.replace(/ style="padding-left: 46px;"/g, '');
html = html.replace(/ style="color: #20E7B7; text-decoration: none; font-size: 14px; margin-top: 8px; display: inline-block;"/g, '');
html = html.replace(/ style="font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #20E7B7; min-width: 30px;"/g, '');

// Footer styles
html = html.replace(/ style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; width: 100%;"/g, '');
html = html.replace(/ style="height: 30px; width: auto; display: block; object-fit: contain;"/g, '');
html = html.replace(/ style="height: 30px;"/g, '');

// Intro text image styles (keep aspect ratio, but remove transforms)
html = html.replace(/ style="width: 100%; overflow: hidden; border-radius: var\(--radius-md\); aspect-ratio: 4\/3; translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;"/g, ' class="verde-image-wrapper"');
html = html.replace(/ style="width: 100%; height: 100%; object-fit: cover; display: block;"/g, '');
html = html.replace(/ style="width: 100%; overflow: hidden; border-radius: var\(--radius-md\); aspect-ratio: 4\/3;"/g, ' class="verde-image-wrapper"');

fs.writeFileSync('index.html', html);
console.log("Done");

