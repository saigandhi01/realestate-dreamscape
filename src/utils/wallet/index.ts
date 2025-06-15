
import { WalletType, WalletState, initialWalletState } from './types';
import { web3Modal } from './constants';
import { connectPhantomWallet } from './phantom';
import { connectEVMWallet } from './evm';

// Re-export types and constants
export type { WalletType, WalletState };
export { initialWalletState };

// Re-export detection utilities
export { isWalletAvailable } from './detection';

export const connectWallet = async (walletType: WalletType = 'metamask'): Promise<WalletState> => {
  try {
    // Handle Phantom wallet separately since it's Solana-based
    if (walletType === 'phantom') {
      return await connectPhantomWallet();
    }
    
    // Handle EVM-based wallets (MetaMask, Coinbase, Trust Wallet)
    return await connectEVMWallet(walletType as Exclude<WalletType, 'phantom'>);
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
