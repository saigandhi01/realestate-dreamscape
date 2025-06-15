
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleGoBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                My Profile
              </h1>
              <p className="text-muted-foreground">
                Manage your wallet connection and view your portfolio
              </p>
            </div>
          </div>

          <WalletConnectionSection />

          {wallet.connected && (
            <>
              <TokensAndNFTs
                tokens={tokens}
                nfts={nfts}
                isLoading={isLoading}
                error={error}
                chainId={wallet.chainId}
                onRefresh={refetch}
              />

              <RecentTransactions 
                transactions={transactionHistory}
                isLoading={portfolioLoading}
              />

              <ROISection 
                investmentData={investmentData}
                isLoading={portfolioLoading}
              />
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {wallet.connected 
                    ? "Your portfolio details will be displayed here." 
                    : "Connect your wallet to view your portfolio."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
