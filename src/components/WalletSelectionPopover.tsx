
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Wallet } from 'lucide-react';
import { isWalletAvailable } from '@/utils/wallet';

interface WalletSelectionPopoverProps {
  triggerText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

const WalletSelectionPopover = ({ 
  triggerText = "Connect Wallet", 
  variant = "default" 
}: WalletSelectionPopoverProps) => {
  const { 
    connectWithMetamask, 
    connectWithCoinbase, 
    connectWithTrustWallet, 
    connectWithPhantom,
    isConnecting
  } = useAuth();

  // Check wallet availability
  const isMetaMaskAvailable = isWalletAvailable('metamask');
  const isCoinbaseWalletAvailable = isWalletAvailable('coinbase');
  const isTrustWalletAvailable = isWalletAvailable('trustwallet');
  const isPhantomWalletAvailable = isWalletAvailable('phantom');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant} className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {triggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-background" align="end">
        <div className="grid gap-2 p-4">
          <h3 className="font-medium text-sm pb-2 border-b">Select a wallet</h3>
          <div className="grid gap-2">
            <Button 
              variant="ghost" 
              onClick={connectWithMetamask} 
              disabled={isConnecting || !isMetaMaskAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3 w-full"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="h-5 w-5" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">MetaMask</p>
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={connectWithCoinbase} 
              disabled={isConnecting || !isCoinbaseWalletAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3 w-full"
            >
              <img 
                src="https://static.coingecko.com/s/coinbase-wallet-f64d0a2ae5a0a601cef3bc0d35d8872e5f37880b2b9a78b9e1c5e922c9c9581c.png" 
                alt="Coinbase Wallet" 
                className="h-5 w-5" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">Coinbase Wallet</p>
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={connectWithTrustWallet} 
              disabled={isConnecting || !isTrustWalletAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3 w-full"
            >
              <img 
                src="https://trustwallet.com/assets/images/favicon.png" 
                alt="Trust Wallet" 
                className="h-5 w-5" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">Trust Wallet</p>
              </div>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={connectWithPhantom} 
              disabled={isConnecting || !isPhantomWalletAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3 w-full"
            >
              <img 
                src="https://phantom.app/img/phantom-logo.svg" 
                alt="Phantom" 
                className="h-5 w-5" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">Phantom</p>
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletSelectionPopover;
