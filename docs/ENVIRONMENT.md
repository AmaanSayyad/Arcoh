# Environment

The app reads one file: `.env`. Do not add `.env.local`. Next.js would let `.env.local` override `.env`.

Do not commit `.env`, and do not paste secret values into chat or docs.

## Arc mainnet

Chain ID 5042. RPC `https://rpc.mainnet.arc.io`. Explorer https://explorer.arc.io.

USDC is the native gas token at 18 decimals. The same balance is also an ERC-20 at `0x3600000000000000000000000000000000000000` with 6 decimals. Arcoh sends and reads the native balance.

| Use | Variable | Notes |
|---|---|---|
| Treasury | `NEXT_PUBLIC_ARC_TREASURY_ADDRESS` | Receives deposits and pays withdrawals |
| Treasury key | `ARC_TREASURY_SECRET_KEY` | Server only. Signs USDC payouts |
| Fee wallet | `NEXT_PUBLIC_PLATFORM_FEE_WALLET_EVM` | Receives the deposit and withdrawal fee in USDC |

`NEXT_PUBLIC_APP_URL` is `https://arcoh.vercel.app`. A `.fun` placeholder is ignored.

`NEXT_PUBLIC_PROJECT_ID` is the Reown project id from [dashboard.reown.com](https://dashboard.reown.com). The connect modal uses it. Add this origin under the project's allowed domains.

## App and data

`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_ANON_KEY`
`SUPABASE_SERVICE_KEY`

`BALANCE_SETTLEMENT_SECRET`
`BALANCE_INTERNAL_SECRET`

`DASHBOARD_PASSWORD` signs the admin session.

Optional analytics:

`NEXT_PUBLIC_POSTHOG_KEY`
`NEXT_PUBLIC_POSTHOG_HOST`

The chart reads Binance, Bybit, Hyperliquid, Yahoo, then Pyth Hermes. No extra price key is required for the default feed.
