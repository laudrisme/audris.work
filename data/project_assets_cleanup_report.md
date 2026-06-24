# Project assets cleanup report

This report records the current state after creating ordered `selected-visuals` folders. No files were moved or deleted. Photography's `curated-sections` folder was not changed.

## Currently used by website

- Project cover paths listed in `data/project_metadata_draft.csv`.
- Ordered project visuals listed in `src/data/project-visuals.js` and `data/project_selected_visuals.csv`.
- Photography continues to use `assets/projects/photography/curated-sections/` through its separate visual-essay data.
- Marketing & Retail uses the approved web-ready ICICLE spreads as source material rather than the large source PDF.

## Copied into selected-visuals

- Cyta: 8 files in `assets/projects/cyta/selected-visuals/`.
- Cross-Border E-commerce: 3 distinct files in `assets/projects/cross-border-ecommerce/selected-visuals/`.
- AI Customer Experience Research: 6 files in `assets/projects/ai-cx-research/selected-visuals/`.
- Marketing & Retail: 6 files in `assets/projects/marketing-retail/selected-visuals/`.
- Fashion Styling / Visual Direction: 8 files in `assets/projects/fashion-styling/selected-visuals/`.

## Possible duplicates

### Cyta

- The `cyta-gallery-*` files are often exact copies of files in `identity/`, `product/`, `sourcing/` and `workshop/`.
- The new selected files are intentional copies with ordered website names. Keep the older folders until the final archive is confirmed.

### Cross-Border E-commerce

- `assets/projects/cross-border/` contains the three distinct source images.
- Two files in `assets/projects/cross-border-ecommerce/` are exact copies of the digital-printing and supplier-visit sources.
- The selected set contains only the three distinct images and does not repeat them to reach an artificial minimum.

### AI Customer Experience Research

- The five diagrams in `assets/projects/ai-cx-research/` are exact copies of files in `assets/projects/research/process/`.
- The academic poster also exists as a source PDF in `assets/projects/research/ai-cx-academic-poster.pdf`.

### Marketing & Retail

- The selected spreads are intentional copies of `web-ready-spreads/` with descriptive display-order names.
- `marketing-retail-cover.jpg` is also copied into the selected set as the opening visual.

### Fashion Styling / Visual Direction

- Styling sources were copied from older non-curated Photography subfolders because the separate Fashion Styling folder no longer held a usable set.
- Some selected images also appear in the Photography curated essay. This overlap is intentional for now and should be reviewed if Styling becomes a public standalone project.

## Unused but should keep for now

- Remaining Cyta workshop, sourcing, identity and product files not chosen for the first edit.
- The older `assets/projects/cross-border/` and `assets/projects/cross-border-ecommerce/ecommerce-gallery-*` source files.
- The research source PDF and `assets/projects/research/process/` diagrams.
- Non-selected fashion collage, portrait, still-life and behind-the-scenes images in the older Photography subfolders.
- `.DS_Store` system files should remain ignored by Git; they were not deleted during this pass.

## Safe to archive later

After the website is approved and all selected paths are confirmed, the following can be considered for archive consolidation rather than deletion:

- Exact Cyta duplicates across `cyta-gallery-*` and the older category subfolders.
- The older `assets/projects/cross-border/` folder after confirming which location should remain the source of truth.
- Duplicate AI diagram files in `assets/projects/research/process/` or `assets/projects/ai-cx-research/` after retaining one clearly labelled source set.
- Legacy non-curated Photography fashion folders after confirming that both the Photography essay and standalone Styling project no longer reference them.

Do not archive any of these folders until a final path audit is complete and the public project list is confirmed.
