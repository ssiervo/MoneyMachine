# VeneValores

VeneValores is a bilingual mobile + backend MVP that helps Venezuelan investors route trade instructions to their broker via email, keep a lightweight Caracas-first portfolio, and monitor FX conversions.

![English UI](docs/screenshots/en.png)
![Spanish UI](docs/screenshots/es.png)

## Monorepo Structure

```
venevalores/
  apps/
    mobile/      # Expo React Native client
    backend/     # Node.js Express API
  docs/          # Email templates, sample data, API contracts
```

## Prerequisites

- Node.js 18+
- Yarn 1.22+
- Firebase project with Auth + Firestore enabled
- SendGrid API key
- Gmail/IMAP inbox for confirmations

## Getting Started

### Install dependencies

```
yarn install --cwd venevalores
```

### Backend

```
cd venevalores/apps/backend
cp .env.example .env
# fill env variables
yarn build
yarn start
```

### Mobile

```
cd venevalores/apps/mobile
cp .env.example .env
# set Expo public env vars (BACKEND_BASE_URL, Firebase keys)
yarn start
```

The app auto-detects the device language (English/Spanish) on first launch and allows overriding via Settings. Numbers and dates respect the selected locale.

## Email Flow

1. User submits a trade from the Trades screen.
2. Backend sends a broker-formatted email via SendGrid.
3. Broker replies with `CONFIRM {TRADE_ID} EXECUTED` or `REJECT {TRADE_ID} REASON: ...`.
4. IMAP poller parses the inbox, updates the trade status, and adjusts holdings.

## Data Sources

- **Bolsa de Valores de Caracas** market summary (primary pricing).
- Twelve Data (fallback pricing).
- FX rates via configurable BCV/USDT/EUR endpoints.

## Internationalization

- `i18next` powers runtime language switching.
- AsyncStorage persists user choice.
- Settings screen pushes the preference to Firestore.

## Testing

- `yarn lint` at repo root for linting.
- Backend unit tests can be added via Jest (not included in MVP).

## Deployment

- Backend: Deploy to Render/Vercel with environment variables configured.
- Mobile: Use Expo EAS for builds and updates.
