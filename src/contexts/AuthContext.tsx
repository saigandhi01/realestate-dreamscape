
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
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  connectWithEmail: (email: string, password: string) => Promise<void>;
  connectWithSocial: (provider: string) => Promise<void>;
  isConnecting: boolean;
  connectWithWallet: (walletType: WalletType) => Promise<void>;
  useTestAccount: () => void; // New function for demo account login
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
  isLoginModalOpen: false,
  closeLoginModal: () => {},
  connectWithEmail: async () => {},
  connectWithSocial: async () => {},
  isConnecting: false,
  connectWithWallet: async () => {},
  useTestAccount: () => {}, // Add to default context
});

export const useAuth = () => useContext(AuthContext);

// Demo accounts with ETH for testing
const testWallet: Wallet = {
  connected: true,
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  networkName: 'Ethereum',
  balance: '10.0', // 10 ETH for testing
  type: 'metamask',
  walletType: 'metamask',
};

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

  // Check for existing session on component mount and set up session listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsLoggedIn(false);
          setWallet(defaultWallet);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoggedIn(!!currentSession);
          
          // If logged in, set wallet info
          if (currentSession?.user) {
            // Check if it's the test account
            if (currentSession.user.email === 'demo@tokenestate.test') {
              setWallet(testWallet);
            } else {
              setWallet(mockWallet);
            }
          }
        }
      }
    );

    // THEN check for existing session (necessary for initial load)
    const initializeSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        setIsLoggedIn(true);
        
        // Set wallet based on user
        if (currentSession.user.email === 'demo@tokenestate.test') {
          setWallet(testWallet);
        } else {
          setWallet(mockWallet);
        }
      }
    };
    
    initializeSession();

    return () => subscription.unsubscribe();
  }, []);

  // Restore wallet state from localStorage if available
  useEffect(() => {
    // If user is logged in but wallet isn't set (could happen after refresh)
    if (isLoggedIn && !wallet.connected) {
      // Try to restore wallet from localStorage
      const storedWalletType = localStorage.getItem('walletType');
      
      if (storedWalletType) {
        // If we have a stored wallet type, restore the appropriate mock wallet
        if (user?.email === 'demo@tokenestate.test') {
          setWallet(testWallet);
        } else {
          setWallet(mockWallet);
        }
      }
    }
  }, [isLoggedIn, wallet.connected, user]);

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
      
      // Session will be handled by the onAuthStateChange listener
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
        
        // Store wallet type in localStorage for persistence
        localStorage.setItem('walletType', walletType || '');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
      closeLoginModal();
    }
  };

  // New function to use test account with ETH
  const useTestAccount = () => {
    // Demo login - simulates successful authentication
    const mockUser = {
      id: 'test-user-id-123456789',
      email: 'demo@tokenestate.test',
      // Add other required user properties
    } as User;
    
    // Create a mock session
    const mockSession = {
      user: mockUser,
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      // Add other required session properties
    } as Session;
    
    setUser(mockUser);
    setSession(mockSession);
    setIsLoggedIn(true);
    setWallet(testWallet);
    
    // Store wallet type in localStorage for persistence
    localStorage.setItem('walletType', 'metamask');
    
    closeLoginModal();
    
    // Add some sample data to the database for this test user
    // This would be handled by your backend in a real scenario
    console.log('Demo account activated with 10 ETH balance');
  };

  const disconnect = async () => {
    await supabase.auth.signOut();
    // Auth state listener will handle the rest
    localStorage.removeItem('walletType');
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
      connectWithWallet,
      useTestAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};
