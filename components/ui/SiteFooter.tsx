import Link from 'next/link';
import { ARC_PROOF_TX_URL, DEMO_VIDEO_URL, LIVE_APP_URL, PITCH_DECK_URL } from '@/lib/chains/supported';

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
  logo?: string;
};

const PRODUCT: FooterLink[] = [
  { href: '/trade', label: 'Trade' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
  { href: '/referrals', label: 'Rewards' },
  { href: '/#questions', label: 'FAQ' },
];

const PLATFORM: FooterLink[] = [
  { href: LIVE_APP_URL, label: 'Live', external: true },
  { href: '/litepaper', label: 'Litepaper' },
  { href: PITCH_DECK_URL, label: 'Pitch deck', external: true },
  { href: DEMO_VIDEO_URL, label: 'Demo video', external: true },
  { href: 'https://github.com/AmaanSayyad/Arcoh', label: 'GitHub', external: true },
];

const RESOURCES: FooterLink[] = [
  { href: 'https://docs.arc.io', label: 'Arc docs', external: true },
  { href: 'https://explorer.arc.io', label: 'Arc explorer', external: true },
  { href: ARC_PROOF_TX_URL, label: 'Treasury transfer', external: true },
  { href: 'https://www.circle.com/usdc', label: 'USDC', external: true },
];

function LinkMark({ logo }: { logo?: string }) {
  if (!logo) return null;
  if (logo.endsWith('.svg') && !logo.includes('/logos/ticker/')) {
    return (
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#070010]/90 ring-1 ring-black/20">
        <img src={logo} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" aria-hidden />
      </span>
    );
  }
  return <img src={logo} alt="" width={20} height={20} className="h-5 w-5 shrink-0 rounded-[5px] object-cover" aria-hidden />;
}

function Col({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className="mb-4 text-[15px] font-medium text-white">{title}</p>
      <ul className="space-y-2.5">
        {links.map((item) => {
          const className = 'inline-flex items-center gap-2 text-[14px] text-white/85 transition-colors hover:text-white';
          const content = (
            <>
              <LinkMark logo={item.logo} />
              <span>{item.label}</span>
            </>
          );
          return (
            <li key={`${item.href}-${item.label}`}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {content}
                </a>
              ) : (
                <Link href={item.href} className={className}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Chip({ href, label, logo, internal }: { href: string; label: string; logo?: string; internal?: boolean }) {
  const className = 'inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-white ring-1 ring-white/15';
  const content = (
    <>
      {logo ? <img src={logo} alt="" width={16} height={16} className="h-4 w-4 shrink-0 object-contain" aria-hidden /> : null}
      <span>{label}</span>
    </>
  );
  if (internal) {
    return <Link href={href} className={className}>{content}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer mt-24 border-t border-white/10 bg-[#070010] text-white">
      <div className="rh-container pb-12 pt-10 sm:pb-14 sm:pt-12">
        <div className="mb-10 flex flex-col items-start gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/arcoh-mark.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg" />
            <span className="text-[17px] font-medium">Arcoh.fun</span>
          </Link>

          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Chip href="/trade" label="Trade" internal />
              <Chip href={LIVE_APP_URL} label="Live" />
              <Chip href="/litepaper" label="Litepaper" internal />
              <Chip href={PITCH_DECK_URL} label="Pitch deck" />
              <Chip href={DEMO_VIDEO_URL} label="Demo video" />
              <Chip href="https://github.com/AmaanSayyad/Arcoh" label="GitHub" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[13px] text-white/70">Built on</span>
              <Chip href="https://www.arc.io" label="Arc" logo="/logos/chains/arc.svg" />
              <Chip href="https://www.circle.com" label="Circle" logo="/logos/circle.svg" />
              <Chip href="https://www.circle.com/usdc" label="USDC" logo="/logos/usdc.svg" />
            </div>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-8 lg:grid-cols-3 lg:gap-10">
          <Col title="Product" links={PRODUCT} />
          <Col title="Platform" links={PLATFORM} />
          <Col title="Resources" links={RESOURCES} />
        </div>

        <div className="space-y-3 border-t border-[#FFFFFF]/20 pt-8 text-[12px] leading-relaxed text-white/75">
          <p>
            Arcoh is a short-chart desk for crypto, stocks, metals, and FX. Rounds run from 5 seconds to 1 minute and settle from the house balance.
          </p>
          <p className="xl:whitespace-nowrap">
            Crypto and tokenized assets involve significant risk and can result in loss of capital. Nothing on this site is financial advice. House balances settle in USDC on Arc.
          </p>
          <p className="pt-1 text-white/55">© {new Date().getFullYear()} Arcoh.fun</p>
        </div>
      </div>

      <div className="overflow-hidden select-none" aria-hidden>
        <p className="whitespace-nowrap px-3 pb-2 text-[clamp(2.75rem,11vw,8rem)] font-bold leading-[0.85] tracking-[-0.04em] text-white sm:px-5 sm:pb-4">
          Arcoh.fun
        </p>
      </div>
    </footer>
  );
}
