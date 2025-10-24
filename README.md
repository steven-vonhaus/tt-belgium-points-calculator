# TT Belgium Points Calculator

A React + Vite application to calculate Belgian table tennis points.

## Development

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

Deployment is automated via GitHub Actions. After pushing to `main`, the workflow in `.github/workflows/deploy.yml` will:

1. Install dependencies
2. Run tests
3. Build the site with the correct base for Pages
4. Publish the `dist` folder to GitHub Pages

### Dynamic base path logic

`vite.config.ts` detects the CI environment. On GitHub Actions it reads `GITHUB_REPOSITORY` ("<owner>/<repo>") and sets `base` to `/<repo>/`. Locally the base is simply `/` so you don't need to serve from a subfolder.

Override behavior by setting `BASE_OVERRIDE=/` (or another path) in the workflow environment if you later move to a user/organization page root or a custom domain.

### One-time setup

1. Ensure the repository is public (or that your plan supports Pages for private repos).
2. In GitHub: Settings > Pages > Build and deployment: choose `GitHub Actions`.
3. Push (or merge) the workflow file to the `main` branch.

### Manual trigger

From the Actions tab select the "Deploy to GitHub Pages" workflow and click **Run workflow**.

### Local verification before push

```bash
npm run build
npx serve dist   # or any static file server
```
Navigate to the root; deep links will work once deployed thanks to the 404 redirect.

## SPA 404 Handling

`public/404.html` redirects to the base path so that direct navigation to nested routes on GitHub Pages still loads the app.

## Custom Domain

If you add a custom domain:

1. Create `public/CNAME` containing the domain (e.g. `example.com`).
2. Set `BASE_OVERRIDE=/` (or hardcode `base: '/'`) so assets resolve from root.

## License

See `LICENSE`.
