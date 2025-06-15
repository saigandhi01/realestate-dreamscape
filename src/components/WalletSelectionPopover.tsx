
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

  // Wallet configs with updated icon URLs
  const wallets = [
    {
      name: "MetaMask",
      type: "metamask" as WalletType,
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      available: isMetaMaskAvailable
    },
    {
      name: "Coinbase Wallet",
      type: "coinbase" as WalletType,
      icon: "https://seeklogo.com/images/C/coinbase-wallet-logo-D486C3685A-seeklogo.com.png",
      available: isCoinbaseWalletAvailable
    },
    {
      name: "Trust Wallet",
      type: "trustwallet" as WalletType,
      icon: "https://trustwallet.com/assets/images/favicon.svg",
      available: isTrustWalletAvailable
    },
    {
      name: "Phantom",
      type: "phantom" as WalletType,
      icon: "https://phantom.app/img/phantom-icon-purple.png",
      available: isPhantomWalletAvailable
    }
  ];

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
            {wallets.map((wallet) => (
              <Button 
                key={wallet.name}
                variant="outline" 
                onClick={() => handleWalletConnection(wallet.type)} 
                disabled={isConnecting || !wallet.available}
                className="flex justify-start items-center gap-3 h-auto py-3 w-full hover:bg-accent"
              >
                <img 
                  src={wallet.icon} 
                  alt={wallet.name} 
                  className="h-6 w-6 object-contain" 
                />
                <div className="text-left">
                  <p className="font-medium text-sm">{wallet.name}</p>
                  {!wallet.available && <p className="text-xs text-muted-foreground">Not installed</p>}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletSelectionPopover;
