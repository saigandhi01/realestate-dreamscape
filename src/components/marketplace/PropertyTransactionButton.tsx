import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, ShoppingCart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionToast } from '@/components/ui/transaction-toast';
import { Property } from '@/components/PropertyCard';
import { useSmartContractWallet } from '@/hooks/useSmartContractWallet';
import { ethers } from 'ethers';
import { DemoTransactionService } from '@/utils/contracts/DemoTransactionService';

interface PropertyTransactionButtonProps {
  property: Property;
  className?: string;
}

const PropertyTransactionButton: React.FC<PropertyTransactionButtonProps> = ({ 
  property, 
  className = "" 
}) => {
  const { wallet } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const { purchaseProperty, isLoading: contractLoading } = useSmartContractWallet(
    wallet.provider as ethers.providers.Web3Provider,
    wallet.address,
    wallet.walletType
  );

  const calculateTotal = () => {
    return (property.tokenPrice * tokenAmount).toFixed(4);
  };

  const handlePurchase = async () => {
    if (!wallet.connected) {
      transactionToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a purchase",
        status: "error"
      });
      return;
    }

    setIsProcessing(true);

    try {
      transactionToast({
        title: "Transaction Initiated",
        description: `Processing purchase of ${tokenAmount} tokens for ${property.name || property.title}`,
        status: "pending"
      });

      const totalCost = calculateTotal();
      const displayName = property.name || property.title || 'Property';

      if (wallet.walletType === 'demo') {
        // Handle demo transaction
        const result = await DemoTransactionService.purchaseProperty(
          property.id,
          displayName,
          tokenAmount,
          totalCost,
          wallet.address!
        );

        if (result.success) {
          transactionToast({
            title: "Demo Purchase Successful!",
            description: `Successfully purchased ${tokenAmount} tokens of ${displayName}`,
            status: "success",
            txHash: result.transaction.transactionHash
          });
        } else {
          throw new Error(result.error || 'Demo transaction failed');
        }
      } else {
        // Handle real smart contract transaction
        const propertyId = parseInt(property.id) || 1;
        const tx = await purchaseProperty(propertyId, tokenAmount, totalCost);

        transactionToast({
          title: "Purchase Successful!",
          description: `Successfully purchased ${tokenAmount} tokens of ${displayName}`,
          status: "success",
          txHash: tx.hash
        });
      }

      setIsOpen(false);
      setTokenAmount(1);
    } catch (error: any) {
      console.error('Purchase failed:', error);
      transactionToast({
        title: "Transaction Failed",
        description: error.message || "Failed to complete the purchase. Please try again.",
        status: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const maxTokens = Math.min(property.availableTokens || 100, 100);
  const displayName = property.name || property.title || 'Property';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium ${className}`}
          disabled={!wallet.connected}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {wallet.connected ? "Buy Tokens" : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            Purchase Property Tokens
            {wallet.walletType === 'demo' && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">DEMO MODE</span>
            )}
          </DialogTitle>
          <DialogDescription>
            {wallet.walletType === 'demo' 
              ? `Demo purchase for ${displayName} using test tokens`
              : `Buy tokens for ${displayName} using smart contract`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{displayName}</CardTitle>
              <CardDescription>
                {property.tokenPrice} ETH per token • {property.availableTokens || 100} available
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Wallet Info */}
          <Card className={`${wallet.walletType === 'demo' 
            ? 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
          }`}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className={`h-4 w-4 ${wallet.walletType === 'demo' ? 'text-orange-600' : 'text-blue-600'}`} />
                <span className={`font-medium ${wallet.walletType === 'demo' ? 'text-orange-900 dark:text-orange-100' : 'text-blue-900 dark:text-blue-100'}`}>
                  {wallet.walletType === 'demo' ? 'Demo Wallet' : 'Connected Wallet'}
                </span>
              </div>
              <p className={`text-sm ${wallet.walletType === 'demo' ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}`}>
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </p>
              <p className={`text-sm ${wallet.walletType === 'demo' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>
                Balance: {wallet.balance || '0'} {wallet.networkName === 'Solana' ? 'SOL' : 'ETH'}
              </p>
            </CardContent>
          </Card>

          {/* Token Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="tokenAmount">Number of Tokens</Label>
            <Input
              id="tokenAmount"
              type="number"
              min="1"
              max={maxTokens}
              value={tokenAmount}
              onChange={(e) => setTokenAmount(Math.max(1, Math.min(maxTokens, parseInt(e.target.value) || 1)))}
              className="text-lg font-medium"
            />
            <p className="text-sm text-gray-500">
              Maximum: {maxTokens} tokens
            </p>
          </div>

          {/* Transaction Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Cost</span>
                <span className="text-xl font-bold text-green-700 dark:text-green-300">
                  {calculateTotal()} ETH
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{tokenAmount} tokens × {property.tokenPrice} ETH</span>
                <span>{wallet.walletType === 'demo' ? '+ Demo fees' : '+ Network fees'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Smart Contract Info */}
          <div className={`flex items-start gap-2 p-3 rounded-lg border ${
            wallet.walletType === 'demo' 
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
              wallet.walletType === 'demo' ? 'text-orange-600' : 'text-blue-600'
            }`} />
            <p className={`text-sm ${
              wallet.walletType === 'demo' 
                ? 'text-orange-800 dark:text-orange-200'
                : 'text-blue-800 dark:text-blue-200'
            }`}>
              {wallet.walletType === 'demo' 
                ? 'This is a demo transaction using test tokens. No real funds will be used.'
                : 'This transaction will be processed through our secure smart contract on the blockchain.'
              }
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isProcessing || contractLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isProcessing || contractLoading}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {wallet.walletType === 'demo' ? 'Demo Purchase' : 'Confirm Purchase'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyTransactionButton;
