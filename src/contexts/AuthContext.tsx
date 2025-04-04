
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  connectWallet, 
  disconnectWallet, 
  initialWalletState,
  WalletState,
  web3Modal,
  truncateAddress,
  WalletType,
  isWalletAvailable
} from '@/utils/wallet';
import {
  showLoginSuccessToast,
  showLogoutToast,
  showWalletConnectedToast,
  showKycVerifiedToast
} from '@/contexts/AuthContext-extension';

// Type for window with ethereum property
interface WindowWithEthereum {
  ethereum?: any;
}

interface AuthContextType {
  wallet: WalletState;
  isConnecting: boolean;
  connectWithMetamask: () => Promise<void>;
  connectWithCoinbase: () => Promise<void>;
  connectWithTrustWallet: () => Promise<void>;
  connectWithPhantom: () => Promise<void>;
  connectWithWallet: (walletType: WalletType) => Promise<void>;
  connectWithEmail: (email: string, password: string) => Promise<void>;
  connectWithSocial: (provider: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  needsWalletConnection: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Track if logged in user has not connected a wallet
  const needsWalletConnection = isLoggedIn && !wallet.connected;

  const connectWithWallet = async (walletType: WalletType) => {
    if (!walletType || !isWalletAvailable(walletType)) {
      toast({
        title: `${walletType} wallet not detected`,
        description: `Please install ${walletType} wallet extension to connect`,
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    try {
      const walletState = await connectWallet(walletType);
      setWallet(walletState);
      if (walletState.connected) {
        // Use the extension toast
        if (walletState.address) {
          showWalletConnectedToast(walletState.address);
        }
        closeLoginModal();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection failed",
        description: `Failed to connect to ${walletType} wallet`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithMetamask = async () => {
    const windowWithEthereum = window as unknown as WindowWithEthereum;
    if (!windowWithEthereum.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask browser extension to connect",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    try {
      const walletState = await connectWallet('metamask');
      setWallet(walletState);
      if (walletState.connected) {
        setIsLoggedIn(true);
        // Use the extension toast
        if (walletState.address) {
          showWalletConnectedToast(walletState.address);
        }
        closeLoginModal();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Connection failed",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithCoinbase = () => connectWithWallet('coinbase');
  const connectWithTrustWallet = () => connectWithWallet('trustwallet');
  const connectWithPhantom = () => connectWithWallet('phantom');

  const connectWithEmail = async (email: string, password: string) => {
    setIsConnecting(true);
    try {
      // In a real app, this would make an API call to authenticate
      // For demonstration, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoggedIn(true);
      // Use the extension toast
      showLoginSuccessToast(email);
      closeLoginModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithSocial = async (provider: string) => {
    setIsConnecting(true);
    try {
      // In a real app, this would redirect to OAuth flow
      // For demonstration, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoggedIn(true);
      // Use the default toast for social login
      showLoginSuccessToast(provider);
      closeLoginModal();
    } catch (error) {
      console.error(error);
      toast({
        title: "Social login failed",
        description: `Could not connect with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setWallet(initialWalletState);
      setIsLoggedIn(false);
      // Use the extension toast
      showLogoutToast();
    } catch (error) {
      console.error(error);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    // Check if user was previously connected
    const windowWithEthereum = window as unknown as WindowWithEthereum;
    if (windowWithEthereum.ethereum && web3Modal?.cachedProvider) {
      connectWithMetamask();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        wallet,
        isConnecting,
        connectWithMetamask,
        connectWithCoinbase,
        connectWithTrustWallet,
        connectWithPhantom,
        connectWithWallet,
        connectWithEmail,
        connectWithSocial,
        disconnect,
        isLoggedIn,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        needsWalletConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

