# Arcoh

Binary options trading platform where users can trade 1000+ crypto, stocks, metals, commodities and FX in 5 sec - 1 min time-charts.

## In two sentences, what does your project do?

Arcoh is a short-chart desk for crypto, stocks, metals, and FX. A trader stakes USDC from a house balance on Classic, Box, Draw, or Blitz, and the round settles against a live price in 5 seconds to 1 minute.

## What does it use Arc for?

Arc is the settlement chain for the money. Deposits and withdrawals are native USDC transfers on Arc mainnet (chain ID 5042), and gas is paid in USDC. The chart round stays off the chain and only the funding moves on Arc.

## Arc mainnet proof

Treasury `0xCBae80461Bb820e4075035F765f8a46fA65a6ded`. Fee wallet `0x9B4d9039A96Bfd7320C865aaCC69F35b51f425a7`.

A 0.001 USDC transfer from the treasury to the fee wallet confirmed on Arc mainnet:

https://explorer.arc.io/tx/0x9863b9607562d3893d1a8d9d2b3bc755a5db2e1506890550e0c1ddd39bdbed6b

That treasury is the address every deposit and withdrawal uses. The footer and the litepaper link the same receipt.

| | |
|---|---|
| **Trade** | /trade |
| **Litepaper** | /litepaper |
| **GitHub** | https://github.com/AmaanSayyad/Arcoh |
| **Founder** | https://t.me/amaan029 |

## Judges

Arcoh is a short-tick desk on Arc. The settlement price is the public chart. The trader holds USDC in a wallet connected through Reown.

Open /trade and press Connect. Reown opens the wallet list. The only network is Arc mainnet, chain ID 5042. Deposit USDC to the Arc treasury. The house balance updates after the transfer verifies. Higher or Lower stakes that balance. A win pays the stake times the multiplier shown on the button. A loss takes the stake. Withdraw pays USDC back from the treasury to the same wallet.

The round itself does not send a transaction. Arc is fast enough that the funding transfer is the onchain step, and the tick does not sit in a pending state. The chart uses a public quote.

Logo: `public/brand/arcoh-mark.png`

Copyright (c) 2026 Amaan Jilani Sayyad. The source is released under the MIT License. See `LICENSE`.

## AI tools

AI coding tools, including Cursor, were used to write, edit, and review this repository. The founder directed the product, the Arc integration, and what shipped.

## Built on

| | Role |
|---|---|
| Arc | The chain. Mainnet, chain ID 5042. RPC `https://rpc.mainnet.arc.io`. Explorer https://explorer.arc.io |
| Circle | USDC, the house-balance asset and the gas token |
| Reown | Wallet connect. Arc is the only network |
| MetaMask | One of the wallets in the Reown list |

The play asset is USDC. Native balance and gas use 18 decimals. The same balance is also an ERC-20 at `0x3600000000000000000000000000000000000000` with 6 decimals. Arcoh sends and reads the native balance. Treasury `0xcbae80461bb820e4075035f765f8a46fa65a6ded`. Fee wallet `0x9B4d9039A96Bfd7320C865aaCC69F35b51f425a7`.

