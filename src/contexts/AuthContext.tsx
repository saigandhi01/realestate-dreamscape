import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { WalletType, connectWallet, disconnectWallet, initialWalletState, WalletState } from '@/utils/wallet';
import { toast } from '@/hooks/use-toast';
import { ethers } from 'ethers';

interface Wallet extends WalletState {
  type: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  wallet: Wallet;
  user: User | null;
  session: Session | null;
  openLoginModal: () => void;
  disconnect: () => void;
  needsWalletConnection: boolean;
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  connectWithEmail: (email: string, password: string) => Promise<void>;
  connectWithSocial: (provider: string) => Promise<void>;
  isConnecting: boolean;
  connectWithWallet: (walletType: WalletType) => Promise<void>;
}

const defaultWallet: Wallet = {
  connected: false,
  address: null,
  networkName: null,
  balance: null,
  type: '',
  walletType: null,
  chainId: null,
  provider: null,
  signer: null,
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  wallet: defaultWallet,
  user: null,
  session: null,
  openLoginModal: () => {},
  disconnect: () => {},
  needsWalletConnection: true,
  isLoginModalOpen: false,
  closeLoginModal: () => {},
  connectWithEmail: async () => {},
  connectWithSocial: async () => {},
  isConnecting: false,
  connectWithWallet: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const mockWallet: Wallet = {
  connected: true,
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  networkName: 'Ethereum',
  balance: '1.234',
  type: 'metamask',
  walletType: 'metamask',
  chainId: 1, // Ethereum Mainnet
  provider: null, // This will be null in mock data
  signer: null, // This will be null in mock data
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wallet, setWallet] = useState<Wallet>(defaultWallet);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsLoggedIn(false);
          setWallet(defaultWallet);
          localStorage.removeItem('walletType');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoggedIn(!!currentSession);
          
          if (currentSession?.user) {
            setWallet(mockWallet);
            localStorage.setItem('walletType', 'metamask');
          }
        }
      }
    );

    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession?.user?.email);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsLoggedIn(true);
          setWallet(mockWallet);
          localStorage.setItem('walletType', 'metamask');
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isInitialized && isLoggedIn && !wallet.connected) {
      const storedWalletType = localStorage.getItem('walletType');
      
      if (storedWalletType) {
        setWallet(mockWallet);
      }
    }
  }, [isInitialized, isLoggedIn, wallet.connected]);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const connectWithEmail = async (email: string, password: string) => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      closeLoginModal();
      return;
    } catch (error) {
      console.error('Email login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithSocial = async (provider: string) => {
    setIsConnecting(true);
    try {
      setTimeout(() => {
        setIsLoggedIn(true);
        setWallet(mockWallet);
        localStorage.setItem('walletType', 'metamask');
        closeLoginModal();
        setIsConnecting(false);
      }, 1000);
    } catch (error) {
      console.error(`Social login error (${provider}):`, error);
      setIsConnecting(false);
      toast({
        title: "Login Failed",
        description: `Failed to login with ${provider}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const connectWithWallet = async (walletType: WalletType) => {
    setIsConnecting(true);
    try {
      const walletState = await connectWallet(walletType);
      if (walletState.connected) {
        const customWallet: Wallet = {
          connected: walletState.connected,
          address: walletState.address || '',
          networkName: walletState.networkName || '',
          balance: walletState.balance || '0',
          type: walletState.walletType || '',
          walletType: walletState.walletType,
          chainId: walletState.chainId,
          provider: walletState.provider,
          signer: walletState.signer,
        };
        setWallet(customWallet);
        setIsLoggedIn(true);
        
        localStorage.setItem('walletType', walletType || '');

        const mockUser = {
          id: `wallet-${walletState.address}`,
          email: `${walletState.address.substring(2, 8)}@wallet.user`,
          aud: "authenticated",
          role: "authenticated"
        } as User;
        
        const mockSession = {
          user: mockUser,
          access_token: `mock-token-${Date.now()}`,
          refresh_token: `mock-refresh-${Date.now()}`
        } as Session;
        
        setUser(mockUser);
        setSession(mockSession);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      closeLoginModal();
    }
  };

  const disconnect = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('walletType');
      setWallet(defaultWallet);
      setIsLoggedIn(false);
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const needsWalletConnection = isLoggedIn && !wallet.connected;

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      wallet, 
      user,
      session,
      openLoginModal, 
      disconnect,
      needsWalletConnection,
      isLoginModalOpen,
      closeLoginModal,
      connectWithEmail,
      connectWithSocial,
      isConnecting,
      connectWithWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};
