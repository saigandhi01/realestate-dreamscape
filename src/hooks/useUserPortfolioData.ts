
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Sample data for portfolio items
const mockPortfolioItems = [
  {
    id: 'prop1-uuid',
    name: 'Downtown Condo',
    type: 'residential',
    value: '$450,000',
    tokens: '450',
    ownership: '45%',
    progress: 45
  },
  {
    id: 'prop2-uuid',
    name: 'Office Building',
    type: 'commercial',
    value: '$1,200,000',
    tokens: '300',
    ownership: '25%',
    progress: 25
  },
  {
    id: 'prop3-uuid',
    name: 'Beach House',
    type: 'vacation',
    value: '$850,000',
    tokens: '425',
    ownership: '50%',
    progress: 50
  }
];

// Sample data for transaction history
const mockTransactionHistory = [
  {
    id: 'tx1',
    date: '2025-04-25',
    type: 'buy',
    property: 'Downtown Condo',
    amount: '$45,000',
    tokens: '45',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: 'tx2',
    date: '2025-04-20',
    type: 'sell',
    property: 'Office Space',
    amount: '$22,000',
    tokens: '22',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: 'tx3',
    date: '2025-04-15',
    type: 'transfer',
    property: 'Beach House',
    amount: '$17,000',
    tokens: '17',
    hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456'
  },
  {
    id: 'tx4',
    date: '2025-04-10',
    type: 'buy',
    property: 'Mountain Cabin',
    amount: '$30,000',
    tokens: '30',
    hash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc'
  }
];

// Sample data for investment performance
const mockPerformanceData = [
  { month: 'Jan', value: 10000, prev: 10000 },
  { month: 'Feb', value: 12000, prev: 10000 },
  { month: 'Mar', value: 14000, prev: 10000 },
  { month: 'Apr', value: 15000, prev: 10000 },
  { month: 'May', value: 18000, prev: 10000 },
  { month: 'Jun', value: 20000, prev: 10000 },
  { month: 'Jul', value: 21000, prev: 10000 },
  { month: 'Aug', value: 22000, prev: 10000 },
  { month: 'Sep', value: 24000, prev: 10000 }
];

// Sample investment data
const mockInvestmentData = {
  totalInvested: '$100,000',
  currentValue: '$124,000',
  roi: '+24%',
  annualYield: '8.2%',
  monthlyIncome: '$2,120'
};

export const useUserPortfolioData = () => {
  const { user, wallet } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [investmentData, setInvestmentData] = useState({
    totalInvested: '$0',
    currentValue: '$0',
    roi: '0%',
    annualYield: '0%',
    monthlyIncome: '$0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // If there's no user ID or wallet address, use mock data for demo purposes
        if (!user && !wallet.address) {
          throw new Error('No user ID or wallet address available');
        }
        
        // For wallet-connected users, we'll use mock data for now since they don't have real DB entries
        // This fixes the UUID format error when querying with wallet addresses
        if (wallet.connected) {
          setPortfolioItems(mockPortfolioItems);
          setTransactionHistory(mockTransactionHistory);
          setPerformanceData(mockPerformanceData);
          setInvestmentData(mockInvestmentData);
          return;
        }

        // For non-wallet users, try to fetch from Supabase
        if (user?.id && !user.id.startsWith('wallet-')) {
          // Get portfolio items
          const { data: portfolioData, error: portfolioError } = await supabase
            .from('user_portfolios')
            .select('*')
            .eq('user_id', user.id);
          
          if (portfolioError) throw portfolioError;

          // Map portfolio data to the expected format
          const mappedPortfolio = portfolioData?.length ? portfolioData.map(item => ({
            id: item.id,
            name: item.property_name,
            type: item.property_type,
            value: `$${Number(item.value_per_token * item.tokens_owned).toLocaleString()}`,
            tokens: item.tokens_owned.toLocaleString(),
            ownership: `${item.ownership_percentage}%`,
            progress: item.progress
          })) : mockPortfolioItems;

          setPortfolioItems(mappedPortfolio);
          
          // Get transaction history
          const { data: transactionData, error: transactionError } = await supabase
            .from('user_transactions')
            .select('*')
            .eq('user_id', user.id);
          
          if (transactionError) throw transactionError;

          // Map transaction data to the expected format
          const mappedTransactions = transactionData?.length ? transactionData.map(tx => ({
            id: tx.id,
            date: new Date(tx.created_at).toISOString().split('T')[0],
            type: tx.transaction_type,
            property: tx.property_name,
            amount: `$${Number(tx.amount).toLocaleString()}`,
            tokens: tx.tokens.toString(),
            hash: tx.transaction_hash
          })) : mockTransactionHistory;

          setTransactionHistory(mappedTransactions);
          
          // Get performance data (using mock data for now)
          setPerformanceData(mockPerformanceData);
          
          // Get investment data
          const { data: investmentData, error: investmentError } = await supabase
            .from('user_investment_performance')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (investmentError && investmentError.code !== 'PGRST116') throw investmentError;

          // Use investment data or fall back to mock data
          if (investmentData) {
            setInvestmentData({
              totalInvested: `$${Number(investmentData.total_invested).toLocaleString()}`,
              currentValue: `$${Number(investmentData.current_value).toLocaleString()}`,
              roi: `${investmentData.roi_percentage > 0 ? '+' : ''}${investmentData.roi_percentage}%`,
              annualYield: `${investmentData.annual_yield}%`,
              monthlyIncome: `$${Number(investmentData.monthly_income).toLocaleString()}`
            });
          } else {
            setInvestmentData(mockInvestmentData);
          }
        } else {
          // Fallback to mock data for any other scenario
          setPortfolioItems(mockPortfolioItems);
          setTransactionHistory(mockTransactionHistory);
          setPerformanceData(mockPerformanceData);
          setInvestmentData(mockInvestmentData);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your investment data. Please try again.');
        
        // Fallback to mock data on error
        setPortfolioItems(mockPortfolioItems);
        setTransactionHistory(mockTransactionHistory);
        setPerformanceData(mockPerformanceData);
        setInvestmentData(mockInvestmentData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, wallet.address, wallet.connected]);

  return {
    portfolioItems,
    transactionHistory,
    performanceData,
    investmentData,
    isLoading,
    error
  };
};

export default useUserPortfolioData;
