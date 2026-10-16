'use client';

import { createPublicClient, createWalletClient, custom, http, parseUnits, type Address, type EIP1193Provider } from 'viem';
import {
  ARC_CHAIN_ID_HEX,
  ARC_MIN_MAX_FEE_PER_GAS,
  ARC_USDC_DECIMALS,
  arc,
} from '@/lib/chains/supported';
import { useOverflowStore } from '@/lib/store';

export const USDC_GAS_RESERVE = 0.02;

let providerRef: EIP1193Provider | null = null;
let disconnectRef: (() => Promise<void>) | null = null;

export function bindArcWallet(provider: EIP1193Provider | null, disconnect?: () => Promise<void>) {
  providerRef = provider;
  if (disconnect) disconnectRef = disconnect;
}

export function arcWalletActive() {
  return Boolean(providerRef && useOverflowStore.getState().address);
}

function provider(): EIP1193Provider {
  if (!providerRef) throw new Error('Connect a wallet on Arc first.');
  return providerRef;
}

function friendly(error: unknown): Error {
  const code = (error as { code?: number }).code;
  if (code === 4001) return new Error('The wallet request was cancelled.');
  if (error instanceof Error && error.message) return error;
  return new Error('Wallet request failed.');
}

export async function ensureArc(eth: EIP1193Provider = provider()) {
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ARC_CHAIN_ID_HEX }] });
  } catch (error) {
    if ((error as { code?: number }).code !== 4902) throw error;
    await eth.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: ARC_CHAIN_ID_HEX,
        chainName: 'Arc',
        nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: ARC_USDC_DECIMALS },
        rpcUrls: ['https://rpc.mainnet.arc.io'],
        blockExplorerUrls: ['https://explorer.arc.io'],
      }],
    });
  }
}

export function applyArcAccount(address: Address) {
  const store = useOverflowStore.getState();
  if (store.address?.toLowerCase() === address.toLowerCase() && store.isConnected && store.network === 'ARC') {
    return;
  }
  store.setAddress(address);
  store.setIsConnected(true);
  store.setNetwork('ARC');
  store.setPreferredNetwork('ARC');
  store.setSelectedCurrency('USDC');
  void store.refreshWalletBalance();
  void store.fetchProfile(address);
  void store.fetchBalance(address);
}

export function clearArcAccount() {
  providerRef = null;
  const store = useOverflowStore.getState();
  if (!store.address && !store.isConnected) return;
  store.setAddress(null);
  store.setIsConnected(false);
  store.setNetwork(null);
}

export async function disconnectArcWallet() {
  providerRef = null;
  try {
    await disconnectRef?.();
  } catch {
    // The Reown session may already be closed.
  }
}

function walletClient(address: Address) {
  return createWalletClient({
    account: address,
    chain: arc,
    transport: custom(provider()),
  });
}

function publicClient() {
  return createPublicClient({ chain: arc, transport: http(arc.rpcUrls.default.http[0]) });
}

async function arcFees() {
  const fees = await publicClient().estimateFeesPerGas();
  const maxFeePerGas = fees.maxFeePerGas > ARC_MIN_MAX_FEE_PER_GAS ? fees.maxFeePerGas : ARC_MIN_MAX_FEE_PER_GAS;
  const maxPriorityFeePerGas = fees.maxPriorityFeePerGas > maxFeePerGas ? maxFeePerGas : fees.maxPriorityFeePerGas;
  return { maxFeePerGas, maxPriorityFeePerGas };
}

export async function signArcMessage(message: string): Promise<`0x${string}`> {
  const address = useOverflowStore.getState().address as Address | null;
  if (!address) throw new Error('Connect a wallet on Arc first.');
  try {
    return await walletClient(address).signMessage({ account: address, message });
  } catch (error) {
    throw friendly(error);
  }
}

/** Send native USDC. Arc prices this value at 18 decimals, and gas is USDC too. */
export async function sendUsdc(amount: number, recipient: Address): Promise<`0x${string}`> {
  const address = useOverflowStore.getState().address as Address | null;
  if (!address) throw new Error('Connect a wallet on Arc first.');
  if (amount <= 0) throw new Error('Enter a USDC amount.');
  try {
    await ensureArc();
    const value = parseUnits(amount.toFixed(ARC_USDC_DECIMALS), ARC_USDC_DECIMALS);
    const held = await publicClient().getBalance({ address });
    const reserve = parseUnits(USDC_GAS_RESERVE.toFixed(ARC_USDC_DECIMALS), ARC_USDC_DECIMALS);
    if (held < value + reserve) {
      throw new Error(`Keep about ${USDC_GAS_RESERVE} USDC in the wallet for gas.`);
    }
    const fees = await arcFees();
    return await walletClient(address).sendTransaction({
      account: address,
      chain: arc,
      to: recipient,
      value,
      gas: 21_000n,
      ...fees,
    });
  } catch (error) {
    throw friendly(error);
  }
}

export async function depositUsdc(amount: number, treasury: Address): Promise<`0x${string}`> {
  return sendUsdc(amount, treasury);
}
