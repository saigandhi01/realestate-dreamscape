
import { ethers } from "ethers";
import { WalletType, WalletState } from './types';
import { web3Modal, networkNames } from './constants';

export const connectEVMWallet = async (walletType: Exclude<WalletType, 'phantom'>): Promise<WalletState> => {
  const windowWithEthereum = window as unknown as { 
    ethereum?: any; 
  };
  
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
    default:
      // Use web3Modal as fallback for other wallet types
      provider = await web3Modal.connect();
  }
  
  if (!provider) {
    throw new Error(`${walletType} wallet not available or not selected`);
  }
  
  // Create ethers provider from the wallet provider
  const ethersProvider = new ethers.providers.Web3Provider(provider);
  const signer = ethersProvider.getSigner();
  const address = await signer.getAddress();
  const network = await ethersProvider.getNetwork();
  const balance = ethers.utils.formatEther(
    await ethersProvider.getBalance(address)
  );
  
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
};
