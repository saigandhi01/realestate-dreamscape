
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/supabase';

// Define types for our data
export interface PortfolioItem {
  id: string;
  property_id: string;
  property_name: string;
  value_per_token: number;
  tokens_owned: number;
  ownership_percentage: number;
  property_type: string;
  progress: number;
}

export interface Transaction {
  id: string;
  property_id: string;
  property_name: string;
  transaction_type: 'buy' | 'sell' | 'transfer';
  tokens: number;
  amount: number;
  recipient_address?: string;
  transaction_hash: string;
  created_at: string;
}

export interface InvestmentPerformance {
  id: string;
  total_invested: number;
  current_value: number;
  roi_percentage: number;
  annual_yield: number;
  monthly_income: number;
  updated_at: string;
}

export const useUserPortfolioData = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investmentData, setInvestmentData] = useState<InvestmentPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Type safe table names
  const Tables = {
    portfolios: 'user_portfolios',
    transactions: 'user_transactions',
    performance: 'user_investment_performance'
  } as const;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch portfolio data
        const { data: portfolioData, error: portfolioError } = await supabase
          .from(Tables.portfolios)
          .select('*')
          .eq('user_id', user.id);
          
        if (portfolioError) throw portfolioError;
        setPortfolio(portfolioData || []);
        
        // Fetch transaction history
        const { data: transactionData, error: transactionError } = await supabase
          .from(Tables.transactions)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (transactionError) throw transactionError;
        
        // Cast the transaction_type to the expected union type
        const typedTransactions = (transactionData || []).map(tx => ({
          ...tx,
          transaction_type: tx.transaction_type as 'buy' | 'sell' | 'transfer'
        }));
        
        setTransactions(typedTransactions);
        
        // Fetch investment performance
        const { data: investmentData, error: investmentError } = await supabase
          .from(Tables.performance)
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
          
        if (investmentError) throw investmentError;
        setInvestmentData(investmentData || null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your investment data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
    
    // Set up real-time subscription for updates
    const portfolioChannel = supabase
      .channel('portfolio-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: Tables.portfolios,
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchUserData();
      })
      .subscribe();
      
    const transactionChannel = supabase
      .channel('transaction-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: Tables.transactions,
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchUserData();
      })
      .subscribe();
      
    const performanceChannel = supabase
      .channel('performance-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: Tables.performance,
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchUserData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(portfolioChannel);
      supabase.removeChannel(transactionChannel);
      supabase.removeChannel(performanceChannel);
    };
  }, [user]);

  // Generate UI-friendly data
  const formatPortfolioForUI = () => {
    return portfolio.map(item => ({
      id: item.id,
      name: item.property_name,
      value: `$${(item.value_per_token * item.tokens_owned).toLocaleString()}`,
      tokens: item.tokens_owned.toLocaleString(),
      ownership: `${item.ownership_percentage.toFixed(2)}%`,
      type: item.property_type,
      progress: item.progress
    }));
  };

  const formatTransactionsForUI = () => {
    return transactions.map(tx => ({
      id: tx.id,
      date: new Date(tx.created_at).toLocaleDateString(),
      type: tx.transaction_type,
      property: tx.property_name,
      amount: `$${tx.amount.toLocaleString()}`,
      tokens: tx.tokens.toLocaleString(),
      hash: tx.transaction_hash
    }));
  };

  const formatInvestmentDataForUI = () => {
    if (!investmentData) return {
      totalInvested: '$0',
      currentValue: '$0',
      roi: '0.00%',
      annualYield: '0.00%',
      monthlyIncome: '$0'
    };
    
    return {
      totalInvested: `$${investmentData.total_invested.toLocaleString()}`,
      currentValue: `$${investmentData.current_value.toLocaleString()}`,
      roi: `${investmentData.roi_percentage.toFixed(2)}%`,
      annualYield: `${investmentData.annual_yield.toFixed(2)}%`,
      monthlyIncome: `$${investmentData.monthly_income.toLocaleString()}`
    };
  };

  // Generate data for performance chart
  const generatePerformanceChartData = () => {
    // Generate mock historical data based on current values
    if (!investmentData) return [];
    
    const currentMonth = new Date().getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create a 9-month performance history
    return Array.from({ length: 9 }, (_, i) => {
      const monthIndex = (currentMonth - 8 + i + 12) % 12;
      const growthFactor = 0.7 + (i / 8) * 0.5; // Simulates growth over time
      
      return {
        month: months[monthIndex],
        value: Math.round(investmentData.current_value * growthFactor),
        prev: Math.round(investmentData.total_invested * growthFactor)
      };
    });
  };

  return {
    portfolioItems: formatPortfolioForUI(),
    transactionHistory: formatTransactionsForUI(),
    investmentData: formatInvestmentDataForUI(),
    performanceData: generatePerformanceChartData(),
    isLoading,
    error
  };
};
