export function referralLandingUrl(referralCode: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') || '';
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (configured && !/tapt|\.fun/i.test(configured) ? configured : 'https://arcoh.vercel.app');
  return `${origin}/?ref=${encodeURIComponent(referralCode.trim())}`;
}
