import { ethers } from 'ethers';
import { EVM_CHAINS, treasuryAddressFor } from '@/lib/chains/supported';

export type TreasuryBalanceRow = {
  chain: string;
  label: string;
  address: string;
  asset: string;
  balance: number | null;
  error?: string;
  explorerUrl: string | null;
};

export async function buildTreasuryBalanceSnapshot(): Promise<{
  generatedAt: string;
  rows: TreasuryBalanceRow[];
}> {
  const address = treasuryAddressFor('ARC');
  const spec = EVM_CHAINS.ARC;
  const row: TreasuryBalanceRow = {
    chain: 'ARC',
    label: 'Arc — USDC treasury',
    address,
    asset: 'USDC',
    balance: null,
    explorerUrl: address ? `${spec.explorer}/address/${address}` : null,
  };
  if (!address) {
    row.error = 'Treasury address is not set';
    return { generatedAt: new Date().toISOString(), rows: [row] };
  }
  try {
    const provider = new ethers.JsonRpcProvider(spec.rpc, spec.chainId, { staticNetwork: true });
    try {
      const raw = await provider.getBalance(address);
      row.balance = Number(ethers.formatUnits(raw, 18));
    } finally {
      provider.destroy();
    }
  } catch (error) {
    row.error = error instanceof Error ? error.message : 'Balance read failed';
  }
  return { generatedAt: new Date().toISOString(), rows: [row] };
}
