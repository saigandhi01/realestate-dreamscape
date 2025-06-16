
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Wallet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WalletConnectionSection from '@/components/WalletConnectionSection';
import TokensAndNFTs from '@/components/TokensAndNFTs';
import RecentTransactions from '@/components/RecentTransactions';
import ROISection from '@/components/ROISection';
import { useUserTokens } from '@/hooks/useUserTokens';
import { useUserPortfolioData } from '@/hooks/useUserPortfolioData';

const Profile = () => {
  const { wallet } = useAuth();
  const navigate = useNavigate();
  
  const { tokens, nfts, isLoading, error, refetch } = useUserTokens({
    wallet,
    enabled: wallet.connected
  });

  const { transactionHistory, investmentData, isLoading: portfolioLoading } = useUserPortfolioData();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Enhanced Header with Back Button */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleGoBack}
                  className="shrink-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-700/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      My Profile
                    </h1>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Manage your digital assets and track your investment portfolio
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              {wallet.connected && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 border border-blue-200/20">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900 dark:text-blue-100">Wallet Balance</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mt-1">
                      {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ${wallet.networkName === 'Solana' ? 'SOL' : 'ETH'}` : '0.0000'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl p-4 border border-green-200/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900 dark:text-green-100">Active Tokens</span>
                    </div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200 mt-1">
                      {tokens.length}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-4 border border-purple-200/20">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900 dark:text-purple-100">Portfolio ROI</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 mt-1">
                      {investmentData.roi || '+0.00%'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Connection Section */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <WalletConnectionSection />
          </div>

          {wallet.connected && (
            <div className="space-y-8">
              {/* Tokens and NFTs */}
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <TokensAndNFTs
                  tokens={tokens}
                  nfts={nfts}
                  isLoading={isLoading}
                  error={error}
                  chainId={wallet.chainId}
                  onRefresh={refetch}
                />
              </div>

              {/* Grid Layout for Transactions and ROI */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <RecentTransactions 
                    transactions={transactionHistory}
                    isLoading={portfolioLoading}
                  />
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.01]">
                  <ROISection 
                    investmentData={investmentData}
                    isLoading={portfolioLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Portfolio Overview */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <Card className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-white/20 dark:border-gray-700/20 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                  Portfolio Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    {wallet.connected 
                      ? "Your Investment Journey Starts Here" 
                      : "Connect Your Wallet to Begin"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {wallet.connected 
                      ? "Track your real estate investments, monitor returns, and manage your tokenized property portfolio." 
                      : "Connect your crypto wallet to start investing in tokenized real estate and build your digital portfolio."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
