# Roleplay Nuxt Frontend

This repository contains **only** the Nuxt frontend code for the `Roleplay` project.

- **GitHub repository URL**: `https://github.com/madebyanalogue/roleplay.git`
- **Important**: This folder (`roleplay-nuxt`) is the only folder committed to git. The Sanity Studio is kept separately.

## Project Structure

```
roleplay/
├── roleplay-nuxt/      ← This folder (Nuxt code only - committed to git)
└── roleplay-studio/    ← Sanity Studio (all Sanity code - NOT committed to git)
```

**Note**: The Sanity Studio (`roleplay-studio`) contains all Sanity schemas, configuration, and structure. It is kept as a separate folder and is **not** part of this git repository. Only the Nuxt frontend code in this folder is committed to `madebyanalogue/roleplay`.

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

