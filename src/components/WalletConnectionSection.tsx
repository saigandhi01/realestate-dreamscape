
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, AlertTriangle } from 'lucide-react';
import { isWalletAvailable } from '@/utils/wallet';

const WalletConnectionSection = () => {
  const { 
    connectWithMetamask, 
    connectWithCoinbase, 
    connectWithTrustWallet, 
    connectWithPhantom,
    isConnecting, 
    wallet 
  } = useAuth();

  // Check which wallets are available in the browser
  const isMetaMaskAvailable = isWalletAvailable('metamask');
  const isCoinbaseWalletAvailable = isWalletAvailable('coinbase');
  const isTrustWalletAvailable = isWalletAvailable('trustwallet');
  const isPhantomWalletAvailable = isWalletAvailable('phantom');

  const anyWalletAvailable = isMetaMaskAvailable || isCoinbaseWalletAvailable || 
                            isTrustWalletAvailable || isPhantomWalletAvailable;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Your Wallet
        </CardTitle>
        <CardDescription>
          {wallet.connected 
            ? "Your wallet is connected. You can disconnect or change it below."
            : "Connect your crypto wallet to start investing in tokenized real estate."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {wallet.connected ? (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Connected Wallet</p>
            <p className="text-sm text-muted-foreground mb-2">
              {wallet.address} ({wallet.networkName})
            </p>
            <p className="text-sm font-medium">
              Balance: {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {!anyWalletAvailable && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-400">No wallet extensions detected</p>
                  <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                    You'll need to install a wallet extension to connect your crypto wallet.
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={connectWithMetamask} 
                disabled={isConnecting || !isMetaMaskAvailable}
                className="flex justify-start items-center gap-2 h-auto py-3"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="h-6 w-6" 
                />
                <div className="text-left">
                  <p className="font-medium">MetaMask</p>
                  <p className="text-xs text-muted-foreground">
                    {isMetaMaskAvailable ? "Connect to your MetaMask wallet" : "Install MetaMask extension"}
                  </p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={connectWithCoinbase} 
                disabled={isConnecting || !isCoinbaseWalletAvailable}
                className="flex justify-start items-center gap-2 h-auto py-3"
              >
                <img 
                  src="https://static.coingecko.com/s/coinbase-wallet-f64d0a2ae5a0a601cef3bc0d35d8872e5f37880b2b9a78b9e1c5e922c9c9581c.png" 
                  alt="Coinbase Wallet" 
                  className="h-6 w-6" 
                />
                <div className="text-left">
                  <p className="font-medium">Coinbase Wallet</p>
                  <p className="text-xs text-muted-foreground">
                    {isCoinbaseWalletAvailable ? "Connect to your Coinbase wallet" : "Install Coinbase Wallet extension"}
                  </p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={connectWithTrustWallet} 
                disabled={isConnecting || !isTrustWalletAvailable}
                className="flex justify-start items-center gap-2 h-auto py-3"
              >
                <img 
                  src="https://trustwallet.com/assets/images/favicon.png" 
                  alt="Trust Wallet" 
                  className="h-6 w-6" 
                />
                <div className="text-left">
                  <p className="font-medium">Trust Wallet</p>
                  <p className="text-xs text-muted-foreground">
                    {isTrustWalletAvailable ? "Connect to your Trust wallet" : "Install Trust Wallet extension"}
                  </p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={connectWithPhantom} 
                disabled={isConnecting || !isPhantomWalletAvailable}
                className="flex justify-start items-center gap-2 h-auto py-3"
              >
                <img 
                  src="https://phantom.app/img/phantom-logo.svg" 
                  alt="Phantom" 
                  className="h-6 w-6" 
                />
                <div className="text-left">
                  <p className="font-medium">Phantom (Solana)</p>
                  <p className="text-xs text-muted-foreground">
                    {isPhantomWalletAvailable ? "Connect to your Phantom wallet" : "Install Phantom extension"}
                  </p>
                </div>
              </Button>
            </div>
            
            {!anyWalletAvailable && (
              <div className="text-sm text-center text-muted-foreground mt-4">
                <p>Don't have a wallet?</p>
                <div className="flex gap-2 justify-center mt-2">
                  <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Install MetaMask
                  </a>
                  <span>|</span>
                  <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Install Coinbase Wallet
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnectionSection;
