'use client';

import { useEffect, useRef } from 'react';
import { createAppKit, useAppKit, useAppKitAccount, useAppKitNetwork, useAppKitProvider, useDisconnect } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { defineChain } from '@reown/appkit/networks';
import type { EIP1193Provider } from 'viem';
import { applyArcAccount, bindArcWallet, clearArcAccount } from '@/lib/arc/wallet';
import { useOverflowStore } from '@/lib/store';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined');
}

const configuredSite = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/$/, '');
const siteUrl = configuredSite && !/tapt|\.fun/i.test(configuredSite) ? configuredSite : 'http://localhost:3000';

export const arcNetwork = defineChain({
  id: 5042,
  caipNetworkId: 'eip155:5042',
  chainNamespace: 'eip155',
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mainnet.arc.io'] } },
  blockExplorers: { default: { name: 'Arc Explorer', url: 'https://explorer.arc.io' } },
});

createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [arcNetwork],
  defaultNetwork: arcNetwork,
  metadata: {
    name: 'Arcoh',
    description: 'Short charts on Arc. USDC in, USDC out.',
    url: siteUrl,
    icons: [`${siteUrl}/icon-512.png`],
  },
  customRpcUrls: {
    'eip155:5042': [{ url: 'https://rpc.mainnet.arc.io' }],
  },
  chainImages: {
    5042: '/logos/chains/arc.svg',
  },
  defaultAccountTypes: { eip155: 'eoa' },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7005FC',
    '--w3m-color-mix': '#070010',
    '--w3m-color-mix-strength': 40,
  },
  features: {
    analytics: true,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
});

/** Opens the Reown modal and keeps the Arcoh session in step with the connected Arc account. */
export function ReownSession() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount({ namespace: 'eip155' });
  const { chainId, switchNetwork } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider<EIP1193Provider>('eip155');
  const { disconnect } = useDisconnect();
  const isOpen = useOverflowStore((state) => state.isConnectModalOpen);
  const setOpen = useOverflowStore((state) => state.setConnectModalOpen);
  const wasConnected = useRef(false);
  const askedForArc = useRef(false);

  useEffect(() => {
    bindArcWallet(isConnected ? walletProvider : null, () => disconnect());
  }, [disconnect, isConnected, walletProvider]);

  useEffect(() => {
    if (isConnected && address) {
      wasConnected.current = true;
      applyArcAccount(address as `0x${string}`);
      return;
    }
    if (wasConnected.current && !isConnected) {
      wasConnected.current = false;
      clearArcAccount();
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      askedForArc.current = false;
      return;
    }
    if (Number(chainId) === arcNetwork.id || askedForArc.current) return;
    askedForArc.current = true;
    void switchNetwork(arcNetwork);
  }, [chainId, isConnected, switchNetwork]);

  useEffect(() => {
    if (!isOpen) return;
    setOpen(false);
    void open();
  }, [isOpen, open, setOpen]);

  return null;
}
