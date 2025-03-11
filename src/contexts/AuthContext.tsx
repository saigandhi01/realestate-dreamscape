
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  connectWallet, 
  disconnectWallet, 
  initialWalletState,
  WalletState,
  web3Modal
} from '@/utils/wallet';

interface AuthContextType {
  wallet: WalletState;
  isConnecting: boolean;
  connectWithMetamask: () => Promise<void>;
  disconnect: () => Promise<void>;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const connectWithMetamask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not detected",
        description: "Please install MetaMask browser extension to connect",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    try {
      const walletState = await connectWallet();
      setWallet(walletState);
      if (walletState.connected) {
        setIsLoggedIn(true);
        toast({
          title: "Wallet connected",
          description: `Connected to ${walletState.networkName}`,
        });
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

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setWallet(initialWalletState);
      setIsLoggedIn(false);
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    // Check if user was previously connected
    if (window.ethereum && web3Modal?.cachedProvider) {
      connectWithMetamask();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        wallet,
        isConnecting,
        connectWithMetamask,
        disconnect,
        isLoggedIn,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
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
