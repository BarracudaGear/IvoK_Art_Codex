# Content Guide

Use the built-in editor to update the public site content without editing the HTML.

The editor is local-only. It is not published on GitHub Pages, so the live `/editor.html` URL will not work. Open `editor.html` from a local copy of this repo.

## Quick steps

1. Add your new image files to the `images/` folder.
2. Open `editor.html` locally in the browser (double-click the file, or serve the folder locally). Do not use the public site URL.
3. Update the hero image, artist portrait, and works in each category.
4. Click `Download site-data.js`.
5. Replace `js/site-data.js` with the downloaded file.
6. Commit and push, or send the new file plus images to whoever publishes.

## Image paths

Inside the editor, image paths should look like:

- `images/hero.jpg`
- `images/artist-portrait.jpg`
- `images/portraits/work-01.jpg`

## Works

Public categories are:

- Portraits
- Landscapes
- Interior Murals
- Exterior Murals
- Faux Finishes

Leave a category empty until real artwork is ready. The live gallery shows an honest empty state instead of placeholder paintings.

Each work includes:

- title
- image path
- alt text
- year
- medium
- dimensions
- price or "Price on request"
- description
- whether it should appear on the homepage

The website automatically places works into the correct gallery section based on the category where you add them in the editor.
