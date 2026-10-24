# RePath logo used in 0.2

`repath-logo.png` is the transparent web asset based on the logo image the user selected on 2026-10-24. The existing image and the separate `design/` explorations are preserved.

Processed with the built-in `image_gen` tool, without API/CLI fallback. Selected output: `exec-237bc283-ead3-4186-8f5d-f7c01cd16fe4.png`. It was copied unchanged into the website assets.

## Final prompt for the selected asset

> Edit target: attached RePath logo. Background extraction only. Preserve the EXACT existing logo identity: the light cyan/sky blue R silhouette with a royal-blue curved ribbon/road inside it, and the exact deep navy wordmark 'RePath' with the same letter shapes, thickness, kerning, horizontal alignment and proportions. Remove all white/off-white background, including spaces within letters, replacing it with real alpha transparency. Do not redesign, redraw, add effects, shadows, textures or change any logo colors. Produce the complete horizontal logo centered on a wide transparent canvas, tightly framed with only a small consistent transparent margin (about 3%) around the artwork. Text verbatim: RePath. Output a clean sharp production web logo; preserve exact mark to wordmark ratio.

`branding.mjs` frames transparent padding using an SVG viewport. In the dark theme, CSS tints only the separate wordmark layer white, preserving the blue R. In the light theme it shows the navy original. The symbol-to-wordmark gap is restored in layout to match the reference. No second raster variant is used.

`repath-favicon.svg` is a simplified code-native rendition of the same R for small browser icons. The user-provided brand artwork retains its original rights; the application license does not relicense it.
