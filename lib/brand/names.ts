/** Strip the old platform name from anything a person can see. */

export function displayUsername(name: string | null | undefined): string | null {
  if (!name) return name ?? null;
  return name.replace(/\.(achoh|bynomo|tapt)$/i, '.arcoh');
}

export function displayReferralCode(code: string | null | undefined): string | null {
  if (!code) return code ?? null;
  return code.replace(/^(achoh|bynomo|tapt)-/i, 'arcoh-');
}

/** Stored codes may still use an older prefix. Look up every form. */
export function referralCodeLookups(code: string): string[] {
  const trimmed = code.trim();
  const out = new Set<string>([trimmed]);
  const body = trimmed.replace(/^(arcoh|achoh|tapt|bynomo)-/i, '');
  if (body !== trimmed) {
    out.add(`arcoh-${body}`);
    out.add(`achoh-${body}`);
    out.add(`tapt-${body}`);
    out.add(`bynomo-${body}`);
  }
  return [...out];
}
