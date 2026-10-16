import { ethers } from 'ethers';
import {
  ARC_USDC,
  ARC_USDC_DECIMALS,
  ARC_USDC_EMITTER,
  ARC_USDC_ERC20_DECIMALS,
  evmChainForCurrency,
  treasuryAddressFor,
} from '@/lib/chains/supported';

const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');

/** Floor a JSON number into units. `0.1.toFixed(18)` rounds up and rejects an exact 0.1 transfer. */
function amountToUnits(amount: number, decimals: number): bigint {
  const text = String(amount);
  const match = text.match(/^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
  if (!match) return ethers.parseUnits(amount.toFixed(decimals), decimals);
  const digits = `${match[1]}${match[2] ?? ''}`;
  const exp = (match[2]?.length ?? 0) - Number(match[3] ?? 0);
  const scale = decimals - exp;
  if (scale >= 0) return BigInt(digits) * 10n ** BigInt(scale);
  return BigInt(digits.slice(0, digits.length + scale) || '0');
}

function traceSendsValue(node: unknown, user: string, treasury: string, want: bigint): boolean {
  if (!node || typeof node !== 'object') return false;
  const call = node as { from?: string; to?: string; value?: string; error?: string; calls?: unknown[] };
  const value = BigInt(call.value || '0x0');
  if (
    !call.error
    && call.from?.toLowerCase() === user
    && call.to?.toLowerCase() === treasury
    && value >= want
  ) {
    return true;
  }
  return (call.calls ?? []).some((child) => traceSendsValue(child, user, treasury, want));
}

function logPays(log: ethers.Log, user: string, treasury: string, token: string, want: bigint): boolean {
  if (log.address.toLowerCase() !== token) return false;
  if (log.topics[0] !== TRANSFER_TOPIC) return false;
  if (log.topics[1]?.toLowerCase() !== ethers.zeroPadValue(user, 32).toLowerCase()) return false;
  if (log.topics[2]?.toLowerCase() !== ethers.zeroPadValue(treasury, 32).toLowerCase()) return false;
  return BigInt(log.data) >= want;
}

/** Confirm a native or ERC-20 USDC transfer from the trader to the Arc treasury. */
export async function verifyEvmDepositTx(
  txHash: string,
  userAddress: string,
  amount: number,
  currency: string,
): Promise<boolean> {
  const spec = evmChainForCurrency(currency);
  const treasury = spec ? treasuryAddressFor(spec.network) : '';
  if (!spec || !treasury) return false;

  try {
    const provider = new ethers.JsonRpcProvider(spec.rpc, spec.chainId, { staticNetwork: true });
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status !== 1) return false;

    const user = userAddress.toLowerCase();
    const house = treasury.toLowerCase();
    const wantNative = amountToUnits(Number(amount), ARC_USDC_DECIMALS);
    const tx = await provider.getTransaction(txHash);
    if (tx && tx.from.toLowerCase() === user && tx.to?.toLowerCase() === house && tx.value >= wantNative) {
      return true;
    }

    const wantErc20 = amountToUnits(Number(amount), ARC_USDC_ERC20_DECIMALS);
    const logged = receipt.logs.some((log) =>
      logPays(log, user, house, ARC_USDC.toLowerCase(), wantErc20)
      || logPays(log, user, house, ARC_USDC_EMITTER.toLowerCase(), wantNative),
    );
    if (logged) return true;

    try {
      const trace = await provider.send('debug_traceTransaction', [txHash, { tracer: 'callTracer' }]);
      return traceSendsValue(trace, user, house, wantNative);
    } catch {
      return false;
    }
  } catch (err) {
    console.error('[verifyEvmDepositTx] RPC error:', err);
    return false;
  }
}
