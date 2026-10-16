import { defineChain } from 'viem';

/** This build plays on Arc mainnet only. Gas and the house balance are USDC. */
export const SUPPORTED_NETWORKS = ['ARC'] as const;
export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

export function isSupportedNetwork(network: string | null | undefined): network is SupportedNetwork {
  return network === 'ARC';
}

export const ENABLED_PLAY_CURRENCIES = ['USDC'] as const;
export type PlayCurrency = (typeof ENABLED_PLAY_CURRENCIES)[number];

export function isEnabledPlayCurrency(code: string | null | undefined): code is PlayCurrency {
  return String(code ?? '').trim().toUpperCase() === 'USDC';
}

export function playCurrency(code: string | null | undefined): PlayCurrency {
  if (!isEnabledPlayCurrency(code) && code) {
    // Callers that still pass a legacy label settle on the only Arc asset.
  }
  return 'USDC';
}

/** Native gas token. `eth_getBalance` and value transfers use 18 decimals. */
export const ARC_USDC_DECIMALS = 18;

/** Same USDC, exposed as an ERC-20 at 6 decimals. */
export const ARC_USDC = '0x3600000000000000000000000000000000000000' as const;
export const ARC_USDC_ERC20_DECIMALS = 6;

/** System emitter that logs native USDC transfers at 18 decimals. */
export const ARC_USDC_EMITTER = '0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE' as const;

/** Mempool floor from the Arc EVM differences. */
export const ARC_MIN_MAX_FEE_PER_GAS = 20n * 10n ** 9n;

/** 0.001 USDC moved from the Arc treasury to the fee wallet. The footer and litepaper link this receipt. */
export const ARC_PROOF_TX = '0x9863b9607562d3893d1a8d9d2b3bc755a5db2e1506890550e0c1ddd39bdbed6b' as const;
export const ARC_PROOF_TX_URL = `https://explorer.arc.io/tx/${ARC_PROOF_TX}` as const;

export const arc = defineChain({
  id: 5042,
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: ARC_USDC_DECIMALS },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.arc.io'], webSocket: ['wss://rpc.mainnet.arc.io'] },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://explorer.arc.io' },
  },
});

export const ARC_CHAIN_ID_HEX = '0x13b2';

export type EvmPlayNetwork = 'ARC';

export interface EvmChainSpec {
  network: EvmPlayNetwork;
  chainId: number;
  name: string;
  symbol: string;
  rpc: string;
  explorer: string;
  currency: string;
  treasuryEnv: string;
  secretEnv: string;
  token: { address: `0x${string}`; decimals: number };
}

export const EVM_CHAINS: Record<EvmPlayNetwork, EvmChainSpec> = {
  ARC: {
    network: 'ARC',
    chainId: arc.id,
    name: 'Arc',
    symbol: 'USDC',
    rpc: arc.rpcUrls.default.http[0],
    explorer: arc.blockExplorers.default.url,
    currency: 'USDC',
    treasuryEnv: 'NEXT_PUBLIC_ARC_TREASURY_ADDRESS',
    secretEnv: 'ARC_TREASURY_SECRET_KEY',
    token: { address: ARC_USDC, decimals: ARC_USDC_ERC20_DECIMALS },
  },
};

export function evmChainForCurrency(currency: string): EvmChainSpec | null {
  return isEnabledPlayCurrency(currency) ? EVM_CHAINS.ARC : null;
}

export function treasuryAddressFor(network: EvmPlayNetwork): string {
  if (network !== 'ARC') return '';
  return (process.env.NEXT_PUBLIC_ARC_TREASURY_ADDRESS || '').trim();
}
