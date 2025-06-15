
import { ethers } from "ethers";

// Standard ERC-20 Token ABI (minimal needed for balance check)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)"
];

export type TokenType = 'ERC20' | 'ERC721' | 'ERC1155' | 'NATIVE' | 'SPL';

export interface TokenBalance {
  type: TokenType;
  name: string;
  symbol: string;
  address: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
  chain: string;
  logo?: string;
  tokenId?: string;
  metadata?: any;
  price?: number;
  value?: number;
}

// Networks supported by our application
export interface NetworkConfig {
  name: string;
  chainId: number;
  nativeCurrency: {
    symbol: string;
    name: string;
    decimals: number;
  };
  rpcUrl: string;
  blockExplorerUrl: string;
  iconUrl?: string;
}

export const NETWORKS: { [chainId: number]: NetworkConfig } = {
  1: {
    name: 'Ethereum',
    chainId: 1,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrl: 'https://ethereum.publicnode.com',
    blockExplorerUrl: 'https://etherscan.io',
    iconUrl: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png'
  },
  137: {
    name: 'Polygon',
    chainId: 137,
    nativeCurrency: {
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com',
    iconUrl: 'https://polygon.technology/logos/polygon-token-white.svg'
  },
  56: {
    name: 'BNB Smart Chain',
    chainId: 56,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    blockExplorerUrl: 'https://bscscan.com',
    iconUrl: 'https://assets.coingecko.com/coins/images/12591/small/binance-coin-logo.png'
  },
};

// Define the target tokens we want to display
const TARGET_TOKENS = {
  1: [ // Ethereum Mainnet
    {
      address: '0xA0b86a33E6417bab9c3f3aB3c5c5A9b7cbDB3a9F',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png'
    }
  ]
};

// Fetch Native Token Balance (ETH, MATIC, etc.)
export const getNativeTokenBalance = async (
  provider: ethers.providers.Provider,
  address: string,
  chainId: number
): Promise<TokenBalance | null> => {
  try {
    const balance = await provider.getBalance(address);
    const network = NETWORKS[chainId];
    
    if (!network) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    return {
      type: 'NATIVE',
      name: network.nativeCurrency.name,
      symbol: network.nativeCurrency.symbol,
      address: '0x0000000000000000000000000000000000000000',
      balance: balance.toString(),
      formattedBalance: ethers.utils.formatUnits(balance, network.nativeCurrency.decimals),
      decimals: network.nativeCurrency.decimals,
      chain: network.name,
      logo: network.iconUrl
    };
  } catch (error) {
    console.error('Error fetching native token balance:', error);
    return null;
  }
};

// Fetch ERC-20 Token Balance
export const getERC20TokenBalance = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  tokenAddress: string,
  tokenInfo: any,
  chainId: number
): Promise<TokenBalance | null> => {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    const network = NETWORKS[chainId];
    
    if (!balance || balance.isZero()) {
      return null;
    }
    
    if (!network) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    return {
      type: 'ERC20',
      name: tokenInfo.name,
      symbol: tokenInfo.symbol,
      address: tokenAddress,
      balance: balance.toString(),
      formattedBalance: ethers.utils.formatUnits(balance, tokenInfo.decimals),
      decimals: tokenInfo.decimals,
      chain: network.name,
      logo: tokenInfo.logo
    };
  } catch (error) {
    console.error(`Error fetching ERC-20 balance for ${tokenAddress}:`, error);
    return null;
  }
};

// Fetch Solana token balances for Phantom wallet
export const getSolanaTokenBalances = async (
  phantomProvider: any,
  address: string
): Promise<TokenBalance[]> => {
  try {
    if (!phantomProvider || !phantomProvider.isPhantom) {
      return [];
    }

    const tokens: TokenBalance[] = [];
    
    // Add SOL native token
    try {
      const response = await fetch(`https://api.mainnet-beta.solana.com`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address],
        }),
      });
      
      const data = await response.json();
      if (data.result) {
        const balance = data.result.value / 1000000000; // Convert lamports to SOL
        tokens.push({
          type: 'SPL',
          name: 'Solana',
          symbol: 'SOL',
          address: 'So11111111111111111111111111111111111111112',
          balance: data.result.value.toString(),
          formattedBalance: balance.toFixed(6),
          decimals: 9,
          chain: 'Solana',
          logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
        });
      }
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
    }

    return tokens;
  } catch (error) {
    console.error('Error fetching Solana tokens:', error);
    return [];
  }
};

// Fetch BTC balance (this would typically require a different API)
export const getBitcoinBalance = async (address: string): Promise<TokenBalance | null> => {
  try {
    // For Bitcoin, we'd typically need to use a Bitcoin API
    // For now, return a placeholder since we can't directly connect to Bitcoin from MetaMask
    console.log('Bitcoin balance fetching not implemented for direct wallet connection');
    return null;
  } catch (error) {
    console.error('Error fetching Bitcoin balance:', error);
    return null;
  }
};

// Main function to fetch live wallet tokens
export const fetchLiveWalletTokens = async (
  address: string,
  provider?: ethers.providers.Web3Provider | null,
  chainId: number = 1,
  walletType?: string
): Promise<{
  tokens: TokenBalance[];
  nfts: TokenBalance[];
  error: string | null;
}> => {
  try {
    if (!address) {
      return { tokens: [], nfts: [], error: 'No wallet address provided' };
    }

    let tokens: TokenBalance[] = [];

    // Handle Phantom wallet (Solana)
    if (walletType === 'phantom') {
      const windowWithEthereum = window as any;
      const phantomProvider = windowWithEthereum.phantom || windowWithEthereum.solana;
      
      if (phantomProvider) {
        const solanaTokens = await getSolanaTokenBalances(phantomProvider, address);
        tokens = [...tokens, ...solanaTokens];
      }
      
      return { tokens, nfts: [], error: null };
    }

    // Handle Ethereum-based wallets (MetaMask, Coinbase, etc.)
    if (provider && chainId) {
      // Get native token (ETH, MATIC, etc.)
      const nativeToken = await getNativeTokenBalance(provider, address, chainId);
      if (nativeToken) {
        tokens.push(nativeToken);
      }

      // Get target ERC-20 tokens
      const targetTokens = TARGET_TOKENS[chainId] || [];
      
      for (const tokenInfo of targetTokens) {
        try {
          const tokenBalance = await getERC20TokenBalance(
            provider,
            address,
            tokenInfo.address,
            tokenInfo,
            chainId
          );
          if (tokenBalance) {
            tokens.push(tokenBalance);
          }
        } catch (error) {
          console.error(`Error fetching ${tokenInfo.symbol} balance:`, error);
        }
      }
    }

    // Note: BTC would require a separate API call since it's not directly accessible via MetaMask
    // You'd need to use services like BlockCypher, Blockchain.info API, etc.

    return { tokens, nfts: [], error: null };
  } catch (error: any) {
    console.error('Error fetching live wallet tokens:', error);
    return { tokens: [], nfts: [], error: error.message || 'Failed to fetch live tokens' };
  }
};

// Legacy function for compatibility - now delegates to live wallet fetching
export const fetchUserTokens = async (
  address: string,
  provider?: ethers.providers.Web3Provider | null,
  chainId: number = 1
): Promise<{
  tokens: TokenBalance[];
  nfts: TokenBalance[];
  loading?: boolean;
  error: string | null;
}> => {
  const result = await fetchLiveWalletTokens(address, provider, chainId);
  return result;
};
