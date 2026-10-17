'use client';

import MermaidDiagram from '@/components/ui/MermaidDiagram';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { ARC_PROOF_TX_URL, DEMO_VIDEO_URL, LIVE_APP_URL, PITCH_DECK_URL } from '@/lib/chains/supported';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PROJECT_GITHUB = 'https://github.com/AmaanSayyad/Arcoh';
const TREASURY = '0xCBae80461Bb820e4075035F765f8a46fA65a6ded';

const integrations = [
  { name: 'Arc', role: 'Chain', detail: 'Mainnet · 5042', src: '/logos/chains/arc.svg' },
  { name: 'USDC', role: 'Balance', detail: 'Play asset and gas', src: '/logos/usdc.svg' },
  { name: 'Circle', role: 'Issuer', detail: 'Native USDC', src: '/logos/circle.svg' },
  { name: 'Reown', role: 'Wallet', detail: 'AppKit session', src: '/logos/chains/arc.svg' },
];

const marketMarks = [
  { src: '/logos/ticker/btc.svg', label: 'BTC' },
  { src: '/logos/ticker/eth.svg', label: 'ETH' },
  { src: '/logos/ticker/sol.svg', label: 'SOL' },
  { src: '/logos/ticker/aapl.svg', label: 'AAPL' },
  { src: '/logos/ticker/nvda.svg', label: 'NVDA' },
  { src: '/logos/ticker/tsla.svg', label: 'TSLA' },
  { src: '/logos/ticker/gold.svg', label: 'Gold' },
  { src: '/logos/ticker/silver.svg', label: 'Silver' },
  { src: '/logos/ticker/eur.svg', label: 'EUR' },
  { src: '/logos/ticker/gbp.svg', label: 'GBP' },
  { src: '/logos/ticker/jpy.svg', label: 'JPY' },
];

