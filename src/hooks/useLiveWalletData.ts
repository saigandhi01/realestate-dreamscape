
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '@/utils/wallet';
import { fetchSOLBalance } from '@/utils/wallet/phantom';

interface LiveWalletDataResult {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
}

export const useLiveWalletData = (wallet: WalletState): LiveWalletDataResult => {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchETHBalance = useCallback(async (provider: ethers.providers.Web3Provider, address: string): Promise<string> => {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet.connected || !wallet.address) {
      setBalance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching live balance for ${wallet.walletType} wallet:`, wallet.address);
      
      let fetchedBalance: string;

      if (wallet.walletType === 'phantom' && wallet.networkName === 'Solana') {
        fetchedBalance = await fetchSOLBalance(wallet.address);
      } else if (wallet.provider) {
        // For ETH-based wallets (MetaMask, Coinbase, Trust Wallet)
        fetchedBalance = await fetchETHBalance(wallet.provider as ethers.providers.Web3Provider, wallet.address);
      } else {
        throw new Error('No provider available for balance fetching');
      }

      setBalance(fetchedBalance);
      console.log(`Live balance fetched: ${fetchedBalance} ${wallet.networkName === 'Solana' ? 'SOL' : 'ETH'}`);
      
    } catch (err: any) {
      const errorMessage = `Failed to fetch live ${wallet.networkName === 'Solana' ? 'SOL' : 'ETH'} balance: ${err.message}`;
      setError(errorMessage);
      console.error('Live balance fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.connected, wallet.address, wallet.walletType, wallet.networkName, wallet.provider, fetchETHBalance]);

  // Auto-refresh balance when wallet changes
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      refreshBalance();
    } else {
      setBalance(null);
      setError(null);
    }
  }, [wallet.connected, wallet.address, wallet.walletType, refreshBalance]);

  return {
    balance,
    isLoading,
    error,
    refreshBalance
  };
};
