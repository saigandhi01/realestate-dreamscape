
import { WalletType } from './types';

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
    case 'trust':
      return !!windowWithEthereum.ethereum?.isTrust;
    case 'phantom':
      // Check for Phantom wallet more thoroughly
      const hasPhantom = !!(windowWithEthereum.phantom?.solana || windowWithEthereum.solana?.isPhantom);
      console.log('Phantom detection result:', hasPhantom, {
        phantom: windowWithEthereum.phantom,
        solana: windowWithEthereum.solana
      });
      return hasPhantom;
    case 'demo':
      return true; // Demo wallet is always available
    default:
      return false;
  }
};
