# Venevalores

Venevalores is a paper-trading simulator inspired by platforms like Robinhood, focused on the Caracas Stock Exchange (BVC). The project is a Vite + React + TypeScript application that ships with an opinionated setup for data fetching, i18n, testing, and design system primitives.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The default configuration uses deterministic mock data. To switch to a live integration later, set `VITE_DATA_SOURCE=bvc` after implementing the real adapter.

## Available scripts

- `npm run dev` – start the Vite development server
- `npm run build` – type-check and create a production build
- `npm run preview` – preview the production build locally
- `npm run test` – run the Vitest suite once
- `npm run test:ui` – run Vitest in watch/UI mode
- `npm run lint` – lint the codebase with ESLint
- `npm run format` – format files with Prettier
- `npm run type-check` – run TypeScript in noEmit mode

## Architecture

- **UI** – React + Tailwind CSS, shadcn/ui primitives, lucide-react icons
- **State** – Zustand for client state and React Query for server state
- **Networking** – Axios client with retry/backoff and adapters for mock/live data
- **Internationalization** – i18next with English and Spanish translations
- **Testing** – Vitest + Testing Library + MSW for request mocking

## License

MIT
