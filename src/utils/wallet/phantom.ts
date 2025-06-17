
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
        // Try to fetch SOL balance
        let balance = "0";
        try {
          // Use Solana RPC to fetch balance
          const rpcResponse = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'getBalance',
              params: [response.publicKey.toString()]
            })
          });

          const balanceData = await rpcResponse.json();
          
          if (balanceData.result && !balanceData.error) {
            // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
            const lamports = balanceData.result.value;
            const solBalance = lamports / 1000000000;
            balance = solBalance.toString();
            console.log(`Phantom SOL balance: ${balance} SOL`);
          }
        } catch (balanceError) {
          console.warn('Could not fetch SOL balance:', balanceError);
        }

        // Store the wallet type in local storage for persistence
        localStorage.setItem('walletType', 'phantom');
        
        return {
          address: response.publicKey.toString(),
          connected: true,
          chainId: 0, // Solana doesn't use EVM chainId
          provider: null, // Not an EVM provider
          signer: null,
          balance: balance,
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
