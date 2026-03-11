# maeari for portfolio

> In shorthand, mfp (maeari-for-portfolio)

maeari for portfolio is a personal website written with SvelteKit.

Supports RSS format to show post list of own blog.

## How to Customize

1. Clone repository
2. Enable corepack: `corepack enable`
3. Install the RC/Yarn canary channel (v6 preview line is not in stable): `corepack prepare yarn@canary --activate`
4. If you prefer repo-pinned Yarn binary, run `yarn set version canary`
5. (Optional) Set Node linker for PnP: ensure `.yarnrc.yml` contains `nodeLinker: pnp` (already configured).
6. Install dependencies: `yarn install`
7. Copy `.env.example` to `.env` and adjust values as needed.
8. Update `wrangler.toml`:
   - Set `database_id` in `[[d1_databases]]`
   - Set R2 bucket names in `[[r2_buckets]]`
9. Apply D1 migrations:
   - local: `yarn d1:migrate:local`
   - remote: `yarn d1:migrate:remote`
10. Start Cloudflare local runtime: `yarn dev:cf`
11. Deploy to Cloudflare Workers: `yarn deploy`

> For the API to work in Cloudflare runtime, `DB` (D1) must be bound in `wrangler.toml`.

## Open Source Software

- [Runtime] Cloudflare Workers
- [Database] Cloudflare D1
- [Object Storage] Cloudflare R2
- [Framework] SvelteKit
- [Preprocessor] SCSS
- [Icon Font] Material Symbols
- [UI Components] @material/web
- [Text Font] SUIT
- [DOM Emulator] jsdom
- [Testing Framework] Vitest
- [Programming Language] TypeScript
- [Svelte UI] bits-ui
- [Color Library] colorjs.io
- [XML Parser] fast-xml-parser
