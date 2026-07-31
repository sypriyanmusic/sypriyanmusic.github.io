# SYPRIYAN PWA — Phase 1 Foundation

Included:
- Installable web app manifest
- LP gold app icons (192, 512, maskable 512)
- Full-screen standalone launch mode
- Install button
- Service worker caching and offline fallback
- Android, iPhone/iPad and desktop home-screen support

## Publish
Upload every file in this folder to the root of the GitHub repository. Do not place them inside another folder. GitHub Pages will publish the update automatically.

## Test
1. Open https://sypriyan.com in Chrome on Android.
2. Wait a few seconds and tap **Install SYPRIYAN**, or use Chrome menu → Add to Home screen.
3. On iPhone/iPad, open Safari → Share → Add to Home Screen.
4. Launch from the new LP icon.

When updating cached files later, change `sypriyan-v1` in `service-worker.js` to `sypriyan-v2`.
