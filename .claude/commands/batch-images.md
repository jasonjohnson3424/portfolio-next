# Batch Images

Convert and resize a folder of source images to WebP for a specific project slug.

Usage: `/batch-images --slug <project-slug> --folder <path-to-source-folder>`

- `--slug`: Project slug matching the projects.js entry (e.g. `teksystems-elearning-levels`). Required.
- `--folder`: Absolute path to the folder containing source images. Required. Lives outside the repo scope.

## Naming Convention

Output files follow this pattern: `<slug>_<purpose>_<optional-number>.webp`

Examples:
- `teksystems-elearning-levels_card.webp`
- `teksystems-elearning-levels_carousel_1.webp`
- `teksystems-elearning-levels_carousel_2.webp`
- `teksystems-elearning-levels_article-float_1.webp`
- `teksystems-elearning-levels_article-center_1.webp`

Source files in `--folder` should be pre-named using the purpose segment:
- `card.png` → `<slug>_card.webp`
- `carousel_1.jpg` → `<slug>_carousel_1.webp`
- `article-float_1.png` → `<slug>_article-float_1.webp`
- `article-center_1.png` → `<slug>_article-center_1.webp`

## File Types and Dimensions

| Purpose        | Width | Height | Ratio | Fit     | Notes                                      |
|----------------|-------|--------|-------|---------|--------------------------------------------|
| card           | 640   | 360    | 16:9  | cover   | Project grid thumbnail — optimize always   |
| carousel       | 1920  | 1080   | 16:9  | inside  | Carousel slides + lightbox — full res      |
| article-float  | 1920  | 1440   | 4:3   | inside  | Left/right inline images — lightbox-first  |
| article-center | 1920  | 960    | 2:1   | inside  | Centered inline images — lightbox-first    |

**Notes:**
- `card` uses `fit: cover` — crops from center to enforce 16:9. Source should be landscape.
- All others use `fit: inside` — preserves natural ratio up to max dimensions. No cropping.
- `_hero` is not a separate file — use `_carousel_1` resized via CSS or derived at build time.
- `_poster` (video thumbnail) reuses `_card` dimensions — name the file `_card` and reference it as the video poster attribute.

## Steps

1. Resolve params. If `--slug` or `--folder` is missing, ask the user.

2. Read all image files in `--folder` (PNG, JPG, WebP). List them and confirm with the user before proceeding.

3. For each file, parse the purpose from the filename stem:
   - Strip any extension
   - Map to dimensions and fit mode from the table above
   - If purpose is unrecognized, warn the user and skip that file

4. Create output directory `app/public/` if it doesn't exist (it should already).
   - Output files go directly into `app/public/` — no slug subfolder.

5. Run conversion for all files via a single Node/sharp script:
   ```bash
   cd "C:/Users/jason/Documents/Apps/jasonljohnson-com_Personal-Portfolio/portfolio-next/app" && node -e "
   const sharp = require('sharp');
   const jobs = [
     // { input, output, width, height, fit }
   ];
   Promise.all(jobs.map(j =>
     sharp(j.input)
       .resize({ width: j.width, height: j.height, fit: j.fit })
       .webp({ quality: 85 })
       .toFile(j.output)
       .then(i => console.log('✓ ' + j.output + ' ' + i.width + 'x' + i.height))
   )).catch(console.error);
   "
   ```

6. Report each output file, its final dimensions, and any skipped files.

7. Do not commit — leave staging to the user.
