
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

// Enhanced Solana token balance fetching with multiple RPC endpoints
export const getSolanaTokenBalances = async (
  phantomProvider: any,
  address: string
): Promise<TokenBalance[]> => {
  try {
    console.log('🔍 Fetching Solana token balances for address:', address);
    
    if (!phantomProvider || !phantomProvider.isPhantom) {
      console.log('❌ Phantom provider not available or not connected');
      return [];
    }

    const tokens: TokenBalance[] = [];
    
    // Multiple Solana RPC endpoints for better reliability
    const rpcEndpoints = [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana'
    ];
    
    // Try different RPC endpoints
    for (const rpcUrl of rpcEndpoints) {
      try {
        console.log(`🌐 Trying RPC endpoint: ${rpcUrl}`);
        
        const response = await fetch(rpcUrl, {
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
        console.log(`📊 SOL balance response from ${rpcUrl}:`, data);
        
        if (data.result && typeof data.result.value === 'number') {
          const lamports = data.result.value;
          const balance = lamports / 1000000000; // Convert lamports to SOL
          
          console.log(`💰 SOL balance found: ${balance} SOL (${lamports} lamports)`);
          
          if (balance > 0) {
            tokens.push({
              type: 'SPL',
              name: 'Solana',
              symbol: 'SOL',
              address: 'So11111111111111111111111111111111111111112',
              balance: lamports.toString(),
              formattedBalance: balance.toFixed(6),
              decimals: 9,
              chain: 'Solana',
              logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
            });
          }
          break; // Successfully got balance, exit loop
        } else {
          console.log(`⚠️ Invalid response from ${rpcUrl}:`, data);
        }
      } catch (rpcError) {
        console.error(`❌ Error with RPC ${rpcUrl}:`, rpcError);
        continue; // Try next RPC endpoint
      }
    }

    // Try using Phantom's built-in balance method if available
    if (tokens.length === 0 && phantomProvider.getBalance) {
      try {
        console.log('🔄 Trying Phantom built-in balance method...');
        const balance = await phantomProvider.getBalance();
        if (balance && balance > 0) {
          console.log(`💰 Phantom balance found: ${balance} SOL`);
          tokens.push({
            type: 'SPL',
            name: 'Solana',
            symbol: 'SOL',
            address: 'So11111111111111111111111111111111111111112',
            balance: (balance * 1000000000).toString(),
            formattedBalance: balance.toFixed(6),
            decimals: 9,
            chain: 'Solana',
            logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png'
          });
        }
      } catch (phantomError) {
        console.error('❌ Error with Phantom balance method:', phantomError);
      }
    }

    console.log(`✅ Total Solana tokens found: ${tokens.length}`);
    return tokens;
  } catch (error) {
    console.error('❌ Error fetching Solana tokens:', error);
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
    console.log('🚀 fetchLiveWalletTokens called with:', {
      address,
      chainId,
      walletType,
      hasProvider: !!provider
    });

    if (!address) {
      return { tokens: [], nfts: [], error: 'No wallet address provided' };
    }

    let tokens: TokenBalance[] = [];

    // Handle Phantom wallet (Solana)
    if (walletType === 'phantom') {
      console.log('👻 Handling Phantom wallet...');
      const windowWithEthereum = window as any;
      const phantomProvider = windowWithEthereum.phantom?.solana || windowWithEthereum.solana;
      
      if (phantomProvider) {
        console.log('✅ Phantom provider found, fetching Solana tokens...');
        const solanaTokens = await getSolanaTokenBalances(phantomProvider, address);
        tokens = [...tokens, ...solanaTokens];
        console.log('📝 Solana tokens fetched:', solanaTokens);
      } else {
        console.log('❌ Phantom provider not found');
      }
      
      return { tokens, nfts: [], error: null };
    }

    // Handle Ethereum-based wallets (MetaMask, Coinbase, etc.)
    if (provider && chainId) {
      console.log('🦊 Handling EVM wallet...');
      
      // Get native token (ETH, MATIC, etc.)
      console.log('💎 Fetching native token balance...');
      const nativeToken = await getNativeTokenBalance(provider, address, chainId);
      if (nativeToken) {
        console.log('✅ Native token found:', nativeToken);
        tokens.push(nativeToken);
      }

      // Get target ERC-20 tokens
      const targetTokens = TARGET_TOKENS[chainId] || [];
      console.log('🎯 Target tokens for chain', chainId, ':', targetTokens);
      
      for (const tokenInfo of targetTokens) {
        try {
          console.log('🔍 Fetching balance for token:', tokenInfo.symbol);
          const tokenBalance = await getERC20TokenBalance(
            provider,
            address,
            tokenInfo.address,
            tokenInfo,
            chainId
          );
          if (tokenBalance) {
            console.log('✅ Token balance found:', tokenBalance);
            tokens.push(tokenBalance);
          } else {
            console.log('⚠️ No balance found for token:', tokenInfo.symbol);
          }
        } catch (error) {
          console.error(`❌ Error fetching ${tokenInfo.symbol} balance:`, error);
        }
      }
    }

    console.log(`🎉 Total tokens found: ${tokens.length}`);
    return { tokens, nfts: [], error: null };
  } catch (error: any) {
    console.error('❌ Error fetching live wallet tokens:', error);
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
