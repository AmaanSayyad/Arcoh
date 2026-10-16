const RULES: Array<[RegExp, string]> = [
  [/user rejected|user denied|rejected the request|request rejected|\b4001\b|action_rejected/i, 'You cancelled the request in the wallet.'],
  [/insufficient funds|exceeds the balance|exceeds balance|gas required exceeds/i, 'Not enough USDC to cover the amount and gas.'],
  [/nonce too low|nonce has already been used|replacement transaction underpriced|already known/i, 'An earlier transfer is still settling. Try again in a few seconds.'],
  [/http request failed|fetch failed|failed to fetch|network error|timed out|timeout|econnreset|503|502/i, 'Arc RPC did not answer. Try again in a moment.'],
  [/chain mismatch|wrong network|chain id/i, 'Switch the wallet to Arc mainnet (chain 5042) and try again.'],
  [/max fee per gas less than block base fee|gas tip cap/i, 'The wallet fee is below Arc’s 20 gwei floor. Try the transfer again.'],
];

/** One readable sentence for a wallet or transaction error. */
export function friendlyTxError(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  const raw =
    error instanceof Error
      ? `${(error as { shortMessage?: string }).shortMessage ?? ''} ${error.message}`
      : typeof error === 'string'
        ? error
        : '';
  if (!raw.trim()) return fallback;
  for (const [pattern, text] of RULES) if (pattern.test(raw)) return text;
  const short = (error as { shortMessage?: string } | null)?.shortMessage;
  const line = (short || raw).split(/\n|Request Arguments:|Details:|Version:/)[0].trim();
  return line.length > 0 && line.length <= 140 ? line : fallback;
}
