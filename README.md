# faroit.com

Personal website for Fabian-Robert Stöter.

## Current site

The active site lives at the repository root and is built with React + Vite.

## Development

```bash
npm run dev
```

## Build

From the repository root:

```bash
npm run build
```

This outputs the production site to `dist/`.

## Deploy

Manual deployment is handled by:

```bash
./deploy.sh
```

That script builds the root Vite app, writes the custom `CNAME`, and force-pushes the built output to `faroit/faroit.github.io`.
