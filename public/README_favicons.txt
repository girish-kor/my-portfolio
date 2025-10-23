Place your favicon and app icons in this `public/` directory so they're served from the site root.

Recommended files (create these with a favicon generator):
- favicon-32x32.png
- favicon-16x16.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png
- favicon.ico (multi-size ICO)

Quick steps:
1. Generate icons from a high-resolution source image (e.g. 1024x1024 PNG) using realfavicongenerator.net or favicon.io.
2. Download the generated icons and place them in this `public/` folder.
3. Build and run the site locally and hard-refresh the browser (Ctrl+Shift+R) to load the new icons.

Notes:
- The `site.webmanifest` references android-chrome PNGs; update it if your filenames differ.
- Browsers aggressively cache favicons. If updated icons don't appear, try an incognito window or clear the cache.
