import { NextRequest, NextResponse } from 'next/server';
import { treasuryAddressFor } from '@/lib/chains/supported';

/** Public house-wallet address for a USDC deposit. Secrets stay on the server. */
export async function GET(request: NextRequest) {
  const network = (request.nextUrl.searchParams.get('network') || 'ARC').toUpperCase();
  if (network !== 'ARC') {
    return NextResponse.json({ address: '' }, { status: 400 });
  }
  return NextResponse.json({ address: treasuryAddressFor('ARC') });
}