| Wallet | Role |
|---|---|
| [`0xcbae…6ded`](https://explorer.arc.io/address/0xcbae80461bb820e4075035f765f8a46fa65a6ded) | Arc treasury |
| [`0x9B4d…25a7`](https://explorer.arc.io/address/0x9B4d9039A96Bfd7320C865aaCC69F35b51f425a7) | Fee wallet |
| [`0xF724…c5b6`](https://explorer.arc.io/address/0xF7249B507F1f89Eaea5d694cEf5cb96F245Bc5b6) | Test wallet |

## Arc

Arc mainnet, chain ID 5042, is where the deposit, the Blitz entry, and the withdrawal are broadcast. The round itself does not send a transaction. Gas is USDC. The mempool expects at least 20 gwei `maxFeePerGas`. A transfer leaves about 0.02 USDC in the wallet for gas.

```mermaid
sequenceDiagram
  actor Trader
  participant App as Arcoh
  participant Wallet
  participant Arc
  participant API as Balance API
  participant DB as Postgres

  Trader->>App: Connect on chain 5042
  App->>Wallet: Request USDC
  Wallet->>Arc: Transfer to the treasury
  Arc-->>App: Transaction hash
  App->>API: POST /api/balance/deposit
  API->>Arc: Read the transfer
  API->>DB: Credit the house balance
  DB-->>Trader: USDC house balance
```

Transactions:

- [0.01 USDC deposit to the treasury](https://explorer.arc.io/tx/0x09236a4a6d7db2b9c56fe84c016240bb0d9da6d9d585ca482f3cb9de6099838a)

### Reown

Reown is the connect path. The trader picks a wallet. Arcoh asks that wallet to switch to Arc, then uses it for the deposit, the withdrawal signature, and the Blitz entry.

```mermaid
sequenceDiagram
  actor Trader
  participant App as Arcoh
  participant Reown
  participant Wallet
  participant Arc
  participant API as Arcoh API

  Trader->>App: Connect
  App->>Reown: Open the wallet list
  Reown->>Wallet: Session on Arc
  Trader->>App: Deposit USDC
  App->>Wallet: Sign the treasury transfer
  Wallet->>Arc: Native USDC to the treasury
  App->>API: Verify the hash and credit the house balance
  Trader->>App: Withdraw
  App->>Wallet: Sign the withdrawal message
  API->>Arc: Send USDC back to the same wallet
```

A round does not ask the wallet to sign. Deposit and withdraw do. Withdraw returns USDC to the connected wallet. There is no separate send-to-another-address control.

---

## Story and inspiration

The founder used a Web2 binary desk. A paper-mode account showed a win. The same style of round, played with real money, lost. Public threads about that product described trial results that did not match what people saw once real money was on the line. The price that settled the round was not a chart the trader could check.

That gap sat for about five years. A round of a few seconds needs a public price that is already there when the window closes, and a place to hold the stake that does not ask for a wallet signature on every tick. Arc mainnet is that place. USDC is the play asset, and it is also the gas token. The deposit and the withdrawal are the onchain transfers. The round itself settles from the house balance against the chart.

Arcoh is that desk. A trader deposits USDC, takes Higher or Lower, a Box tile, or a drawn band, and a round of 5 seconds to 1 minute settles in the open.

---

## The problem

Binary rounds are short, and the products around them are not.

- The price that settles the round is often hidden. The trader cannot line it up with a chart they can see.
- A paper account and a real-money account can tell two different stories. A win in one does not mean the same round would have paid in the other.
- A round lasts a few seconds. A wallet signature on every stake is slower than the round, so the tick sits waiting on a confirmation that should not be part of the bet.
- Crypto, stocks, metals, and FX live in different products. A person who watches all of them has no single short-chart desk.
- When a payout does come back, it has to be the same asset the trader deposited, from a treasury they can see on Arc.

---

## The solution

Arcoh separates funding from the round.

1. The trader connects a wallet through Reown on Arc.
2. They deposit USDC into the Arc treasury and receive a USDC house balance.
3. Classic, Box, and Draw debit that balance. There is no wallet signature on the stake.
4. The round settles against the live chart. A win credits `stake × multiplier`. A miss pays zero. A tie on Classic pays zero.
5. A withdrawal sends USDC from the Arc treasury back to the same wallet.

The chart fills a price from a public quote. A missing quote stays blank and is not settled. The chart asks about once a second. The quote order is Binance, Bybit, Hyperliquid, Yahoo, then Pyth Hermes. There is no project token. The play asset is USDC on Arc.

---

## Who it is for

| Reader | What they use Arcoh for |
|---|---|
| Wallet traders | A 5s to 60s round on Arc without a signature on every stake |
| People who want a public price | A round they can check against the chart, with funds in their wallet until they deposit |
| Stock, metal, and FX watchers | The same chart for equities, metals, and FX, settled from the USDC house balance |
| People burned by a hidden settlement | A desk where the paper path and the paid path use the same visible price |
| Operators | The dashboard for treasury balances, the review queue, and invite codes |

---

## Features

- One chart for crypto, stocks, metals, and FX.
- Classic Higher/Lower, Box tiles, and Draw rectangles.
- Blitz on Box: a 0.10 USDC entry, paid to the Arc treasury, with marked cells at 2×.
- Demo balance in the browser, kept out of the live ledger.
- SMA 20, Bollinger bands (20, 2), Alligator, and RSI 14 on the same ticks.
- One USDC house balance per wallet.
- Deposits and withdrawals at 1% (Free), 0.9% (Standard), and 0.8% (VIP).
- Withdrawals at or under $10 pay immediately. Above $10 they wait for review.
- Referrals are on `/referrals`.

---

## Classic

Select Higher or Lower, set the window, and stake from the house balance.

The strike is the chart price when the round starts.

- Higher wins when the close is above the strike.
- Lower wins when the close is below the strike.
- A tie pays zero.

| Window | Multiplier |
|---|---|
| 5s | 1.75× |
| 10s | 1.80× |
| 15s | 1.85× |
| 30s | 1.90× |
| 60s | 1.95× |

At 1.90×, a trader breaks even near a 52.6% win rate. Shorter windows pay less and need a higher win rate to break even.

---

## Box

The live chart shows a grid of tiles. Each tile is a price band and shows its multiplier. The trader taps a tile.

A tile defines `priceBottom`, `priceTop`, the moment the price line reaches that column, and the multiplier.

The round wins when the live price is inside that band as the line reaches the tile. A tighter band pays more. A wider band is easier and pays less. Corner tiles, farther from the current price, pay more because the line is less likely to land there.

Blitz can mark cells in the active window at 2×.

---

## Draw

The trader draws a rectangle to the right of the live price. The rectangle is their own band and time window. The multiplier is shown as the box is drawn.

The rectangle defines `priceBottom`, `priceTop`, `startTime` on the left edge, and `endTime` on the right edge. The left edge has to sit in the future.

The round wins when the price stays inside `[priceBottom, priceTop]` from the left edge through the right edge.

The multiplier rises when the box is smaller, farther from the current price, or shorter. The box cannot be taller than 20% of the chart or wider than 20 seconds. A box that is too small to draw is rejected.

---

## Blitz

Blitz is an overlay on Box, not a fourth mode.

```
[──── BLITZ ACTIVE (1 min) ────][──── COOLDOWN (2 min) ────][── BLITZ ACTIVE ──]
```

The entry fee is **0.10 USDC**, paid once per window, on Arc, to the **Arc treasury**. It is not taken from the house balance, and it is not sent to the platform fee wallet.

During the active minute, marked cells pay 2× on top of the tile multiplier.

---

## Treasury

The desk is Arc mainnet, chain ID 5042. A transfer arrives only if it is sent on Arc. Secret keys stay in `.env` and in the host environment. They are not in this file.

Platform fees do not stay in the treasury. They move to the fee wallet.

| Wallet | Address |
|---|---|
| Treasury | `0xcbae80461bb820e4075035f765f8a46fa65a6ded` |
| Fee wallet | `0x9B4d9039A96Bfd7320C865aaCC69F35b51f425a7` |
| USDC | Native gas at 18 decimals. ERC-20 `0x3600000000000000000000000000000000000000` at 6 decimals |

---

## Settlement architecture

```
┌─────────────────────────────────────────────────────────────┐
│  OFF-CHAIN (Supabase)                                       │
│  user_balances          USDC balance per wallet             │
│  balance_audit_log      every debit and credit              │
│  bet_history            settled rounds                      │
│  user_sessions          time on the desk                    │
└─────────────────────────────────────────────────────────────┘
         ▲
         │  balance RPCs and session pings
┌────────┴────────────────────────────────────────────────────┐
│  CLIENT (Next.js + Zustand)                                 │
│  Chart price: the first public quote that answers           │
│  Round state: active rounds and settled rounds              │
│  Resolution: the chart price at the end of the round        │
└──────────────────────────────────────────────────────────────┘
         ▲
         │  deposits, withdrawals, and the Blitz entry
┌────────┴────────────────────────────────────────────────────┐
│  ON ARC                                                     │
│  One treasury holds deposited USDC                          │
│  The fee wallet receives the deposit and withdrawal fee     │
│  The Blitz 0.10 USDC goes to the Arc treasury               │
│  Gas is native USDC                                         │
└─────────────────────────────────────────────────────────────┘
```

```mermaid
sequenceDiagram
  actor Trader
  participant App as Arcoh
  participant Wallet
  participant Chain as Arc treasury
  participant API as Balance API
  participant DB as Postgres

  Trader->>App: Connect on Arc
  App->>Wallet: Request the deposit
  Wallet->>Chain: Send USDC to the treasury
  Chain-->>App: Transaction hash
  App->>API: POST /api/balance/deposit
  API->>Chain: Read the transfer
  API->>DB: update_balance_for_deposit
  DB-->>Trader: House balance credited, fee removed
```

```mermaid
sequenceDiagram
  actor Trader
  participant App as Arcoh
  participant API as Balance API
  participant DB as Postgres

  Trader->>App: Stake, mode, and window
  App->>API: POST /api/balance/bet
  API->>DB: deduct_balance_for_bet
  Note over App: Round runs on the chart
  alt Close wins
    App->>API: POST /api/balance/win
    API->>DB: credit_balance_for_payout
  else Close misses
    Note over App: Payout is zero
  end
  App->>API: POST /api/bets/save
```

```mermaid
sequenceDiagram
  actor Trader
  participant Wallet
  participant API as Withdraw API
  participant Treasury
  participant DB as Postgres

  Trader->>Wallet: Sign the Arcoh withdrawal message
  Wallet-->>API: Signature, amount, currency
  alt Amount is at or under $10
    API->>Treasury: Send the net amount on Arc
    Treasury-->>API: Transaction hash
    API->>DB: update_balance_for_withdrawal
  else Amount is above $10
    API->>DB: Queue the request for review
  end
```

The Arc withdrawal message is:

```
Arcoh withdrawal authorization
address:${address}
amount:${amount.toFixed(8)}
currency:${currency}
signedAt:${signedAt}
```

The server rejects a signature older than five minutes. A mainnet withdrawal cannot exceed `total deposited × 1.08`.

---

## Tech stack

| Frontend | Wallets | Server | Tooling |
|---|---|---|---|
| Next.js 16, App Router, Turbopack | Reown AppKit on Arc, viem | Next.js route handlers | ESLint 9 |
| React 19 and TypeScript | MetaMask and other injected wallets through Reown | Supabase Postgres and RPCs | Jest and Testing Library |
| Installable web app manifest | | Public quotes for the chart | Yarn v1, Node 24 |
| Tailwind CSS v4 | | viem for Arc treasury sends | Vercel Analytics and Speed Insights |
| Zustand | | PostHog | |
| TanStack Query, Framer Motion, d3-shape | | | |

---

## Monetization

Arcoh earns on flow. There is no project token.

### 1. Platform fees

Deposits and withdrawals pay a tier fee. The fee moves from the treasury to the fee wallet. It is not left in the treasury.

| Tier | Fee |
|---|---|
| Free | 1% |
| Standard | 0.9% |
| VIP | 0.8% |

`calculateFeeAmount` floors the fee to 8 decimals.

### 2. Round pricing

Classic multipliers sit below 2×. At 1.90×, break-even is about a 52.6% win rate. At 1.75×, break-even is about 57.1%. Box and Draw pay more when the band is tighter or farther from the current price. The admin gameplay tab separates live rounds from demo rounds.

### 3. Blitz entry

0.10 USDC once per window, sent to the Arc treasury.

These figures are the live rates. They are not a forecast of volume.

| Monthly round volume, if it is reached | Fee plus round-pricing range used for planning |
|---|---|
| About $5M | About $250k to $500k |
| About $20M | About $400k to $2.0M |

---

## Market

The desk is for people who already watch a chart and want a round that ends while they are still looking at it. The window is 5, 10, 15, 30, or 60 seconds. The markets on that chart are crypto, stocks, metals, and FX. The money is a house balance in USDC on Arc.

That is a different use than a position left open for hours. The trader is deciding a direction, a tile, or a band, and the result is the chart a minute later. The balance stays in the wallet until a deposit, and a withdrawal returns USDC from the Arc treasury.

The planning ranges in [Monetization](#monetization) and [Go to market](#go-to-market) are targets for that loop: a deposit, a run of short rounds, and a withdrawal. They are not current results.

---

## Competitive landscape

| | Web2 binary desk | Leveraged perp | Arcoh |
|---|---|---|---|
| Settlement price | Often hidden from the trader | The venue's mark | The public chart |
| Paper vs paid | A demo account can diverge from the paid account | One account, with funding and liquidation | Demo stays in the browser. Paid rounds use the house balance and the same chart |
| Time in the position | Seconds to minutes, inside a closed app | Hours, with funding | 5 seconds to 1 minute |
| Signature on the stake | An in-app click | A transaction, or a session key | No wallet signature on the stake. The deposit and the withdrawal are the Arc transfers |
| Downside | The stake | The stake, plus liquidation | The stake. No leverage and no liquidation |
| Payout asset | The app's balance | The margin asset | The same USDC that was deposited |

Arcoh does not match a trader against a hidden feed, and it does not turn a short chart into a leveraged position. The price is the chart. The payout is the USDC house balance on Arc.

---

## Roadmap

| Next | What it changes |
|---|---|
| More markets | More crypto, FX, stocks, and commodities on the same Arc chart |
| P2P Classic | Match a round between traders instead of only against the house balance, so the treasury is not the only backstop |
| Optional leverage | A 1× to 100× stake multiplier, off by default |
| Trader profiles | Highest P&L, most accurate, largest risk |
| Tournaments | Optional scheduled boards |
| Social trading | Follow, copy, and a public board |
| Native mobile | A store app on top of the installable web app |

The longer aim is a public binary board for stocks, FX, and crypto on Arc, with the price and the payout visible.

---

## Go to market

| # | Segment | Who they are | What they use today | Arcoh hook | Channel |
|---|---|---|---|---|---|
| 1 | DeFi traders | Options, spot, and perps | Funding, liquidation, and a slow ticket | A 5s round, no liquidation, no signature on the stake | Trading groups and Telegram |
| 2 | Chart traders | People who want a short round they can check | A book they cannot check | A public chart price and an Arc wallet | Arc community |
| 3 | Creators and communities | Trading groups that want a clip, not a whitepaper | No on-chain binary loop | Box, Draw, Blitz, and a shareable result | Short clips and ambassadors |
| 4 | Arc | Traders already on Arc | No short binary round on a public chart | USDC as the play asset and the gas token | Arc community |

### Phase 0

Invite testing on Arc. Fee routing, settlement, and the house balance are the checks that matter. PostHog is wired for landing, demo, deposit, and round.

### Phase 1

| Action | Detail |
|---|---|
| Referral link | `/referrals` counts one new wallet when it registers |
| Demo | A full round with no wallet, then a deposit into the real balance |

### Phase 2

Ambassador notes, a weekly conversation with traders, Blitz windows with a stated prize if one is funded, public profiles, and a Telegram note before a Blitz window.

### Phase 3

P2P Classic, more assets, and a native mobile app. Wallet entry through Reown is already live.

| Mechanic | How it works |
|---|---|
| Referral link | A new wallet that arrives from `?ref=` is counted once |
| Demo then deposit | The round can be tried before a treasury transfer |
| Blitz window | One minute on, two minutes off, so the desk has a reason to be open |
| Arc | The desk, the treasury, and the community are the same network |
| Result clips | A settled round is a screenshot, not a thread |

Planning ranges, not current results:

| | Conservative | Middle | Optimistic |
|---|---|---|---|
| Average deposit | $50 | $150 | $400 |
| Fee on that deposit at 1% | $0.50 | $1.50 | $4 |
| Average withdrawal | $40 | $120 | $350 |
| Fee on that withdrawal at 1% | $0.40 | $1.20 | $3.50 |
| Blitz entries per user each month | 2 | 5 | 15 |
| Blitz fees | $0.20 | $0.50 | $1.50 |

---

## Why now

| Signal | Detail |
|---|---|
| The chain | Arc mainnet is the desk. USDC is the play asset and the gas token. |
| The product | Deposits, house balances, and withdrawals run on the Arc treasury. |
| The gap | A short round on Arc can settle from a public chart and a USDC house balance. |

---

## Team and company

Arcoh is a company. It is a long-term product.

The founder is one person: Amaan Sayyad, a blockchain developer and entrepreneur in Navi Mumbai, India.

| | |
|---|---|
| Role | Solo founder |
| Experience | 50 hackathon wins, 10+ shipped Web3 products, 3 times a founder, 8 companies, 12 times a speaker, 3 grants. Research papers, copyrights, and patents. |
| Location | Navi Mumbai, India |
| Email | amaansayyad2001@gmail.com |
| X | https://x.com/amaanbiz |
| GitHub | https://github.com/AmaanSayyad |
| LinkedIn | https://www.linkedin.com/in/amaan-sayyad- |
| Portfolio | https://amaansayyad.com |
| Telegram | https://t.me/amaan029 |

The problem came from using a Web2 binary app. That account is in [Story and inspiration](#story-and-inspiration): a paper-mode win, a real-money loss, and public threads about trial results that did not match real results. The five-year wait was for a public price fast enough to settle a short round.

The same person is building the company because that loss is personal, and the work since then is shipping Web3 products, founding companies, and presenting the work. Arcoh is the product of that, not a one-week prototype.

Demand and distribution are in [Go to market](#go-to-market). The desk and the treasury are on Arc. A trader can run a demo round before a deposit, and a referral link counts a new wallet.

---

## Environment

One file: `.env`. Do not add `.env.local`. Next.js would let `.env.local` override `.env`. Do not commit `.env`.

`DASHBOARD_PASSWORD` must be quoted in `.env` if the value contains `#`. On the host, enter the same value without the quotes.

| Use | Names |
|---|---|
| App | `NEXT_PUBLIC_APP_URL` (optional until there is a real origin), `NEXT_PUBLIC_PROJECT_ID` |
| Arc | `NEXT_PUBLIC_ARC_TREASURY_ADDRESS`, `ARC_TREASURY_SECRET_KEY` |
| Fee wallet | `NEXT_PUBLIC_PLATFORM_FEE_WALLET_EVM` |
| Database | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` |
| Settlement | `BALANCE_SETTLEMENT_SECRET`, `BALANCE_INTERNAL_SECRET` |
| Admin | `DASHBOARD_PASSWORD` |
| Analytics | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |

`docs/ENVIRONMENT.md` has the details.

---

## Run locally

Node 24. Yarn 1.

1. Install dependencies.

```bash
yarn install
```

2. Keep a single `.env`. Use the Arc treasury address in the table above. Put secret keys only in `.env`. Add the Reown project id as `NEXT_PUBLIC_PROJECT_ID`.

3. Apply `supabase/migrations/` to the Supabase project. Balances, rounds, and referrals read those tables.

4. Fund the Arc treasury with USDC.

5. Start the app.

```bash
yarn dev
```

Open http://localhost:3000.

```bash
yarn build
yarn lint
yarn test
```

The local desk is http://localhost:3000.

---

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/balance/[address]` | House balance |
| `POST` | `/api/balance/deposit` | Record a deposit |
| `POST` | `/api/balance/withdraw` | Send a withdrawal |
| `POST` | `/api/balance/bet` | Debit a stake |
| `POST` | `/api/balance/win` | Credit a win |
| `POST` | `/api/bets/save` | Store a settled round |
| `GET` | `/api/bets/history` | Recent rounds |
| `GET` | `/api/bets/leaderboard` | Public board |
| `GET` | `/api/pyth/latest` | Latest chart quotes |
| `GET`, `POST` | `/api/referral` | Referral code and count |

Admin routes require the session from `DASHBOARD_PASSWORD`. The dashboard is `/dashboard`.

Report a vulnerability through `docs/SECURITY_REPORTING.md` or Telegram at https://t.me/amaan029.

---

## Links

| | |
|---|---|
| Trade | /trade |
| Litepaper | /litepaper |
| GitHub | https://github.com/AmaanSayyad/Arcoh |
| Leaderboard | /leaderboard |
| Founder | https://t.me/amaan029 |
