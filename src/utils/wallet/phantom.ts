
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
        // Try to fetch SOL balance using multiple endpoints
        let balance = "0";
        try {
          balance = await fetchSOLBalance(response.publicKey.toString());
        } catch (balanceError) {
          console.warn('Could not fetch SOL balance during connection:', balanceError);
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

// Helper function to fetch SOL balance with multiple RPC endpoints
export const fetchSOLBalance = async (address: string): Promise<string> => {
  const rpcEndpoints = [
    'https://api.devnet.solana.com', // Devnet is more lenient
    'https://solana-mainnet.g.alchemy.com/v2/demo', // Alchemy demo endpoint
    'https://api.mainnet-beta.solana.com', // Official endpoint as last resort
  ];

  for (const endpoint of rpcEndpoints) {
    try {
      console.log(`Trying SOL balance fetch from: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });

      const data = await response.json();
      
      if (data.result && !data.error) {
        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const lamports = data.result.value;
        const solBalance = lamports / 1000000000;
        console.log(`SOL balance fetched successfully: ${solBalance} SOL from ${endpoint}`);
        return solBalance.toString();
      } else if (data.error) {
        console.warn(`RPC error from ${endpoint}:`, data.error);
        continue; // Try next endpoint
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${endpoint}:`, error);
      continue; // Try next endpoint
    }
  }

  // If all endpoints fail, try to get balance from Phantom provider directly
  try {
    const windowWithSolana = window as any;
    const solanaProvider = windowWithSolana.phantom?.solana;
    
    if (solanaProvider && solanaProvider.getBalance) {
      const balance = await solanaProvider.getBalance();
      console.log('SOL balance from Phantom provider:', balance);
      return balance.toString();
    }
  } catch (providerError) {
    console.warn('Failed to get balance from Phantom provider:', providerError);
  }

  throw new Error('Unable to fetch SOL balance from any source');
};
