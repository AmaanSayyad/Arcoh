'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore, useHouseBalance, useWalletAddress, useIsConnected } from '@/lib/store';
import { useToast } from '@/lib/hooks/useToast';
import { openReferralShareOnX, referralLandingUrl } from '@/lib/referral/shareOnX';
import { chainMark, useArcohDisconnect } from '@/components/wallet/WalletConnect';
import { getFeePercentLabel } from '@/lib/fees/platformFee';
import { assetLogo } from '@/lib/assets/logos';
import { displayReferralCode, displayUsername } from '@/lib/brand/names';
import { TraderPfp } from '@/components/ui/TraderPfp';

const LIVE = new Set(['ARC']);

function shorten(addr: string) {
    if (addr.length < 12) return addr;
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function directionLabel(direction: string | undefined) {
    if (direction === 'UP') return 'Higher';
    if (direction === 'DOWN') return 'Lower';
    return direction || 'Round';
}

function AssetMark({ asset }: { asset?: string }) {
    const logo = assetLogo(asset);
    return (
        <span className="inline-flex items-center gap-2">
            {logo ? <img src={logo} alt="" className="h-5 w-5 rounded-full bg-[#1a1a1a] object-cover" /> : null}
            <span>{asset || '—'}</span>
        </span>
    );
}

export default function ProfilePage() {
    const isConnected = useIsConnected();
    const address = useWalletAddress();
    const houseBalance = useHouseBalance();
    const {
        username,
        updateUsername,
        recentTrades,
        isLoadingTrades,
        referralCode,
        referralCount,
        accessCode,
        network,
        preferredNetwork,
        fetchRecentTrades,
        fetchReferralInfo,
        demoBalance,
        accountType,
        fetchBalance,
        setConnectModalOpen,
        userTier,
        selectedCurrency,
    } = useStore();

    const shownNetwork = LIVE.has(preferredNetwork || '') ? preferredNetwork : network;
    const chain = chainMark(shownNetwork);
    const asset = 'USDC';
    const treasuryAmount = accountType === 'demo' ? demoBalance : houseBalance;

    useEffect(() => {
        if (isConnected && address && accountType === 'real') fetchBalance(address);
    }, [isConnected, address, accountType, fetchBalance, selectedCurrency]);

    useEffect(() => {
        if (isConnected && address) {
            fetchRecentTrades(address);
            fetchReferralInfo(address);
        }
    }, [isConnected, address, fetchRecentTrades, fetchReferralInfo]);

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [copied, setCopied] = useState<'code' | 'address' | null>(null);
    const toast = useToast();
    const disconnectWallet = useArcohDisconnect();

    useEffect(() => {
        if (username) setNewUsername((displayUsername(username) || '').replace(/\.arcoh$/i, ''));
    }, [username]);

    const handleUpdateUsername = async () => {
        if (!address || !newUsername.trim()) return;
        const formattedUsername = `${newUsername.trim().toLowerCase()}.arcoh`;
        const success = await updateUsername(address, formattedUsername);
        if (success) setIsEditing(false);
        else toast.error('That name is taken or invalid.');
    };

    const copyText = async (text: string, kind: 'code' | 'address') => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(kind);
        setTimeout(() => setCopied(null), 1600);
    };

    if (!isConnected) {
        return (
            <div className="monad-page bg-[#070010] text-[#FCFBFF]">
                <div className="rh-container flex min-h-[60vh] flex-col items-start justify-center py-16">
                    <h1 className="rh-display text-[clamp(2.6rem,5vw,4rem)] text-white">Profile</h1>
                    <p className="mt-4 max-w-md text-[15px] leading-6 text-[#E4E4E4]">
                        Connect a wallet on Arc to see the USDC house balance, the fee, and settled rounds.
                    </p>
                    <button type="button" onClick={() => setConnectModalOpen(true)} className="neon-btn mt-8 h-11 w-full px-6 text-sm sm:w-auto">
                        Connect
                    </button>
                </div>
            </div>
        );
    }

    const displayName = displayUsername(username) || 'Trader';
    const shownReferralCode = displayReferralCode(referralCode);

    const resultClass = (won: boolean) => (won ? 'text-[#82FF68]' : 'text-[#FF5C7A]');

    return (
        <div className="monad-page bg-[#070010] text-[#FCFBFF]">
            <div className="rh-container py-8 sm:py-12">
                <section className="panel p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <TraderPfp seed={address || displayName} className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl" />
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">Profile</p>
                                {isEditing ? (
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <input
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="h-10 rounded-full border border-white/10 bg-[#070010] px-4 text-sm text-white outline-none focus:border-[#7005FC]"
                                            autoFocus
                                        />
                                        <button type="button" onClick={handleUpdateUsername} className="neon-btn h-10 px-4 text-sm">Save</button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-[#E4E4E4]">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="mt-1 flex items-center gap-3">
                                        <h1 className="truncate text-2xl text-white">{displayName}</h1>
                                        <button type="button" onClick={() => setIsEditing(true)} className="text-sm text-[#E4E4E4] hover:text-white">Rename</button>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => copyText(address || '', 'address')}
                                    className="mt-1 font-mono text-xs text-[#B781FE] hover:text-white"
                                >
                                    {copied === 'address' ? 'Copied' : shorten(address || '')}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => disconnectWallet()} className="h-10 rounded-full px-3 text-sm text-[#E4E4E4] hover:text-white">
                                Disconnect
                            </button>
                            <Link href="/trade" className="neon-btn h-10 px-4 text-sm">Open the chart</Link>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-[#E4E4E4]">The house balance, fee, and settled rounds for the wallet you have connected.</p>
                    <div className="mt-4 grid items-stretch gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-[#15111B] px-4 py-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">{accountType === 'demo' ? 'Practice balance' : 'House balance'}</p>
                        {accountType === 'demo' ? (
                            <p className="mt-3 font-mono text-2xl text-white">
                                {Number(treasuryAmount || 0).toFixed(4)}
                                <span className="ml-2 font-sans text-sm text-[#7005FC]">USDC</span>
                            </p>
                        ) : (
                            <p className="mt-3 font-mono text-2xl text-white">
                                {Number(treasuryAmount || 0).toFixed(4)}
                                <span className="ml-2 font-sans text-sm text-[#7005FC]">USDC</span>
                            </p>
                        )}
                        <p className="mt-3 text-xs leading-5 text-[#E4E4E4]">
                            {accountType === 'demo' ? 'Demo mode. This balance is not on-chain.' : 'Rounds debit this USDC balance on Arc.'}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#15111B] px-4 py-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">Fee</p>
                        <p className="mt-3 text-2xl text-[#7005FC]">{getFeePercentLabel(userTier)}</p>
                        <p className="mt-3 text-xs leading-5 text-[#E4E4E4]">Taken from each deposit and withdrawal.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#15111B] px-4 py-4">
                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#B781FE]">Referrals</p>
                        <p className="mt-3 text-2xl text-white">{referralCount || 0}</p>
                        <Link href="/referrals" className="mt-3 inline-block text-xs text-[#7005FC]">Open rewards</Link>
                    </div>
                </div>
                </section>

                <section className="panel mt-4 p-5 sm:p-6">
                    <h2 className="text-base text-white">Arc</h2>
                    <p className="mt-1 text-sm leading-6 text-[#E4E4E4]">
                        Deposits and withdrawals are native USDC transfers on Arc mainnet, chain 5042. Gas is USDC. Look up a transfer on the Arc explorer.
                    </p>
                    <a href="https://explorer.arc.io" className="mt-3 inline-block text-sm text-[#B781FE]" target="_blank" rel="noreferrer">
                        explorer.arc.io
                    </a>
                </section>

                <section className="panel mt-4 p-5 sm:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-base text-white">Fee tiers</h2>
                            <p className="mt-1 text-sm text-[#E4E4E4]">Taken on deposits and withdrawals. Sends at or under $10 go out immediately.</p>
                        </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {([
                            ['free', 'Free', 'Start here'],
                            ['standard', 'Standard', 'From $50'],
                            ['vip', 'VIP', 'From $500'],
                        ] as const).map(([id, name, note]) => {
                            const yours = (userTier || 'free') === id;
                            return (
                                <div key={id} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${yours ? 'border-[#7005FC] bg-[#7005FC]/15' : 'border-white/10 bg-[#070010]'}`}>
                                    <div>
                                        <p className="text-sm text-white">{name}{yours ? ' · Yours' : ''}</p>
                                        <p className="mt-0.5 text-xs text-[#E4E4E4]">{note}</p>
                                    </div>
                                    <p className="text-xl text-[#7005FC]">{getFeePercentLabel(id)}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                    <section className="panel overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                            <h2 className="text-base text-white">Settled rounds</h2>
                            <Link href="/leaderboard" className="text-sm text-[#E4E4E4] hover:text-white">Leaderboard</Link>
                        </div>
                        {isLoadingTrades && recentTrades.length === 0 ? (
                            <p className="px-5 py-16 text-center text-sm text-[#E4E4E4]">Loading rounds.</p>
                        ) : recentTrades.length === 0 ? (
                            <div className="px-5 py-12 text-center">
                                <p className="text-sm text-white">No settled rounds yet.</p>
                                <Link href="/trade" className="mt-3 inline-block text-sm text-[#7005FC]">Place one on the chart</Link>
                            </div>
                        ) : (
                            <>
                            <ul className="max-h-[28rem] overflow-y-auto sm:hidden">
                                {recentTrades.map((trade: any, index: number) => (
                                    <li key={trade.id || index} className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 last:border-0">
                                        <div className="min-w-0">
                                            <p className="text-sm text-white"><AssetMark asset={trade.asset} /></p>
                                            <p className="mt-0.5 text-xs text-[#E4E4E4]">{directionLabel(trade.direction)} · {Number(trade.amount || 0).toFixed(4)}</p>
                                        </div>
                                        <p className={`shrink-0 font-mono text-sm ${resultClass(Boolean(trade.won))}`}>
                                            {trade.won ? `+${Number(trade.payout || 0).toFixed(4)}` : `-${Number(trade.amount || 0).toFixed(4)}`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="hidden max-h-[28rem] overflow-auto sm:block">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-[#1c1c1c]">
                                        <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.14em] text-[#B781FE]">
                                            <th className="px-5 py-3 font-medium">Market</th>
                                            <th className="px-5 py-3 font-medium">Side</th>
                                            <th className="px-5 py-3 font-medium">Stake</th>
                                            <th className="px-5 py-3 text-right font-medium">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTrades.map((trade: any, index: number) => (
                                            <tr key={trade.id || index} className="border-b border-white/10 last:border-0">
                                                <td className="px-5 py-3 text-sm text-white"><AssetMark asset={trade.asset} /></td>
                                                <td className="px-5 py-3 text-sm text-[#E4E4E4]">{directionLabel(trade.direction)}</td>
                                                <td className="px-5 py-3 font-mono text-sm text-[#E4E4E4]">{Number(trade.amount || 0).toFixed(4)}</td>
                                                <td className={`px-5 py-3 text-right font-mono text-sm ${resultClass(Boolean(trade.won))}`}>
                                                    {trade.won ? `+${Number(trade.payout || 0).toFixed(4)}` : `-${Number(trade.amount || 0).toFixed(4)}`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            </>
                        )}
                    </section>

                    <div className="flex flex-col gap-4">
                        <section className="panel p-5">
                            <h2 className="text-base text-white">Referral</h2>
                            <p className="mt-1 text-sm text-[#E4E4E4]">New traders who use this code are counted here.</p>
                            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#070010] px-3 py-3">
                                <span className="truncate font-mono text-sm text-white">{shownReferralCode || '—'}</span>
                                <button type="button" onClick={() => copyText(shownReferralCode || '', 'code')} className="shrink-0 text-sm text-[#7005FC]" disabled={!shownReferralCode}>
                                    {copied === 'code' ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!shownReferralCode?.trim()) {
                                        toast.error('Referral code is not ready yet.');
                                        return;
                                    }
                                    openReferralShareOnX(referralLandingUrl(shownReferralCode));
                                }}
                                className="neon-btn mt-3 h-11 w-full text-sm"
                            >
                                Share
                            </button>
                            <Link href="/referrals" className="mt-3 block text-center text-sm text-[#E4E4E4] hover:text-white">Rewards</Link>
                        </section>

                        {accessCode ? (
                            <section className="panel p-5">
                                <h2 className="text-base text-white">Access code</h2>
                                <p className="mt-2 font-mono text-sm text-[#7005FC]">{accessCode}</p>
                                <p className="mt-2 text-sm leading-6 text-[#E4E4E4]">Keep this code private. It unlocks the trading panel for this wallet.</p>
                            </section>
                        ) : null}

                        <Link href="/withdrawals" className="panel flex items-center justify-between px-5 py-4 text-sm text-white hover:border-[#7005FC]">
                            Withdrawals
                            <span className="text-[#B781FE]">Open</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
