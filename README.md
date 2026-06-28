# remitt-web

Next.js 16 frontend for the Remitt USD→PHP remittance platform. Two audiences: senders who want to send money, and liquidity providers who want to earn fees.

## Pages

### `/` — Home

Landing page with the value proposition: 1.2% all-in fee, sub-2-minute delivery, live PHP rate. Links to the send flow and LP registration.

### `/send` — Send money

Two-step flow:

1. **Get a quote** — enter USD amount and choose payment rail (Venmo, Cash App, or Zelle). Displays the locked-in PHP amount, exchange rate, and fee breakdown. Quote is valid for 10 minutes.
2. **Place order** — enter the recipient's Coins.ph phone number and confirm. Creates the order on the backend, which matches LPs and reserves funds on-chain. Redirects to the order status page.

### `/send/[orderId]` — Order status

Real-time order tracker that polls every 4 seconds until the order reaches a terminal state.

- Shows amounts, payment method, recipient phone, and fee breakdown
- If the order is in `pool_reserved` state and no payment has been confirmed yet, shows a **pay-in confirmation form**: the sender enters their payment/transaction ID and handle. Submitting this triggers the attestation flow and on-chain `attest_pay_in`
- Shows a success screen when the order reaches `completed`
- Stops polling on terminal states: `completed`, `refunded`, `disputed`, `expired`

### `/merchants` — LP registration

Form for liquidity providers to register:

- **US LP**: provide Stellar address and select supported payment rails (Venmo, Cash App, Zelle)
- **PH LP**: provide Stellar address and declare PHP payout capacity in pesos

On successful registration, displays the LP ID which is needed to deposit USDC and manage the LP account.

## Project structure

```
app/
  page.tsx              # Home/landing
  send/
    page.tsx            # Quote + order creation
    [orderId]/page.tsx  # Order status + pay-in confirm
  merchants/page.tsx    # LP registration
  layout.tsx            # Root layout (nav, fonts)
  globals.css           # Tailwind base styles

components/
  FeeBreakdown.tsx      # Collapsible fee split display
  StatusBadge.tsx       # Coloured state pill

lib/
  api.ts                # Typed fetch wrappers for backend API
  format.ts             # formatUSD, formatPHP, STATE_DONE set
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Yes (prod) | Backend API base URL, e.g. `https://remitt-backend.up.railway.app`. Defaults to `http://localhost:3002` in development. |

Create `.env.local` for local development:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

## Running locally

```bash
pnpm install
pnpm dev        # starts on http://localhost:3000
```

The backend must be running at `NEXT_PUBLIC_BACKEND_URL` for the API calls to work.

```bash
pnpm build      # production build
pnpm start      # serve production build
```

## Deploying to Vercel

1. Connect this repo to a new Vercel project
2. Framework preset: **Next.js** (auto-detected)
3. Add environment variable: `NEXT_PUBLIC_BACKEND_URL` → your Railway backend URL
4. Deploy — Vercel handles the build and CDN

## Tech stack

| Library | Version | Purpose |
|---------|---------|---------|
| Next.js | 16 | App Router, RSC, server actions |
| React | 19 | UI |
| Tailwind CSS | 4 | Styling |
| TypeScript | 5 | Types |

All data fetching uses the native `fetch` API via the typed wrappers in `lib/api.ts`. No additional data-fetching library.