function DiagramNode({ src, extra, label }: { src?: string; extra?: string; label: string }) {
  return (
    <div className="inline-flex w-full max-w-full items-center gap-2 rounded-lg border border-[#E6E0F5] bg-white px-3 py-2 text-sm text-[#1A1330] shadow-[0_8px_24px_rgb(110_84_255_/_6%)] sm:w-auto">
      {src ? <img src={src} alt="" className="h-5 w-5 shrink-0 object-contain" /> : null}
      {extra ? <img src={extra} alt="" className="h-5 w-5 shrink-0 object-contain" /> : null}
      <span className="min-w-0 leading-5">{label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <span className="self-center text-[#B781FE]" aria-hidden>
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}

const flow = 'flex flex-col items-stretch gap-2 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center';

function FundingDiagram() {
  return (
    <div className={flow}>
      <DiagramNode src="/logos/usdc.svg" label="USDC in the wallet" />
      <Arrow />
      <DiagramNode src="/logos/chains/arc.svg" label="Native transfer on Arc" />
      <Arrow />
      <DiagramNode src="/brand/arcoh-mark.png" label="Credit the house balance" />
    </div>
  );
}

function TraderModeDiagram() {
  const modes = [
    {
      name: 'Classic',
      steps: ['Choose Higher or Lower', 'Wait for the window to end', 'Win on the correct side of the open'],
      visual: (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#7005FC] py-3 text-center text-sm text-white">▲ Higher</div>
          <div className="rounded-xl border border-[#ff5c5c]/50 py-3 text-center text-sm text-[#ff5c5c]">▼ Lower</div>
        </div>
      ),
    },
    {
      name: 'Box',
      steps: ['Tap a tile on the grid', 'The tile shows its multiplier', 'Win when the price line enters it'],
      visual: (
        <div className="grid grid-cols-4 gap-1.5">
          {['1.4×', '2.1×', '3.6×', '1.8×', '1.2×', '4.8×', '2.4×', '1.6×'].map((mult, i) => (
            <div
              key={`${mult}-${i}`}
              className={`rounded-md py-2 text-center text-[11px] ${i === 5 ? 'bg-[#7005FC] text-white' : 'border border-[#E6E0F5] bg-[#FCFBFF] text-[#5C5478]'}`}
            >
              {mult}
            </div>
          ))}
        </div>
      ),
    },
    {
      name: 'Draw',
      steps: ['Draw a band on the chart', 'Confirm the stake', 'Win when the close is inside'],
      visual: (
        <div className="relative h-[88px] rounded-xl border border-[#E6E0F5] bg-[#FCFBFF]">
          <div className="absolute left-[18%] top-[22%] h-10 w-[46%] rounded-md border-2 border-[#7005FC] bg-[#7005FC]/10" />
          <div className="absolute bottom-3 left-3 right-3 h-px bg-[#B781FE]" />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 py-2">
      <div className="grid gap-3 lg:grid-cols-3">
        {modes.map((mode) => (
          <div key={mode.name} className="rounded-xl border border-[#E6E0F5] bg-white p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7005FC]">{mode.name}</p>
            <div className="mt-4">{mode.visual}</div>
            <ol className="mt-4 space-y-2">
              {mode.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-2 text-sm text-[#1A1330]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#E6E0F5] text-[11px] text-[#7005FC]">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#E6E0F5] bg-[#FCFBFF] px-4 py-3 text-center text-sm text-[#1A1330]">
        A win pays stake × multiplier. A miss pays zero.
      </div>
    </div>
  );
}

function PartnerStrip() {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {integrations.map((item) => (
        <div key={item.name} className="inline-flex items-center gap-2 rounded-full border border-[#E6E0F5] bg-white px-3 py-1.5 text-sm text-[#1A1330]">
          <img src={item.src} alt="" className="h-5 w-5 object-contain" />
          <span>{item.name}</span>
          <span className="text-[#5C5478]">{item.detail}</span>
        </div>
      ))}
    </div>
  );
}

function MarketStrip() {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {marketMarks.map((mark) => (
        <div key={mark.label} className="inline-flex items-center gap-2 rounded-full border border-[#E6E0F5] bg-white px-3 py-1.5 text-sm text-[#1A1330]">
          <img src={mark.src} alt="" className="h-5 w-5 object-contain" />
          <span>{mark.label}</span>
        </div>
      ))}
    </div>
  );
}

function PriceDiagram() {
  const steps = ['Binance', 'Bybit', 'Hyperliquid', 'Yahoo quotes', 'Pyth'];
  return (
    <div className={flow}>
      {steps.map((label, index) => (
        <div key={label} className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
          {index > 0 ? <Arrow /> : null}
          <DiagramNode src={label === 'Hyperliquid' ? '/logos/companies/hyperliquid.png' : undefined} label={label} />
        </div>
      ))}
      <Arrow />
      <DiagramNode src="/brand/arcoh-mark.png" label="Chart and settlement" />
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className={flow}>
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-center">
        <DiagramNode label="Reown wallet" />
        <Arrow />
        <DiagramNode src="/brand/arcoh-mark.png" label="Arcoh client" />
        <Arrow />
        <DiagramNode label="Trade and balance routes" />
      </div>
      <Arrow />
      <div className="flex w-full flex-col gap-2 sm:w-auto">
        <DiagramNode src="/logos/companies/postgresql.svg" label="Postgres" />
        <DiagramNode label="Price pipeline" />
        <DiagramNode src="/logos/usdc.svg" label="Arc treasury" />
      </div>
      <Arrow />
      <DiagramNode src="/logos/chains/arc.svg" label="Arc mainnet" />
    </div>
  );
}

const ROUND_SEQUENCE = `sequenceDiagram
    participant W as Wallet
    participant UI as Arcoh
    participant API as House balance
    participant PF as Price
    W->>UI: Choose market, mode, and stake
    UI->>API: Debit the house balance
    UI->>PF: Read the live price
    PF-->>UI: Price through the window
    UI->>API: Credit the payout on a win
    API-->>UI: Updated balance`;

function SectionDiagram({ logo }: { logo: 'modes' | 'partners' | 'markets' | 'balance' | 'prices' | 'architecture' }) {
  return (
    <div className="mt-6 min-w-0 border-t border-white/10 pt-5">
      {logo === 'modes' ? <TraderModeDiagram /> : null}
      {logo === 'partners' ? <PartnerStrip /> : null}
      {logo === 'markets' ? <MarketStrip /> : null}
      {logo === 'balance' ? <FundingDiagram /> : null}
      {logo === 'prices' ? <PriceDiagram /> : null}
      {logo === 'architecture' ? <ArchitectureDiagram /> : null}
    </div>
  );
}

const sections: Array<{ id: string; title: string; body: string[]; logo?: 'modes' | 'partners' | 'markets' | 'balance' | 'prices' | 'architecture'; mermaid?: string }> = [
  {
    id: 'product',
    title: '1. Product',
    body: [
      'Arcoh is a short-chart desk. A round lasts 5, 10, 15, 30, or 60 seconds. The chart shows a live price, the player takes a position from the house balance, and the round settles against that price.',
      'There are three trader modes: Classic, Box, and Draw. Each one takes the stake from the house balance and pays the stake times the multiplier on a win.',
      'The chart can show a 20-period moving average, Bollinger bands, the Alligator, and a 14-period RSI. Those lines are drawn from the same ticks as the price path.',
    ],
  },
  {
    id: 'modes',
    title: '2. Trader modes',
    body: [
      'Classic is a direction call. The player chooses Higher or Lower, sets the window to 5, 10, 15, 30, or 60 seconds, and stakes from the house balance. The open price is the price when the round starts. Higher wins when the close is above that open. Lower wins when the close is below it. A tie pays zero. The multiplier is 1.75× at 5 seconds, 1.80× at 10, 1.85× at 15, 1.90× at 30, and 1.95× at 60.',
      'Box is a tile on the live grid. Each tile already shows its multiplier, which is higher when the tile sits farther from the current price. The player taps a tile. The round wins when the price line enters that tile, inside its price band. Blitz is a timed boost on eligible Box tiles. A 0.10 USDC transfer to the Arc treasury opens it, and marked cells pay double until the timer ends.',
      'Draw is a band the player marks on the chart. They draw the rectangle, confirm the stake, and the round runs to the end of that band. It wins when the close price is still inside the band they drew.',
    ],
    logo: 'modes',
  },
  {
    id: 'built-on',
    title: '3. Built on Arc',
    body: [
      'The desk runs on Arc mainnet, chain ID 5042. The play asset is USDC. Gas is USDC too. Native transfers and eth_getBalance use 18 decimals. The same balance is also an ERC-20 at 0x3600000000000000000000000000000000000000 with 6 decimals. Arcoh sends and reads the native balance.',
      'A wallet connects through Reown. The modal covers WalletConnect, Coinbase, MetaMask, and the other injected wallets that can add Arc. The app asks the wallet to switch to chain 5042 and adds the network when it is missing.',
      `A deposit is a native USDC transfer to the house treasury ${TREASURY}. Arcoh reads the receipt, then credits the house balance. A withdrawal is paid back in USDC from that treasury. Arc finality is sub-second, so funding does not sit in a long confirmation window. The round itself stays off the chain.`,
    ],
    logo: 'partners',
  },
  {
    id: 'markets',
    title: '4. Markets',
    body: [
      'The same desk prices crypto, stocks, metals, and FX. Crypto includes BTC, ETH, and SOL. Stocks include names such as AAPL, NVDA, and TSLA. Metals include gold and silver. FX includes pairs such as EUR, GBP, and JPY.',
      'A market with no live quote stays blank. The chart does not invent a price for it.',
    ],
    logo: 'markets',
  },
  {
    id: 'round',
    title: '5. A round',
    body: [
      'The player picks a market, a mode, a duration, and a stake in USDC. The stake comes off the house balance. The price is read on the chart. A win is credited back to the same balance. The stake is not sent on Arc for each round.',
      'Classic wins when the close is on the chosen side of the open. Draw wins when the close is inside the band the player marked. Box wins when the live price enters the chosen tile. A winning payout is the stake times the multiplier on that position. A loss pays zero.',
    ],
    mermaid: ROUND_SEQUENCE,
  },
  {
    id: 'balance',
    title: '6. House balance',
    body: [
      'The house balance is the USDC Arcoh holds for that account. Deposit sends native USDC from the connected wallet to the Arc treasury. The deposit window reads the wallet, and the credit is the amount minus the fee.',
      'Gas stays with the wallet. A send leaves about 0.02 USDC behind so the next transaction can pay the fee. Arc’s mempool expects at least 20 gwei maxFeePerGas. A 21,000-gas transfer at that floor costs 0.00042 USDC.',
      'Deposits and withdrawals charge 1% on Free, 0.9% on Standard, and 0.8% on VIP. The fee is taken from the amount. The rest is credited on deposit, or sent to the wallet on withdrawal. A withdrawal at or under $10 is sent from the Arc treasury immediately. Anything above $10 waits for review.',
    ],
    logo: 'balance',
  },
  {
    id: 'prices',
    title: '7. Prices',
    body: [
      'Each asset takes the first live price in this order: Binance, Bybit, Hyperliquid mids, Yahoo quotes for stocks, metals, and FX, then Pyth. A Bybit quote that disagrees with Hyperliquid is dropped, so a different instrument with the same ticker never reaches the chart. Pyth Pro fills anything still missing when it is configured.',
      'The chart asks the server about once a second, so no data key reaches the browser. If a request fails, it keeps the last good price.',
      'An asset with no price stays blank. A round is not settled against a blank quote.',
    ],
    logo: 'prices',
  },
  {
    id: 'architecture',
    title: '8. Architecture',
    body: [
      'The desk is a Next.js app. The trade engine, the chart, and the house ledger are shared. Deposits are checked on Arc, payouts leave the Arc treasury, and transfers can be read on the Arc explorer.',
      'Balances, rounds, withdrawals, and referrals live in Postgres. The client can request a deposit, a round, or a withdrawal. It cannot write the ledger itself. Admin actions use a separate signed session.',
    ],
    logo: 'architecture',
  },
  {
    id: 'security',
    title: '9. Security',
    body: [
      'Wallet addresses are stored in one canonical form so the same wallet does not split into two balances. A banned wallet is blocked from deposits, rounds, and withdrawals.',
      'The Reown session is the only way in. A withdrawal includes a signed message with the address, amount, asset, and time. The server rejects a signature older than five minutes. The payout is USDC from the Arc treasury.',
      'The database denies public writes. Privileged updates run on the server. Balance calls must come from an allowed origin with a signed session, and the page cannot be embedded.',
    ],
  },
];

const sectionMap = Object.fromEntries(sections.map((s) => [s.id, s])) as Record<string, (typeof sections)[number]>;

const groupedFlow = [
  { title: 'The desk', ids: ['product', 'modes', 'built-on', 'markets'] },
  { title: 'How a round works', ids: ['round', 'balance', 'prices'] },
  { title: 'System', ids: ['architecture', 'security'] },
];

const chip =
  'inline-flex h-8 items-center rounded-full border border-white/10 px-3 text-xs text-[#E4E4E4] transition hover:border-[#7005FC] hover:text-white';

const links = [
  { href: LIVE_APP_URL, label: 'Live' },
  { href: PITCH_DECK_URL, label: 'Pitch deck' },
  { href: DEMO_VIDEO_URL, label: 'Demo video' },
  { href: ARC_PROOF_TX_URL, label: 'Arc transfer' },
  { href: PROJECT_GITHUB, label: 'GitHub' },
];

export default function LitepaperPage() {
  const [active, setActive] = useState('product');

  useEffect(() => {
    const nodes = sections.map((section) => document.getElementById(section.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="monad-page bg-[#070010] text-[#FCFBFF]">
      <div className="mx-auto w-full max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7005FC]">Technical document · v1.7 · October 17, 2026</p>
        <h1 className="rh-display mt-3 text-[clamp(2.6rem,5vw,4.25rem)] text-white">Litepaper</h1>
        <p className="mt-4 text-base leading-relaxed text-[#E4E4E4]">
          How Arcoh prices a tick, settles a round from the house balance, and pays USDC back on Arc.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link href="/trade" className="neon-btn h-9 px-4 text-sm">Launch</Link>
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={chip}>{link.label}</a>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {integrations.map((item) => (
            <div key={item.name} className="panel flex min-h-[92px] items-center gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5">
                <img src={item.src} alt="" className="h-7 w-7 object-contain" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">{item.role}</p>
                <p className="mt-1 truncate text-base text-white">{item.name}</p>
                <p className="mt-0.5 truncate text-sm text-[#E4E4E4]">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Timeframes', '5s · 10s · 15s · 30s · 60s'],
            ['Markets', 'Crypto, stocks, metals, FX'],
            ['Modes', 'Box, Draw, Classic, Blitz'],
            ['Settlement', 'House balance, then the treasury'],
          ].map(([k, v]) => (
            <div key={k} className="panel p-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">{k}</p>
              <p className="mt-2 text-sm leading-relaxed text-white">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="panel p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">Contents</p>
            <div className="mt-4 space-y-4">
              {groupedFlow.map((group) => (
                <div key={group.title}>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#E4E4E4]/70">{group.title}</p>
                  <div className="mt-1.5 space-y-0.5">
                    {group.ids.map((id) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        className={`block rounded-lg px-2 py-1.5 text-sm transition ${active === id ? 'bg-[#7005FC] text-white' : 'text-[#E4E4E4] hover:bg-white/5 hover:text-white'}`}
                      >
                        {sectionMap[id].title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 space-y-4">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="panel scroll-mt-24 p-6 sm:p-8">
                <h2 className="text-2xl font-medium text-white">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-7 text-[#E4E4E4]">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.logo ? <SectionDiagram logo={section.logo} /> : null}
                {section.mermaid ? (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <MermaidDiagram chart={section.mermaid} />
                  </div>
                ) : null}
              </article>
            ))}
            <section className="panel p-6 sm:p-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#7005FC]">Builder</p>
              <div className="mt-4 grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                <img src="/logos/Amaan-Sayyad.jpg?v=3" alt="Amaan Sayyad" className="aspect-[4/5] w-full max-w-[240px] rounded-xl object-cover object-[center_30%]" loading="lazy" />
                <div>
                  <h3 className="text-2xl font-medium text-white">Amaan Sayyad</h3>
                  <p className="mt-3 text-base leading-7 text-[#DDD7FE]">
                    Solo founder. 50 hackathon wins, 10+ shipped Web3 products, 3 times a founder, 8 companies, 12 times a speaker, 3 grants. Research papers, copyrights, and patents.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href="https://www.linkedin.com/in/amaan-sayyad-" target="_blank" rel="noreferrer" className={chip}>LinkedIn</a>
                    <a href="https://amaansayyad.com" target="_blank" rel="noreferrer" className={chip}>Portfolio</a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
