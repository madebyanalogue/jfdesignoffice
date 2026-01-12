# JF Design Office Nuxt Frontend

This repository contains **only** the Nuxt frontend code for the `JF Design Office` project.

- **GitHub repository URL**: `https://github.com/madebyanalogue/jfdesignoffice.git`
- **Important**: This folder (`jfdesignoffice-nuxt`) is the only folder committed to git. The Sanity Studio is kept separately.

## Project Structure

```
jfdesignoffice/
├── jfdesignoffice-nuxt/      ← This folder (Nuxt code only - committed to git)
└── jfdesignoffice-studio/    ← Sanity Studio (all Sanity code - NOT committed to git)
```

**Note**: The Sanity Studio (`jfdesignoffice-studio`) contains all Sanity schemas, configuration, and structure. It is kept as a separate folder and is **not** part of this git repository. Only the Nuxt frontend code in this folder is committed to `madebyanalogue/jfdesignoffice`.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

