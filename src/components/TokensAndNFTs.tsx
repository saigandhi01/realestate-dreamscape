
import React from 'react';
import { TokenBalance } from '@/utils/tokens';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy } from 'lucide-react';
import { truncateAddress } from '@/utils/wallet';
import { toast } from '@/hooks/use-toast';

interface TokensAndNFTsProps {
  tokens: TokenBalance[];
  nfts: TokenBalance[];
  isLoading: boolean;
  error: string | null;
  chainId: number | null;
}

export const TokensAndNFTs: React.FC<TokensAndNFTsProps> = ({ 
  tokens, 
  nfts, 
  isLoading, 
  error,
  chainId
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const getExplorerUrl = (address: string) => {
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

  const getNftExplorerUrl = (address: string, tokenId: string | undefined) => {
    if (!tokenId) return getExplorerUrl(address);
    
    switch (chainId) {
      case 1:
        return `https://opensea.io/assets/ethereum/${address}/${tokenId}`;
      case 137:
        return `https://opensea.io/assets/matic/${address}/${tokenId}`;
      default:
        return `https://opensea.io/assets/ethereum/${address}/${tokenId}`;
    }
  };

  if (error) {
    return (
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Error Loading Tokens</CardTitle>
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
          <CardTitle>Tokens</CardTitle>
          <CardDescription>Your cryptocurrency tokens</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : tokens.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No tokens found in this wallet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tokens.map((token, index) => (
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
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {parseFloat(token.formattedBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 4
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        asChild
                      >
                        <a href={getExplorerUrl(token.address)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
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
          <CardDescription>Your non-fungible tokens</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
              ))}
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No NFTs found in this wallet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nfts.map((nft, index) => (
                <div key={`${nft.address}-${nft.tokenId || index}`} className="flex flex-col bg-muted/50 rounded-lg overflow-hidden">
                  <div className="h-40 bg-muted/80 flex items-center justify-center">
                    {nft.metadata?.image ? (
                      <img 
                        src={nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} 
                        alt={nft.name} 
                        className="max-h-full object-contain" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="text-4xl font-bold text-primary/20">{nft.symbol}</div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="font-medium">{nft.metadata?.name || nft.name}</div>
                    <div className="text-sm text-muted-foreground mb-auto">
                      {nft.tokenId ? `#${nft.tokenId}` : ''} 
                      <span className="text-xs opacity-70"> ({nft.chain})</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(nft.address)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        asChild
                      >
                        <a href={getNftExplorerUrl(nft.address, nft.tokenId)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TokensAndNFTs;
