import { ethers } from 'ethers';

/** Arc addresses are standard EVM addresses. */
export const isValidAddress = async (address: string): Promise<boolean> => {
  if (!address) return false;
  return ethers.isAddress(address);
};
