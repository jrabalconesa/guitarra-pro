# Guitarra PRO — GitHub Pages

[Open application](https://jrabalconesa.github.io/guitarra-pro/) · [ChatGPT Sites](https://guitarra-pro.joserabalconesa.chatgpt.site)

Based on **Sites version 26**, commit `b6d20a8bf244cf954d19c61375d3a90b579f75ff` (application edition 8).

The original `app/`, `lib/` and public assets are unchanged. The Pages build adds a platform adapter under `pages/` that runs the original API validation and AIA code against IndexedDB. Source hashes are checked before publication in `scripts/verify-pages-source.mjs` and exposed at `version.json`.

## Platform differences

- Sites stores progress and original song files in your ChatGPT account. Pages stores them **only in this browser**, separately from Sites. Clearing site data removes them.
- Pages provides tutorial search links; Sites can also retrieve video results on its server.
- The ChatGPT MCP integration is served by Sites, not Pages.
- Practice, note detection, rhythm, AIA rules, CAGED, tuner, music library and OCR use the same application sources.

## Build

Public assets are split into `public-assets.part00` and `public-assets.part01` to fit web upload limits. They are concatenated into the original gzip tar archive and restored without modifying their contents:

```sh
cat public-assets.part* | tar -xz
node scripts/verify-pages-source.mjs
npm install --ignore-scripts --legacy-peer-deps
node --test lib/*.test.mjs
npm run build:pages
```

The GitHub Actions workflow builds and publishes `dist-pages`. Paths are configured for `/guitarra-pro/`.
