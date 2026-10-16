import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arcoh',
    short_name: 'Arcoh',
    description: 'Short charts for crypto, stocks, metals, and FX. USDC house balance on Arc mainnet.',
    id: '/',
    start_url: '/trade',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070010',
    theme_color: '#070010',
    categories: ['finance'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    shortcuts: [
      { name: 'Trade', url: '/trade' },
    ],
  };
}
