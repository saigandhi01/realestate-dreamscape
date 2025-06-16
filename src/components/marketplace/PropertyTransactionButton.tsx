
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, ShoppingCart, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { transactionToast } from '@/components/ui/transaction-toast';

interface Property {
  id: string;
  title: string;
  price: string;
  tokenPrice: string;
  totalTokens: number;
  availableTokens: number;
}

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

  const calculateTotal = () => {
    const pricePerToken = parseFloat(property.tokenPrice.replace('$', ''));
    return (pricePerToken * tokenAmount).toFixed(2);
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
      // Simulate transaction processing
      transactionToast({
        title: "Transaction Initiated",
        description: `Processing purchase of ${tokenAmount} tokens for ${property.title}`,
        status: "pending"
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);

      transactionToast({
        title: "Purchase Successful!",
        description: `Successfully purchased ${tokenAmount} tokens of ${property.title}`,
        status: "success",
        txHash: mockTxHash
      });

      setIsOpen(false);
      setTokenAmount(1);
    } catch (error) {
      transactionToast({
        title: "Transaction Failed",
        description: "Failed to complete the purchase. Please try again.",
        status: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const maxTokens = Math.min(property.availableTokens, 100); // Limit max purchase

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
          </DialogTitle>
          <DialogDescription>
            Buy tokens for {property.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <CardDescription>
                {property.tokenPrice} per token • {property.availableTokens} available
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Wallet Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Connected Wallet</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
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
                  ${calculateTotal()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{tokenAmount} tokens × {property.tokenPrice}</span>
                <span>Network fee: ~$2.50</span>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This is a demo transaction. No real funds will be transferred.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirm Purchase
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
