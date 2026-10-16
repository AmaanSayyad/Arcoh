export type TokenSymbol = 'USDC';

const TOKENS: Record<TokenSymbol, { src: string; background: string; scale: number }> = {
  USDC: { src: '/logos/usdc.svg', background: 'transparent', scale: 1 },
};

export function TokenLogo({ token, size = 16, className = '' }: { token: TokenSymbol; size?: number; className?: string }) {
  const { src, background, scale } = TOKENS[token];
  const inner = Math.round(size * scale);
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size, background }}
    >
      <img src={src} alt="" width={inner} height={inner} className="object-contain" style={{ width: inner, height: inner }} />
    </span>
  );
}
