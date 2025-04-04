
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      // Add provider options here when implementing specific wallet integrations
    },
  });
}

export type WalletType = 'metamask' | 'coinbase' | 'trustwallet' | 'phantom' | null;

export type WalletState = {
  address: string | null;
  connected: boolean;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  balance: string | null;
  networkName: string | null;
  walletType: WalletType;
};

export const initialWalletState: WalletState = {
  address: null,
  connected: false,
  chainId: null,
  provider: null,
  signer: null,
  balance: null,
  networkName: null,
  walletType: null,
};

export const connectWallet = async (walletType: WalletType = 'metamask'): Promise<WalletState> => {
  try {
    // Get the window object with ethereum providers
    const windowWithEthereum = window as unknown as { 
      ethereum?: any; 
      solana?: any; 
      phantom?: any;
    };
    
    // Get the specific provider based on the wallet type
    let provider;
    
    switch (walletType) {
      case 'metamask':
        // Ensure MetaMask is selected if multiple wallets are available
        if (windowWithEthereum.ethereum?.isMetaMask) {
          provider = windowWithEthereum.ethereum;
        }
        break;
      case 'coinbase':
        // Ensure Coinbase Wallet is selected
        if (windowWithEthereum.ethereum?.isCoinbaseWallet) {
          provider = windowWithEthereum.ethereum;
        }
        break;
      case 'trustwallet':
        // Ensure Trust Wallet is selected
        if (windowWithEthereum.ethereum?.isTrust) {
          provider = windowWithEthereum.ethereum;
        }
        break;
      case 'phantom':
        // For Phantom wallet which is primarily for Solana
        if (windowWithEthereum.phantom || windowWithEthereum.solana) {
          provider = windowWithEthereum.phantom || windowWithEthereum.solana;
          // This is a simplified example - actual Solana/Phantom integration would differ
          // For now, we'll mock it to work like other wallets for consistency
        }
        break;
      default:
        // Use web3Modal as fallback for other wallet types or if specific provider not found
        provider = await web3Modal.connect();
    }
    
    if (!provider) {
      throw new Error(`${walletType} wallet not available or not selected`);
    }
    
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    const network = await ethersProvider.getNetwork();
    const balance = ethers.utils.formatEther(
      await ethersProvider.getBalance(address)
    );
    
    const networkNames: Record<number, string> = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten',
      4: 'Rinkeby',
      5: 'Goerli',
      42: 'Kovan',
      56: 'Binance Smart Chain',
      137: 'Polygon',
      43114: 'Avalanche'
    };
    
    const networkName = networkNames[network.chainId] || `Chain ID: ${network.chainId}`;
    
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      window.location.reload();
    });
    
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      window.location.reload();
    });
    
    return {
      address,
      connected: true,
      chainId: network.chainId,
      provider: ethersProvider,
      signer,
      balance,
      networkName,
      walletType
    };
  } catch (error) {
    console.error(`Error connecting to ${walletType} wallet:`, error);
    return initialWalletState;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  await web3Modal.clearCachedProvider();
  window.location.reload();
};

export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to check if a wallet type is available
export const isWalletAvailable = (walletType: WalletType): boolean => {
  const windowWithEthereum = window as unknown as { ethereum?: any; solana?: any; phantom?: any; };
  
  switch (walletType) {
    case 'metamask':
      return !!windowWithEthereum.ethereum?.isMetaMask;
    case 'coinbase':
      return !!windowWithEthereum.ethereum?.isCoinbaseWallet;
    case 'trustwallet':
      return !!windowWithEthereum.ethereum?.isTrust;
    case 'phantom':
      return !!windowWithEthereum.phantom || !!windowWithEthereum.solana;
    default:
      return false;
  }
};
