import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dynamically set base for GitHub Pages builds so local dev stays simple.
// When running in GitHub Actions, GITHUB_REPOSITORY is <owner>/<repo>.
// We extract the repo name to set the base automatically. For user/organization
// pages where the site is served from root, you can force BASE_OVERRIDE='/' in the workflow env.
const isCI = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const baseOverride = process.env.BASE_OVERRIDE; // optional manual override

const base = baseOverride
  ? baseOverride.endsWith('/') ? baseOverride : baseOverride + '/'
  : (isCI && repoName ? `/${repoName}/` : '/');

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    sourcemap: true
  }
});
