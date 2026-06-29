# Remitt

A two-sided, USDC-collateralized clearing network on Stellar that bridges any two fiat payment rails for fast, atomic cross-border value transfer — remittance, commerce, payroll and B2B alike. The US↔Philippines (USD↔PHP) corridor is live as the first deployment.

> **Repository scope:** This is the **public web frontend**. The backend API, attestation service, and Soroban smart contracts live in **private repositories**. The frontend connects to a live testnet backend, so the deployed app is fully functional for evaluation (see [Network Details](#network-details)).

## Problem

Cross-border payments are slow (1–3 days) and expensive (5–7% via incumbents like Western Union). This hurts more than family remittances — it blocks cross-border commerce, freelancer and contractor payroll, and B2B supplier payments across every corridor.

The US↔Philippines corridor is one of the largest remittance markets in the world, and Filipino workers, freelancers, and businesses lose billions annually to fees and delays. Remitt is a **currency- and use-case-agnostic** framework: a sender pays through a payment app they already use (Venmo, Cash App, Zelle, or Coins.ph), the recipient receives local fiat in seconds, and liquidity providers on both sides front the funds and settle atomically in USDC on Stellar. We launch with USD↔PHP, but the same contracts and matching engine extend to any fiat pair and any payment use case.

## How It Works

**For senders (and businesses paying across borders):**
1. Pick a direction (USD→PHP or PHP→USD) and enter an amount.
2. Get a locked quote with a live FX rate and a transparent fee breakdown.
3. Enter the recipient's payout handle (a Coins.ph number, or a US payment handle) and confirm.
4. Pay through your chosen rail. The order tracker updates in real time as each leg is verified and the transfer settles on-chain — typically under two minutes.

**For liquidity providers:**
1. Connect a Freighter wallet — the wallet *is* the identity, no separate registration.
2. Choose your country, the payment rails you support, and how much USDC to deposit.
3. Sign one transaction. Your deposit becomes payout capacity, usable in whichever direction the market routes you. You earn fees on every order you help settle.

## How It Uses Stellar

- **Soroban smart contracts (custom):**
  - **ClearingPool** — a two-sided USDC liquidity pool. All LPs deposit USDC regardless of country; a reserve locks collateral on *both* the funding and payout LP, settlement releases and pays out atomically once both payment legs are attested, and a refund unwinds on failure. The contract is currency-agnostic — fiat pairs and payment rails are configuration, not code.
  - **AttestationVerifier** — verifies ed25519-signed attestations of off-chain fiat payments before on-chain settlement is permitted.
- **USDC as a Stellar Asset Contract (SAC)** — the neutral settlement and collateral asset that bridges any two fiat currencies.
- **Reflector oracle** — live FX rates for quotes, extensible to any pair Reflector prices.
- **Freighter wallet** (`@stellar/freighter-api`) — non-custodial LP onboarding; deposits are signed in-browser and keys never leave the client.
- **OpenZeppelin Stellar Channels** — parallel transaction submission via a channel-account pool, removing the single-account sequence-number bottleneck so concurrent orders settle without `txBadSeq`.

**Why Stellar:** sub-second finality, fractions-of-a-cent fees, native USDC, on-chain FX via Reflector, and Soroban smart contracts make trustless atomic settlement across fiat rails practical in a way no other chain matches at this cost.

## Track

- **Track 1 — Remittance & Cross-Border**
- **Track 2 — Financial Inclusion & Everyday Payments**
- **Track 3 — DeFi, Stablecoins & Real-World Assets**

## Tech Stack

- **Framework:** Next.js 16 (App Router) · React 19
- **Stellar integration:** `@stellar/freighter-api` v6 (wallet connect + signing). Backend uses `@stellar/stellar-sdk` v14.
- **Styling:** Tailwind CSS v4
- **Network:** testnet
- **Backend (private repo):** Hono · PostgreSQL · `@stellar/stellar-sdk` · OpenZeppelin Stellar Channels

## Setup & Run

The app talks to a live testnet backend out of the box — no local backend required to evaluate.

```bash
git clone https://github.com/Novablitz404/remitt-web.git
cd remitt-web
npm install

# Create .env.local with the backend URL:
#   NEXT_PUBLIC_BACKEND_URL=https://remitt-backend-production.up.railway.app

npm run dev
```

Then open http://localhost:3000.

**Requirements:**
- The [Freighter](https://www.freighter.app/) browser extension, set to **testnet**, to deposit liquidity or sign transactions.
- Testnet USDC in your wallet to provide liquidity (the `/merchants` flow).

## Network Details

- **Network:** Stellar testnet
- **Live app:** https://remitt-web.vercel.app/
- **Backend API:** https://remitt-backend-production.up.railway.app
- **Soroban RPC:** https://soroban-testnet.stellar.org
- **Contract IDs:**
  - ClearingPool: `CDKHZ4OYHVWLZIDWENIMINAKFWU4APUXL5WNJQ23RYZGN7TKAYRZ4QV5`
  - AttestationVerifier: `CDHWUO3SGIQ22MN37Q755KOZEDSW4P7N7RKGOCG3GLJXV3MJHQLYOX7B`
- **Asset issuer:**
  - USDC (Stellar Asset Contract): `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`

## Team

- Novablitz404 — [@Novablitz404](https://github.com/Novablitz404) (solo builder)

## License

**Proprietary — All Rights Reserved.** This source is published for hackathon evaluation only. It may **not** be copied, forked, modified, redistributed, or used in any other project. See [LICENSE](./LICENSE).
