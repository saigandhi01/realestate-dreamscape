
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Wallet } from 'lucide-react';
import { isWalletAvailable, WalletType } from '@/utils/wallet';

interface WalletSelectionPopoverProps {
  triggerText?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

const WalletSelectionPopover = ({ 
  triggerText = "Connect Wallet", 
  variant = "default" 
}: WalletSelectionPopoverProps) => {
  const { connectWithWallet, isConnecting } = useAuth();

  // Check wallet availability
  const isMetaMaskAvailable = isWalletAvailable('metamask');
  const isCoinbaseWalletAvailable = isWalletAvailable('coinbase');
  const isTrustWalletAvailable = isWalletAvailable('trustwallet');
  const isPhantomWalletAvailable = isWalletAvailable('phantom');

  const handleWalletConnection = (walletType: WalletType) => {
    if (walletType) {
      connectWithWallet(walletType);
    }
  };

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
              variant="outline" 
              onClick={() => handleWalletConnection('metamask')} 
              disabled={isConnecting || !isMetaMaskAvailable}
              className="flex justify-start items-center gap-3 h-auto py-3 w-full hover:bg-accent"
            >
              <img 
                src="/lovable-uploads/fdce60cd-89da-4466-baa1-704d73d7d732.png" 
                alt="MetaMask" 
                className="h-6 w-6 object-contain" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">MetaMask</p>
                {!isMetaMaskAvailable && <p className="text-xs text-muted-foreground">Not installed</p>}
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleWalletConnection('coinbase')} 
              disabled={isConnecting || !isCoinbaseWalletAvailable}
              className="flex justify-start items-center gap-3 h-auto py-3 w-full hover:bg-accent"
            >
              <img 
                src="https://www.coinbase.com/img/coinbase-icon.svg" 
                alt="Coinbase Wallet" 
                className="h-6 w-6 object-contain" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">Coinbase Wallet</p>
                {!isCoinbaseWalletAvailable && <p className="text-xs text-muted-foreground">Not installed</p>}
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleWalletConnection('trustwallet')} 
              disabled={isConnecting || !isTrustWalletAvailable}
              className="flex justify-start items-center gap-3 h-auto py-3 w-full hover:bg-accent"
            >
              <img 
                src="https://trustwallet.com/assets/images/favicon.png" 
                alt="Trust Wallet" 
                className="h-6 w-6 object-contain" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">Trust Wallet</p>
                {!isTrustWalletAvailable && <p className="text-xs text-muted-foreground">Not installed</p>}
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => handleWalletConnection('phantom')} 
              disabled={isConnecting || !isPhantomWalletAvailable}
              className="flex justify-start items-center gap-3 h-auto py-3 w-full hover:bg-accent"
            >
              <img 
                src="https://phantom.app/img/phantom-logo-mono.svg" 
                alt="Phantom" 
                className="h-6 w-6 object-contain" 
              />
              <div className="text-left">
                <p className="font-medium text-sm">Phantom</p>
                {!isPhantomWalletAvailable && <p className="text-xs text-muted-foreground">Not installed</p>}
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletSelectionPopover;
