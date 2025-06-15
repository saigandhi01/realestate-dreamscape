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
        // Request MetaMask provider specifically
        if (windowWithEthereum.ethereum?.isMetaMask) {
          provider = windowWithEthereum.ethereum;
          // Request account access
          await provider.request({ method: 'eth_requestAccounts' });
        } else {
          throw new Error('MetaMask not available');
        }
        break;
      case 'coinbase':
        // Request Coinbase Wallet provider specifically
        if (windowWithEthereum.ethereum?.isCoinbaseWallet) {
          provider = windowWithEthereum.ethereum;
          // Request account access
          await provider.request({ method: 'eth_requestAccounts' });
        } else {
          throw new Error('Coinbase Wallet not available');
        }
        break;
      case 'trustwallet':
        // Request Trust Wallet provider specifically
        if (windowWithEthereum.ethereum?.isTrust) {
          provider = windowWithEthereum.ethereum;
          // Request account access
          await provider.request({ method: 'eth_requestAccounts' });
        } else {
          throw new Error('Trust Wallet not available');
        }
        break;
      case 'phantom':
        // For Phantom wallet - improved detection and connection
        const phantomProvider = windowWithEthereum.phantom?.solana || windowWithEthereum.solana;
        
        if (phantomProvider && phantomProvider.isPhantom) {
          console.log('Connecting to Phantom wallet...');
          
          try {
            // Connect to Phantom wallet with explicit request
            const response = await phantomProvider.connect({ onlyIfTrusted: false });
            console.log('Phantom connection response:', response);
            
            if (response.publicKey) {
              return {
                address: response.publicKey.toString(),
                connected: true,
                chainId: 0, // Solana doesn't use EVM chainId
                provider: null, // Not an EVM provider
                signer: null,
                balance: "0", // Would need Solana-specific balance fetching
                networkName: "Solana",
                walletType: 'phantom'
              };
            } else {
              throw new Error('Failed to get public key from Phantom');
            }
          } catch (phantomError) {
            console.error('Phantom connection error:', phantomError);
            throw new Error(`Phantom connection failed: ${phantomError.message}`);
          }
        } else {
          throw new Error('Phantom Wallet not available. Please install Phantom wallet extension.');
        }
        break;
      default:
        // Use web3Modal as fallback for other wallet types or if specific provider not found
        provider = await web3Modal.connect();
    }
    
    if (!provider && walletType !== 'phantom') {
      throw new Error(`${walletType} wallet not available or not selected`);
    }
    
    // Create ethers provider from the wallet provider (skip for phantom)
    if (walletType !== 'phantom') {
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
      
      // Create wallet state
      const walletState: WalletState = {
        address,
        connected: true,
        chainId: network.chainId,
        provider: ethersProvider,
        signer,
        balance,
        networkName,
        walletType
      };
      
      // Store the wallet type in local storage for persistence
      localStorage.setItem('walletType', walletType || '');
      
      console.log(`Successfully connected to ${walletType} wallet:`, walletState);
      
      return walletState;
    }
    
    // This should not be reached, but return initial state as fallback
    return initialWalletState;
  } catch (error) {
    console.error(`Error connecting to ${walletType} wallet:`, error);
    throw error; // Re-throw the error so the UI can handle it properly
  }
};

export const disconnectWallet = async (): Promise<void> => {
  // Clear any stored wallet type
  localStorage.removeItem('walletType');
  
  // Clear web3modal cache
  if (web3Modal) {
    await web3Modal.clearCachedProvider();
  }
  
  // Reload the page to reset all connection states
  window.location.reload();
};

export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Utility function to check if a wallet type is available
export const isWalletAvailable = (walletType: WalletType): boolean => {
  if (typeof window === 'undefined') return false;
  
  const windowWithEthereum = window as unknown as { 
    ethereum?: any; 
    solana?: any; 
    phantom?: any;
  };
  
  // Log wallet detection attempt
  console.log(`Checking availability of ${walletType} wallet`);
  
  switch (walletType) {
    case 'metamask':
      return !!windowWithEthereum.ethereum?.isMetaMask;
    case 'coinbase':
      return !!windowWithEthereum.ethereum?.isCoinbaseWallet;
    case 'trustwallet':
      return !!windowWithEthereum.ethereum?.isTrust;
    case 'phantom':
      // Check for Phantom wallet more thoroughly
      const hasPhantom = !!(windowWithEthereum.phantom?.solana || windowWithEthereum.solana?.isPhantom);
      console.log('Phantom detection result:', hasPhantom, {
        phantom: windowWithEthereum.phantom,
        solana: windowWithEthereum.solana
      });
      return hasPhantom;
    default:
      return false;
  }
};
