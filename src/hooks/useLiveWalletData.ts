
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '@/utils/wallet';

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

  const fetchSOLBalance = useCallback(async (address: string): Promise<string> => {
    try {
      // Access Phantom's Solana provider
      const windowWithSolana = window as any;
      const solanaProvider = windowWithSolana.solana || windowWithSolana.phantom?.solana;
      
      if (!solanaProvider) {
        throw new Error('Solana provider not found');
      }

      // For Solana balance, we need to use Solana Web3.js or RPC calls
      // Since we don't have @solana/web3.js installed, we'll use a direct RPC call
      const response = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const lamports = data.result.value;
      const solBalance = lamports / 1000000000;
      
      return solBalance.toString();
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      // Fallback: try to get balance from wallet provider if available
      try {
        const windowWithSolana = window as any;
        const solanaProvider = windowWithSolana.solana || windowWithSolana.phantom?.solana;
        
        if (solanaProvider && solanaProvider.getBalance) {
          const balance = await solanaProvider.getBalance();
          return balance.toString();
        }
      } catch (fallbackError) {
        console.error('Fallback SOL balance fetch failed:', fallbackError);
      }
      
      throw error;
    }
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
  }, [wallet.connected, wallet.address, wallet.walletType, wallet.networkName, wallet.provider, fetchETHBalance, fetchSOLBalance]);

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
