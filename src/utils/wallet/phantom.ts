
import { WalletState } from './types';

export const connectPhantomWallet = async (): Promise<WalletState> => {
  const windowWithEthereum = window as unknown as { 
    ethereum?: any; 
    solana?: any; 
    phantom?: any;
  };
  
  const phantomProvider = windowWithEthereum.phantom?.solana || windowWithEthereum.solana;
  
  if (phantomProvider && phantomProvider.isPhantom) {
    console.log('Connecting to Phantom wallet...');
    
    try {
      // Connect to Phantom wallet with explicit request
      const response = await phantomProvider.connect({ onlyIfTrusted: false });
      console.log('Phantom connection response:', response);
      
      if (response.publicKey) {
        // Store the wallet type in local storage for persistence
        localStorage.setItem('walletType', 'phantom');
        
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
};
