/**
 * Single source for which `user_balances.currency` row to use.
 * Arcoh keeps one ledger: USDC on Arc.
 */

export function resolveHouseLedgerCurrency(_params?: {
  network?: string;
  selectedCurrency?: string | null;
  userAddress?: string | null;
}): string {
  return 'USDC';
}
