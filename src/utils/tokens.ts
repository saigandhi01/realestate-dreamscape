
import { ethers } from "ethers";

// Standard ERC-20 Token ABI (minimal needed for balance check)
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)"
];

// Standard ERC-721 Token ABI (minimal needed for NFT detection)
const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

export type TokenType = 'ERC20' | 'ERC721' | 'ERC1155' | 'NATIVE';

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
  // Add more networks as needed
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
      address: '0x0000000000000000000000000000000000000000', // Convention for native token
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
  chainId: number
): Promise<TokenBalance | null> => {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const network = NETWORKS[chainId];
    
    if (!balance || balance.isZero()) {
      return null; // Don't return zero balances
    }
    
    if (!network) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    return {
      type: 'ERC20',
      name,
      symbol,
      address: tokenAddress,
      balance: balance.toString(),
      formattedBalance: ethers.utils.formatUnits(balance, decimals),
      decimals,
      chain: network.name,
      logo: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${network.name.toLowerCase()}/assets/${tokenAddress}/logo.png`
    };
  } catch (error) {
    console.error(`Error fetching ERC-20 balance for ${tokenAddress}:`, error);
    return null;
  }
};

// Fetch NFTs (ERC-721 tokens)
export const getERC721TokensForOwner = async (
  provider: ethers.providers.Provider,
  userAddress: string,
  contractAddress: string,
  chainId: number
): Promise<TokenBalance[]> => {
  try {
    const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
    const balance = await contract.balanceOf(userAddress);
    
    if (balance.eq(0)) {
      return [];
    }
    
    const name = await contract.name();
    const symbol = await contract.symbol();
    const network = NETWORKS[chainId];
    
    if (!network) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    const nfts: TokenBalance[] = [];
    
    // Fetch each NFT token ID and metadata
    for (let i = 0; i < balance.toNumber(); i++) {
      try {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        let metadata: any = {};
        
        try {
          const tokenURI = await contract.tokenURI(tokenId);
          // If it's IPFS URI, convert to HTTP
          const metadataUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
          
          // Fetch metadata (will handle this in real implementation)
          // For now just store the URL
          metadata = { tokenURI: metadataUrl };
        } catch (e) {
          console.warn(`Could not fetch token URI for token ID ${tokenId}`, e);
        }
        
        nfts.push({
          type: 'ERC721',
          name,
          symbol,
          address: contractAddress,
          balance: '1', // NFTs are non-fungible, so you own 1 of each token ID
          formattedBalance: '1',
          decimals: 0,
          chain: network.name,
          tokenId: tokenId.toString(),
          metadata
        });
      } catch (e) {
        console.warn(`Error fetching NFT at index ${i}:`, e);
      }
    }
    
    return nfts;
  } catch (error) {
    console.error(`Error fetching ERC-721 tokens from ${contractAddress}:`, error);
    return [];
  }
};

// Utility function to fetch token balances from a public API
// This is a fallback when we don't have a list of contract addresses
export const fetchTokenBalancesFromAPI = async (
  address: string,
  chainId: number
): Promise<TokenBalance[]> => {
  try {
    // We'll use the Covalent API as an example
    // In a production app, you'd want to hide this key in an environment variable
    // For the purposes of this demo, we're using their public API key
    const apiKey = 'cqt_rQVQCkxfJqPMjkMqJWWQHGDKMvPX'; // Replace with your API key
    const network = NETWORKS[chainId];
    
    if (!network) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.items) {
      return [];
    }
    
    const tokens: TokenBalance[] = [];
    
    // Process the response
    for (const item of data.data.items) {
      if (item.balance === '0') continue; // Skip zero balances
      
      const tokenType = item.type === 'nft' ? 'ERC721' :
                       item.type === 'cryptocurrency' && item.native_token ? 'NATIVE' : 'ERC20';
      
      tokens.push({
        type: tokenType as TokenType,
        name: item.contract_name || 'Unknown',
        symbol: item.contract_ticker_symbol || '???',
        address: item.contract_address,
        balance: item.balance,
        formattedBalance: ethers.utils.formatUnits(item.balance, item.contract_decimals),
        decimals: item.contract_decimals,
        chain: network.name,
        logo: item.logo_url,
        tokenId: item.nft_data ? item.nft_data[0]?.token_id : undefined,
        metadata: item.nft_data ? item.nft_data[0] : undefined
      });
    }
    
    return tokens;
  } catch (error) {
    console.error(`Error fetching tokens from API for chain ${chainId}:`, error);
    return [];
  }
};

// Main function to fetch all tokens and NFTs for a user
export const fetchUserTokens = async (
  address: string,
  provider?: ethers.providers.Web3Provider | null,
  chainId: number = 1 // Default to Ethereum
): Promise<{
  tokens: TokenBalance[];
  nfts: TokenBalance[];
  loading?: boolean;
  error: string | null;
}> => {
  try {
    if (!address) {
      return { tokens: [], nfts: [], error: 'No wallet address provided' };
    }
    
    let results: TokenBalance[] = [];
    
    // Get native token balance if provider is available
    if (provider) {
      const nativeToken = await getNativeTokenBalance(provider, address, chainId);
      if (nativeToken) {
        results.push(nativeToken);
      }
    }
    
    // Use public API to fetch token balances
    const apiResults = await fetchTokenBalancesFromAPI(address, chainId);
    results = [...results, ...apiResults];
    
    // Separate tokens and NFTs
    const tokens = results.filter(token => token.type === 'NATIVE' || token.type === 'ERC20');
    const nfts = results.filter(token => token.type === 'ERC721' || token.type === 'ERC1155');
    
    return { tokens, nfts, error: null };
  } catch (error: any) {
    console.error('Error fetching user tokens:', error);
    return { tokens: [], nfts: [], error: error.message || 'Failed to fetch tokens' };
  }
};
