
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import WalletConnectionSection from '@/components/WalletConnectionSection';
import TokensAndNFTs from '@/components/TokensAndNFTs';
import { useUserTokens } from '@/hooks/useUserTokens';

const Profile = () => {
  const { wallet } = useAuth();
  
  const { tokens, nfts, isLoading, error, refetch } = useUserTokens({
    wallet,
    enabled: wallet.connected
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your wallet connection and view your portfolio
            </p>
          </div>

          <WalletConnectionSection />

          {wallet.connected && (
            <TokensAndNFTs
              tokens={tokens}
              nfts={nfts}
              isLoading={isLoading}
              error={error}
              chainId={wallet.chainId}
              onRefresh={refetch}
            />
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
