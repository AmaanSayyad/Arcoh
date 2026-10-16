/**
 * Canonical X/Twitter share copy for referral links (used from /referrals and /profile).
 */

export function getReferralShareTweetText(): string {
  return [
    'This platform is Insane.⚡️',
    '',
    'Arcoh - short charts for crypto, stocks, metals, commodities and FX.', 
    'Rounds run from 5 seconds to 1 minute.',
    '',
    'Open @Arcoh from my link and the join in.',
    'Stop watching. Start trading.', 
    '',
    'Try it now:',
    ].join('\n');
}

export function referralLandingUrl(referralCode: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') || '';
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (configured && !/tapt|\.fun/i.test(configured) ? configured : 'http://localhost:3000');
  return `${origin}/?ref=${encodeURIComponent(referralCode.trim())}`;
}

export function openReferralShareOnX(referralLink: string): void {
  if (typeof window === 'undefined') return;
  const text = encodeURIComponent(getReferralShareTweetText());
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`,
    '_blank',
  );
}
