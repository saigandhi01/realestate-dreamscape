
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Wallet {
  connected: boolean;
  address: string;
  networkName: string;
  balance: string;
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
}

const defaultWallet: Wallet = {
  connected: false,
  address: '',
  networkName: '',
  balance: '0',
  type: '',
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  wallet: defaultWallet,
  user: null,
  session: null,
  openLoginModal: () => {},
  disconnect: () => {},
  needsWalletConnection: true,
});

export const useAuth = () => useContext(AuthContext);

// For demo purposes, we're using this mock data
const mockWallet: Wallet = {
  connected: true,
  address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  networkName: 'Ethereum',
  balance: '1.234',
  type: 'metamask',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wallet, setWallet] = useState<Wallet>(defaultWallet);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
    // For the demo, we'll just simulate a login
    setTimeout(() => {
      setIsLoggedIn(true);
      setWallet(mockWallet);
      setIsLoginModalOpen(false);
    }, 1000);
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
      needsWalletConnection
    }}>
      {children}
    </AuthContext.Provider>
  );
};
