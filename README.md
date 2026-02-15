# maeari for portfolio

> In shorthand, mfp (maeari-for-portfolio)

maeari for portfolio is a personal website with Firestore database and written with SvelteKit.

Supports TISTORY API to show post list of own blog.

## How to Customize

1. Clone repository
2. Enable corepack: `corepack enable`
3. Install the RC/Yarn canary channel (v6 preview line is not in stable): `corepack prepare yarn@canary --activate`
4. If you prefer repo-pinned Yarn binary, run `yarn set version canary`
5. (Optional) Set Node linker for PnP: ensure `.yarnrc.yml` contains `nodeLinker: pnp` (already configured).
6. Install dependencies: `yarn install`
7. If you hit tooling issues, switch to permissive mode by setting `pnpMode: loose` temporarily.
8. Start development server: `yarn run dev`
9. Use your favorite editor to modfiy pages under `src/routes/`

> Please modify `.env` file before run development server to use your own database. there will be a guide who wants to build own data to database in GitHub Wiki.

## Open Source Software

- [SDK] Firebase SDK
- [Framework] SvelteKit
- [Preprocessor] SCSS
- [Icon Font] Material Symbols
- [UI Components] @material/web
- [Text Font] SUIT

## FAQ

- A11y warning in `Nav.svelte` is actually not an issue. This is because Svelte indicates `md-tab` is not an interactive component, but `md-tab` is a kind of `button`. 
