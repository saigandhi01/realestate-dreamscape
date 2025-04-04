
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, AlertTriangle } from 'lucide-react';
import { isWalletAvailable } from '@/utils/wallet';
import WalletSelectionPopover from './WalletSelectionPopover';

const WalletConnectionSection = () => {
  const { wallet, disconnect } = useAuth();

  // Check if any wallet is available
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
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Connected Wallet</p>
              <p className="text-sm text-muted-foreground mb-2">
                {wallet.address} ({wallet.networkName})
              </p>
              <p className="text-sm font-medium">
                Balance: {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Wallet Type: {wallet.walletType || 'Unknown'}
              </p>
            </div>
            
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={disconnect} className="w-1/2">
                Disconnect
              </Button>
              <WalletSelectionPopover 
                triggerText="Change Wallet" 
                variant="secondary" 
              />
            </div>
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
            
            <div className="flex justify-center">
              <WalletSelectionPopover triggerText="Connect your wallet" variant="default" />
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
