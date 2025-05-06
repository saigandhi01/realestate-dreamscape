
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { fetchUserTokens, TokenBalance } from '@/utils/tokens';
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

  const fetchTokens = async () => {
    if (!wallet.address || !enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { tokens: fetchedTokens, nfts: fetchedNfts, error: fetchError } = 
        await fetchUserTokens(
          wallet.address,
          wallet.provider as ethers.providers.Web3Provider,
          wallet.chainId || 1
        );

      if (fetchError) {
        setError(fetchError);
      } else {
        setTokens(fetchedTokens);
        setNfts(fetchedNfts);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tokens');
      console.error('Error in useUserTokens hook:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.connected && enabled) {
      fetchTokens();
    }
  }, [wallet.address, wallet.chainId, enabled]);

  const refetch = async () => {
    await fetchTokens();
  };

  return { tokens, nfts, isLoading, error, refetch };
};

export default useUserTokens;
