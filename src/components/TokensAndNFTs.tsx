
import React from 'react';
import { TokenBalance } from '@/utils/tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, RefreshCw } from 'lucide-react';
import { truncateAddress } from '@/utils/wallet';
import { toast } from '@/hooks/use-toast';
import { getDemoTokenBalances } from '@/utils/wallet/demo';
import { useAuth } from '@/contexts/AuthContext';

interface TokensAndNFTsProps {
  tokens: TokenBalance[];
  nfts: TokenBalance[];
  isLoading: boolean;
  error: string | null;
  chainId: number | null;
  onRefresh?: () => void;
}

export const TokensAndNFTs: React.FC<TokensAndNFTsProps> = ({ 
  tokens, 
  nfts, 
  isLoading, 
  error,
  chainId,
  onRefresh
}) => {
  const { wallet } = useAuth();
  
  // If demo wallet, get demo tokens
  const displayTokens = wallet.walletType === 'demo' ? getDemoTokenBalances() : tokens;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const getExplorerUrl = (address: string, chain: string) => {
    if (wallet.walletType === 'demo') {
      return '#'; // Demo links don't go anywhere
    }
    
    if (chain === 'Solana') {
      return `https://solscan.io/account/${address}`;
    }
    
    switch (chainId) {
      case 1:
        return `https://etherscan.io/address/${address}`;
      case 56:
        return `https://bscscan.com/address/${address}`;
      case 137:
        return `https://polygonscan.com/address/${address}`;
      default:
        return `https://etherscan.io/address/${address}`;
    }
  };

  if (error && wallet.walletType !== 'demo') {
    return (
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Error Loading Tokens
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="token-list space-y-8">
      {/* Tokens Section */}
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {wallet.walletType === 'demo' ? 'Demo Wallet Tokens' : 'Live Wallet Tokens'}
              </CardTitle>
              <CardDescription>
                {wallet.walletType === 'demo' 
                  ? 'Demo tokens for testing and development purposes'
                  : 'Your cryptocurrency tokens from connected wallet'
                }
              </CardDescription>
            </div>
            {onRefresh && wallet.walletType !== 'demo' && (
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && wallet.walletType !== 'demo' ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayTokens.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No tokens found in this wallet</p>
              <p className="text-sm text-muted-foreground mt-2">
                {wallet.walletType === 'demo' 
                  ? 'Demo tokens should be available'
                  : 'Supported tokens: ETH, USDC, USDT, SOL'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayTokens.map((token, index) => (
                <div key={`${token.address}-${index}`} className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage src={token.logo} alt={token.name} />
                      <AvatarFallback className="bg-primary/20">
                        {token.symbol.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {token.symbol} 
                        <span className="text-xs opacity-70">({token.chain})</span>
                        {wallet.walletType === 'demo' && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-1 rounded ml-1">DEMO</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {parseFloat(token.formattedBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: token.symbol === 'SOL' ? 6 : 4
                      })} {token.symbol}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(token.address)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      {wallet.walletType !== 'demo' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          asChild
                        >
                          <a href={getExplorerUrl(token.address, token.chain)} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFTs Section */}
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>NFTs</CardTitle>
          <CardDescription>Your non-fungible tokens (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">NFT fetching from live wallet coming soon</p>
            <p className="text-sm text-muted-foreground mt-2">
              Currently showing basic token balances only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokensAndNFTs;
