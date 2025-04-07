
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { WalletType, connectWallet, disconnectWallet, initialWalletState, WalletState } from '@/utils/wallet';

interface Wallet {
  connected: boolean;
  address: string;
  networkName: string;
  balance: string;
  type: string;
  walletType?: WalletType;
}

interface AuthContextType {
  isLoggedIn: boolean;
  wallet: Wallet;
  user: User | null;
  session: Session | null;
  openLoginModal: () => void;
  disconnect: () => void;
  needsWalletConnection: boolean;
  // Add missing properties
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  connectWithEmail: (email: string, password: string) => Promise<void>;
  connectWithSocial: (provider: string) => Promise<void>;
  isConnecting: boolean;
  connectWithWallet: (walletType: WalletType) => Promise<void>;
}

const defaultWallet: Wallet = {
  connected: false,
  address: '',
  networkName: '',
  balance: '0',
  type: '',
  walletType: null,
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  wallet: defaultWallet,
  user: null,
  session: null,
  openLoginModal: () => {},
  disconnect: () => {},
  needsWalletConnection: true,
  // Add default values for new properties
  isLoginModalOpen: false,
  closeLoginModal: () => {},
  connectWithEmail: async () => {},
  connectWithSocial: async () => {},
  isConnecting: false,
  connectWithWallet: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// For demo purposes, we're using this mock data
const mockWallet: Wallet = {
  connected: true,
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  networkName: 'Ethereum',
  balance: '1.234',
  type: 'metamask',
  walletType: 'metamask',
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

  // Check for existing session on component mount
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoggedIn(!!session);
        
        // If logged in, set wallet info
        if (session?.user) {
          setWallet(mockWallet);
        } else {
          setWallet(defaultWallet);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session);
      
      // If logged in, set wallet info
      if (session?.user) {
        setWallet(mockWallet);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      
      setIsLoggedIn(true);
      setWallet(mockWallet);
      closeLoginModal();
    } catch (error) {
      console.error('Email login error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithSocial = async (provider: string) => {
    setIsConnecting(true);
    try {
      // For the demo, we'll just simulate a login
      setTimeout(() => {
        setIsLoggedIn(true);
        setWallet(mockWallet);
        closeLoginModal();
        setIsConnecting(false);
      }, 1000);
    } catch (error) {
      console.error(`Social login error (${provider}):`, error);
      setIsConnecting(false);
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
        };
        setWallet(customWallet);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
      closeLoginModal();
    }
  };

  const disconnect = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setWallet(defaultWallet);
    setUser(null);
    setSession(null);
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
