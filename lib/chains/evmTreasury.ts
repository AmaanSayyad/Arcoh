import { ethers } from 'ethers';
import {
  ARC_MIN_MAX_FEE_PER_GAS,
  ARC_USDC_DECIMALS,
  EVM_CHAINS,
  type EvmPlayNetwork,
  type PlayCurrency,
  treasuryAddressFor,
} from '@/lib/chains/supported';

function rpcProvider(url: string, chainId: number) {
  return new ethers.JsonRpcProvider(url, chainId, { staticNetwork: true });
}

function requireSecret(network: EvmPlayNetwork): string {
  const raw = process.env[EVM_CHAINS[network].secretEnv];
  if (!raw?.trim()) throw new Error(`${EVM_CHAINS[network].secretEnv} is not set`);
  const key = raw.trim();
  return key.startsWith('0x') ? key : `0x${key}`;
}

async function feeFields(provider: ethers.JsonRpcProvider) {
  const fee = await provider.getFeeData();
  const maxFeePerGas = fee.maxFeePerGas && fee.maxFeePerGas > ARC_MIN_MAX_FEE_PER_GAS
    ? fee.maxFeePerGas
    : ARC_MIN_MAX_FEE_PER_GAS;
  const priority = fee.maxPriorityFeePerGas && fee.maxPriorityFeePerGas > 0n
    ? fee.maxPriorityFeePerGas
    : 1n;
  const maxPriorityFeePerGas = priority > maxFeePerGas ? maxFeePerGas : priority;
  return { maxFeePerGas, maxPriorityFeePerGas };
}

/** Send native USDC from the Arc treasury. Gas is paid in USDC and sits on top of `amount`. */
export async function transferFromEvmTreasury(
  network: EvmPlayNetwork,
  recipient: string,
  amount: number,
  _asset: PlayCurrency = 'USDC',
): Promise<string> {
  const spec = EVM_CHAINS[network];
  const treasury = treasuryAddressFor(network);
  if (!treasury) throw new Error(`${spec.treasuryEnv} is not set`);

  const provider = rpcProvider(spec.rpc, spec.chainId);
  const wallet = new ethers.Wallet(requireSecret(network), provider);
  try {
    const value = ethers.parseUnits(amount.toFixed(ARC_USDC_DECIMALS), ARC_USDC_DECIMALS);
    const fees = await feeFields(provider);
    const gasLimit = await wallet.estimateGas({ to: recipient, value, ...fees });
    const tx = await wallet.sendTransaction({ to: recipient, value, gasLimit, ...fees });
    const receipt = await tx.wait();
    if (!receipt || receipt.status !== 1) throw new Error('USDC payout was not confirmed');
    return receipt.hash;
  } finally {
    provider.destroy();
  }
}

/** Native USDC balance. Arc reports it from `eth_getBalance` at 18 decimals. */
export async function readEvmWalletBalance(
  network: EvmPlayNetwork,
  address: string,
  _asset: PlayCurrency = 'USDC',
): Promise<number> {
  const spec = EVM_CHAINS[network];
  const provider = rpcProvider(spec.rpc, spec.chainId);
  try {
    const raw = await provider.getBalance(address);
    return Number(ethers.formatUnits(raw, ARC_USDC_DECIMALS));
  } finally {
    provider.destroy();
  }
}
