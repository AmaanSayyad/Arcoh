'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { TokenLogo } from '@/components/ui/TokenLogo';
import { useOverflowStore } from '@/lib/store';
import { useToast } from '@/lib/hooks/useToast';
import { calculateFeeAmount, getFeePercent, getFeePercentLabel } from '@/lib/fees/platformFee';
import { consumeDepositCredit } from '@/lib/ui/depositPrompt';
import { friendlyTxError } from '@/lib/arc/txError';
import { USDC_GAS_RESERVE } from '@/lib/arc/wallet';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number, txHash: string) => void;
  onError?: (error: string) => void;
}

async function readTreasury(): Promise<string> {
  const response = await fetch('/api/treasury?network=ARC');
  if (!response.ok) return '';
  const data = await response.json();
  return String(data.address || '').trim();
}

function trim(value: number, digits = 4) {
  return Number(value.toFixed(digits)).toString();
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

const chip = (active: boolean) =>
  `h-8 rounded-lg border px-3 text-xs font-medium tabular-nums transition ${
    active ? 'border-[#7005FC] bg-[#7005FC]/25 text-white' : 'border-white/10 bg-white/[0.04] text-[#E4E4E4] hover:border-white/25'
  }`;

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const lastBalance = useRef<number | null>(null);
  const { depositFunds, address, walletBalance, userTier, refreshWalletBalance } = useOverflowStore();
  const toast = useToast();
  const feeLabel = getFeePercentLabel(userTier);
  const asset = 'USDC';

  const parsed = Number(amount);
  const hasAmount = Number.isFinite(parsed) && parsed > 0;
  const spendable = Math.max(0, walletBalance - USDC_GAS_RESERVE);
  const overWallet = hasAmount && parsed > spendable;
  const fee = hasAmount && !overWallet ? calculateFeeAmount(parsed, userTier) : 0;
  const credited = hasAmount && !overWallet ? Math.max(0, parsed - fee) : 0;

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    lastBalance.current = null;
    const credit = consumeDepositCredit();
    if (credit) setAmount(trim(Math.ceil((credit / (1 - getFeePercent(userTier))) * 10_000) / 10_000));
    else if (spendable > 0) setAmount((current) => current || trim(Math.floor(spendable * 10_000) / 10_000));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefill once per open
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !address) return;
    void refreshWalletBalance();
    const timer = window.setInterval(() => void refreshWalletBalance(), 6000);
    return () => window.clearInterval(timer);
  }, [isOpen, address, refreshWalletBalance]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = lastBalance.current;
    lastBalance.current = walletBalance;
    if (previous == null || walletBalance <= previous + 1e-9) return;
    const nextSpendable = Math.max(0, walletBalance - USDC_GAS_RESERVE);
    setAmount((current) => (current && Number(current) <= nextSpendable ? current : trim(Math.floor(nextSpendable * 10_000) / 10_000)));
  }, [walletBalance, isOpen]);

  const pickShare = (share: number) => {
    setAmount(trim(Math.floor(spendable * share * 10_000) / 10_000));
    setError(null);
  };

  const handleDeposit = async () => {
    const depositAmount = Number(amount);
    if (!address) {
      setError('Connect a wallet on Arc first.');
      return;
    }
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      setError('Enter a USDC amount.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const treasury = await readTreasury();
      if (!treasury) throw new Error('The Arc treasury is not configured.');
      const { depositUsdc } = await import('@/lib/arc/wallet');
      toast.info('Confirm the wallet to send USDC.');
      const txHash = await depositUsdc(depositAmount, treasury as `0x${string}`);
      await depositFunds(address, depositAmount, txHash);
      toast.success('USDC deposited.');
      onSuccess?.(depositAmount, txHash);
      onClose();
    } catch (err) {
      const message = friendlyTxError(err, 'The deposit did not go through. Try again.');
      setError(message);
      onError?.(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deposit USDC">
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-[#070010] px-3.5 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-white/60">
              Wallet on Arc
              {address ? <span className="ml-1.5 font-mono text-white/40">{shortAddress(address)}</span> : null}
            </p>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-white/45">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#82FF68]" />
              Live
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-2 text-[28px] font-medium leading-tight tabular-nums text-[#FCFBFF]">
            <TokenLogo token="USDC" size={26} />
            {trim(walletBalance)} <span className="text-base text-[#B781FE]">{asset}</span>
          </p>
          <p className="mt-1 text-[11px] text-white/45">{USDC_GAS_RESERVE} USDC stays in the wallet for gas.</p>
        </div>

        <div>
          <label htmlFor="deposit-amount" className="mb-1.5 block text-[11px] text-white/60">
            Amount to deposit
          </label>
          <div className="flex items-center rounded-xl border border-white/10 bg-[#070010] px-3.5 focus-within:border-[#7005FC]">
            <input
              id="deposit-amount"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value.replace(',', '.'));
                setError(null);
              }}
              inputMode="decimal"
              placeholder="0.00"
              className="h-12 min-w-0 flex-1 bg-transparent text-lg tabular-nums text-[#FCFBFF] outline-none placeholder:text-white/25"
            />
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#B781FE]">
              <TokenLogo token="USDC" size={16} />
              USDC
            </span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {[
              { label: '25%', share: 0.25 },
              { label: '50%', share: 0.5 },
              { label: 'Max', share: 1 },
            ].map(({ label, share }) => (
              <button
                key={label}
                type="button"
                disabled={spendable <= 0}
                onClick={() => pickShare(share)}
                className={`${chip(hasAmount && Math.abs(parsed - Math.floor(spendable * share * 10_000) / 10_000) < 1e-9)} flex-1 disabled:opacity-40`}
              >
                {label}
              </button>
            ))}
          </div>
          {hasAmount && !overWallet ? (
            <dl className="mt-3 space-y-1.5 rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-[12px]">
              <div className="flex justify-between text-white/60">
                <dt>Fee {feeLabel}</dt>
                <dd className="tabular-nums">−{trim(fee)} USDC</dd>
              </div>
              <div className="flex justify-between text-[#FCFBFF]">
                <dt>House balance gets</dt>
                <dd className="font-medium tabular-nums">{trim(credited)} USDC</dd>
              </div>
            </dl>
          ) : null}
          {overWallet ? (
            <p className="mt-2 text-sm text-[#FFB547]">This wallet can send {trim(spendable)} USDC after gas.</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => void copyAddress()}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#070010] px-3 py-2.5 text-left transition hover:border-white/25"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate font-mono text-[12px] text-white/90">{address || 'Connect a wallet'}</span>
            <span className="mt-0.5 block text-[11px] text-white/45">USDC on Arc · chain 5042</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#B781FE]">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>

        {error ? <p className="text-sm text-[#FF5C7A]">{error}</p> : null}

        <button
          type="button"
          disabled={isLoading || !hasAmount || overWallet}
          onClick={() => void handleDeposit()}
          className="neon-btn h-11 w-full text-sm disabled:opacity-50"
        >
          {isLoading ? 'Sending…' : hasAmount ? `Deposit ${trim(parsed)} USDC` : 'Enter an amount'}
        </button>
      </div>
    </Modal>
  );
};
