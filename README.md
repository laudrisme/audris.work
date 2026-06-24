# Audris Li portfolio — clean build workspace

This folder is the clean working area for the portfolio website. The original files in `/Users/yuhanlee/Desktop/Personal Portfolio` were not deleted, renamed or moved.

## Structure

- `content/` — master copy and future page-by-page content files
- `assets/` — publishable images and documents, grouped by project
- `design-references/` — site inspiration notes and Cyta visual research
- `data/` — content inventory, asset manifest and missing-assets audit
- `src/` — website source-code structure for the next phase
- `public/` — future deployment-ready public files
- `exports/` — previews and production exports
- `archive/` — useful heavyweight source documents that should not be served directly

Exact duplicate source files are listed in `data/asset_manifest.csv` but copied only once.

## Local preview

The first website version is a lightweight static site with no package installation required.

```bash
cd "/Users/yuhanlee/Desktop/Personal Portfolio/Website_Build"
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

Project titles, roles, years, categories, summaries and cover paths are loaded from `data/project_metadata_draft.csv`. The Photography visual essay sequence is defined in `src/data/photography-sections.js`.
