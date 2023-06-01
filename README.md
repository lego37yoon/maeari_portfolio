# maeari for portfolio

> In shorthand, mfp (maeari-for-portfolio)

maeari for portfolio is a personal website with Firestore database and written with SvelteKit.

Supports TISTORY API to show post list of own blog.

## How to Customize

1. Clone repository
2. using Yarn latest stable before start: `yarn set version berry`
3. install dependencies: `yarn install`
4. Start development server: `yarn run dev`
5. Use your favorite editor to modfiy pages under `src/routes/`

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