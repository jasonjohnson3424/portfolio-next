# Batch Images

Convert and resize a folder of source images to WebP for a specific project slug.

Usage: `/batch-images --slug <project-slug> --folder <path-to-source-folder>`

- `--slug`: Project slug matching the projects.js entry (e.g. `teksystems-elearning-levels`). Required.
- `--folder`: Absolute path to the folder containing source images. Required. Lives outside the repo scope.

## Naming Convention

Output files follow this pattern: `<slug>_<purpose>.webp`

Source files may be `.jpeg`, `.jpg`, or `.png` — all output as `.webp`.

Examples (output path: `public/<slug>/<slug>_<purpose>.webp`):

- `public/teksystems-elearning-levels/teksystems-elearning-levels_card.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_carousel-1.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_carousel-2.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_article-1.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_article-2.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_float-l-1.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_float-l-2.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_float-r-1.webp`
- `public/teksystems-elearning-levels/teksystems-elearning-levels_float-r-2.webp`

Source files in `--folder` should be pre-named using the purpose segment:

- `card.png` → `<slug>_card.webp`
- `carousel-1.jpg` → `<slug>_carousel-1.webp`
- `article-1.png` → `<slug>_article-1.webp` _(default — 4:3, centered, 75% width)_
- `article-2.jpg` → `<slug>_article-2.webp`
- `article-wide-1.png` → `<slug>_article-wide-1.webp` _(2:1, centered, full width)_
- `article-wide-2.jpg` → `<slug>_article-wide-2.webp`
- `float-l-1.png` → `<slug>_float-l-1.webp` _(float left, first image)_
- `float-l-2.jpeg` → `<slug>_float-l-2.webp` _(float left, second image)_
- `float-r-1.jpg` → `<slug>_float-r-1.webp` _(float right, first image)_
- `float-r-2.png` → `<slug>_float-r-2.webp` _(float right, second image)_

**Layout intent:**

- `article-*` — default. Centered, full-width, cleared. Used for most inline images.
- `float-l-*` / `float-r-*` — special use only. Floated beside text when an image directly annotates a specific passage.

**Position codes for float:**

- `l` = left placement (`placement: "left"` in projects.js)
- `r` = right placement (`placement: "right"` in projects.js)

## File Types and Dimensions

| Purpose         | Width | Height | Ratio | Notes                                                 |
| --------------- | ----- | ------ | ----- | ----------------------------------------------------- |
| card            | 640   | 360    | 16:9  | Project grid thumbnail — optimize always              |
| carousel-\*     | 1920  | 1080   | 16:9  | Carousel slides + lightbox — full res                 |
| article-\*      | 1224  | 918    | 4:3   | Default inline — centered, 75% container width        |
| article-wide-\* | 1920  | 960    | 2:1   | Wide inline — centered, full container width          |
| float-l-\*      | 1224  | 918    | 4:3   | Float left inline — 2× retina at 75% container width  |
| float-r-\*      | 1224  | 918    | 4:3   | Float right inline — 2× retina at 75% container width |

**Notes:**

- All types use `fit: cover` at conversion time — output dimensions are always exact, cropping from center if the source aspect ratio doesn't match.
- Source images at any size or aspect ratio are always converted — never skipped due to wrong dimensions.
- Both `float-l-*` and `float-r-*` use identical dimensions (1920×1440) — the `l`/`r` code is positional metadata only.
- `_hero` is not a separate file — use `_carousel-1` resized via CSS or derived at build time.
- `_poster` (video thumbnail) reuses `_card` dimensions — name the file `_card` and reference it as the video poster attribute.

## Steps

1. Resolve params. If `--slug` or `--folder` is missing, ask the user.

2. Read all image files in `--folder` (`.png`, `.jpg`, `.jpeg`). List them and confirm with the user before proceeding.

3. For each file, parse the purpose from the filename stem:
   - Strip any extension
   - Match against known purpose prefixes: `card`, `carousel-*`, `article-*`, `float-l-*`, `float-r-*`
   - Both `float-l-*` and `float-r-*` map to the same dimensions (1920×1440)
   - If purpose is unrecognized, warn the user and skip that file

4. Always convert every recognized file regardless of its input dimensions or aspect ratio:
   - Use `fit: cover` for all types — crops to exact dimensions from center. Do NOT use `fit: inside`.
   - Never skip a file due to wrong size or aspect ratio — convert it anyway and report the input vs. output dimensions in the summary.

5. Create output directory `app/public/<slug>/` — create it if it doesn't exist.
   - Output files go into `app/public/<slug>/` — always use the slug subfolder.
   - **Do not overwrite existing files or folders.** Before running conversion, check whether `app/public/<slug>/` already exists and whether any output `.webp` files already exist inside it. If the folder or any target file already exists, warn the user and skip those files — do not overwrite them. Only convert files whose output path does not yet exist.

6. Run conversion for all files via a single Node/sharp script:

   ```bash
   cd "C:/Users/jason/Documents/Apps/jasonljohnson-com_Personal-Portfolio/portfolio-next/app" && node -e "
   const sharp = require('sharp');
   const fs = require('fs');
   const outDir = 'public/<slug>';
   fs.mkdirSync(outDir, { recursive: true });
   const jobs = [
     // { input, output, width, height }
     // All jobs use fit: 'cover' to enforce exact dimensions regardless of source aspect ratio
     // Skip any job where fs.existsSync(j.output) is true
   ];
   Promise.all(jobs.filter(j => {
     if (fs.existsSync(j.output)) { console.log('⚠ skipped (already exists): ' + j.output); return false; }
     return true;
   }).map(j =>
     sharp(j.input)
       .resize({ width: j.width, height: j.height, fit: 'cover' })
       .webp({ quality: 85 })
       .toFile(j.output)
       .then(i => console.log('✓ ' + j.output + ' ' + i.width + 'x' + i.height))
   )).catch(console.error);
   "
   ```

7. Report each output file, its final dimensions, and any skipped files.

8. Update `app/src/data/projects.js` for the matching slug:
   - **`thumbnailUrl`** — set to `/<slug>/<slug>_card.webp` if a `card` image was converted.

   - **Carousel entries** — for each `carousel-N` image converted, find the corresponding `mediaItems` entry by order (N) and update its `url`. If the project uses `layoutType: "carousel"`, carousel images live in `mediaItems` ordered by their N suffix. Preserve all other fields.

   - **Article images** — for each `article-N` image converted, find the matching `mediaItems` entry where `placement: "center"`, matched by position N among center-placement entries, and update its `url` to `/<slug>/<slug>_article-N.webp`. Preserve all other fields.

   - **Float images** — for each `float-l-N` or `float-r-N` image converted, find the matching `mediaItems` entry by `placement` (`left`/`right`) and position N among same-placement entries, and update its `url`. Preserve all other fields.

   - **Do not add new `mediaItems` entries** — only update `url` fields on entries that already exist. If no matching entry is found, warn the user and skip.

   - **Do not change anything else** in the project object — no reformatting, no field reordering, no changes to unrelated projects.

9. Do not commit — leave staging to the user.
