
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { fetchLiveWalletTokens, TokenBalance } from '@/utils/tokens';
import { WalletState } from '@/utils/wallet';

interface UseUserTokensProps {
  wallet: WalletState;
  enabled?: boolean;
}

interface UseUserTokensResult {
  tokens: TokenBalance[];
  nfts: TokenBalance[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserTokens = ({ wallet, enabled = true }: UseUserTokensProps): UseUserTokensResult => {
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!wallet.address || !enabled || !wallet.connected) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching live wallet tokens for:', {
        address: wallet.address,
        walletType: wallet.walletType,
        chainId: wallet.chainId
      });

      const { tokens: fetchedTokens, nfts: fetchedNfts, error: fetchError } = 
        await fetchLiveWalletTokens(
          wallet.address,
          wallet.provider as ethers.providers.Web3Provider,
          wallet.chainId || 1,
          wallet.walletType || undefined
        );

      if (fetchError) {
        setError(fetchError);
      } else {
        console.log('Fetched tokens:', fetchedTokens);
        setTokens(fetchedTokens);
        setNfts(fetchedNfts);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live wallet tokens');
      console.error('Error in useUserTokens hook:', err);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.address, wallet.chainId, wallet.connected, wallet.walletType, wallet.provider, enabled]);

  useEffect(() => {
    if (wallet.connected && enabled && wallet.address) {
      console.log('Wallet connected, fetching tokens...');
      fetchTokens();
    } else {
      // Clear tokens when wallet is disconnected
      setTokens([]);
      setNfts([]);
    }
  }, [fetchTokens]);

  const refetch = useCallback(async () => {
    await fetchTokens();
  }, [fetchTokens]);

  return { tokens, nfts, isLoading, error, refetch };
};

export default useUserTokens;
