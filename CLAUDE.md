# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server with Turbopack
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint (next lint)

## Tech Stack

- **Next.js 15** (App Router) with **React 19** and **TypeScript 5**
- **Tailwind CSS 3** for styling (some components also use CSS Modules)
- **Zustand** for client-side state management

## Architecture

This is a full-stack experience/demo platform built with the Next.js App Router.

### Routing & Pages

Pages live in `src/app/{feature}/page.tsx` and are thin wrappers that delegate to components in `src/components/{feature}/`. Most feature pages are client components (`"use client"`).

### State Management

Three Zustand stores in `src/store/`:
- `useCoinStore` — Bitcoin trading simulator state
- `useSchemaImageStore` — Image processing/AI art state
- `useSettingsStore` — UI settings and chat state

### Key Directories

- `src/types/` — Shared TypeScript interfaces
- `src/utils/` — Utility functions
- `src/components/common/` — Shared components (MainMenu, Drawer, Spinner, image utilities)

### External APIs

- OpenAI (chat, image generation) — called client-side
- Binance WebSocket (`wss://stream.binance.com:9443`) — real-time crypto prices

## Code Conventions

- **Path alias:** `@/` maps to `src/`
- **Prettier:** no semicolons, single quotes, 2-space indent, trailing commas (es5)
- **Component naming:** PascalCase; hooks use `use` prefix; stores follow `use{Feature}Store`
- **Dynamic imports** for heavy libraries (e.g., `@imgly/background-removal`) to avoid bundle bloat
- **Webpack config** in `next.config.mjs` enables WebAssembly (`asyncWebAssembly: true`) and sets `fs` fallback to false for browser

