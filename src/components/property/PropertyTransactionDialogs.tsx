import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { IndianRupee, Bitcoin, Wallet, CheckCircle2 } from "lucide-react";
import { Property } from "@/components/PropertyCard";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { transactionToast } from "@/components/ui/transaction-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// INR conversion rate (1 USD = approximately 75 INR)
const USD_TO_INR = 75;

// Crypto exchange rates (approximate)
const CRYPTO_RATES = {
  BTC: 0.000013, // BTC per USD
  ETH: 0.00022,  // ETH per USD
  USDC: 1,       // USDC per USD
  USDT: 1,       // USDT per USD
  SOL: 0.033     // SOL per USD
};

// Table names for type safety
const Tables = {
  portfolios: 'user_portfolios',
  transactions: 'user_transactions',
  performance: 'user_investment_performance'
} as const;

interface PropertyTransactionDialogsProps {
  property: Property;
  wallet: {
    address?: string;
    balance?: number;
  };
  buyDialogOpen: boolean;
  sellDialogOpen: boolean;
  transferDialogOpen: boolean;
  setBuyDialogOpen: (open: boolean) => void;
  setSellDialogOpen: (open: boolean) => void;
  setTransferDialogOpen: (open: boolean) => void;
}

const PropertyTransactionDialogs = ({
  property,
  wallet,
  buyDialogOpen,
  sellDialogOpen,
  transferDialogOpen,
  setBuyDialogOpen,
  setSellDialogOpen,
  setTransferDialogOpen,
}: PropertyTransactionDialogsProps) => {
  const [tokenAmount, setTokenAmount] = useState(1);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("INR");
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // Price conversions
  const priceInINR = property.tokenPrice * USD_TO_INR;
  const totalPriceInINR = priceInINR * tokenAmount;
  
  // Convert to selected crypto
  const getCryptoAmount = (currency: string) => {
    const priceInUSD = property.tokenPrice * tokenAmount;
    switch(currency) {
      case "BTC": return (priceInUSD * CRYPTO_RATES.BTC).toFixed(8);
      case "ETH": return (priceInUSD * CRYPTO_RATES.ETH).toFixed(6);
      case "USDC": return (priceInUSD * CRYPTO_RATES.USDC).toFixed(2);
      case "USDT": return (priceInUSD * CRYPTO_RATES.USDT).toFixed(2);
      case "SOL": return (priceInUSD * CRYPTO_RATES.SOL).toFixed(4);
      default: return totalPriceInINR.toLocaleString();
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch(currency) {
      case "INR": return "₹";
      case "BTC": return "₿";
      case "ETH": return "Ξ";
      case "USDC": return "$";
      case "USDT": return "$";
      case "SOL": return "◎";
      default: return "₹";
    }
  };

  // Calculate ownership percentage
  const calculateOwnershipPercentage = () => {
    const totalTokens = Math.floor(property.price / property.tokenPrice);
    return (tokenAmount / totalTokens) * 100;
  };

  // Generate mock transaction hash
  const generateTransactionHash = () => {
    return "0x" + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
  };

  // Update investment performance data
  const updateInvestmentPerformance = async (amount: number, transactionType: 'buy' | 'sell' | 'transfer') => {
    if (!user?.id) return;
    
    try {
      // First, check if user already has an investment performance record
      const { data: existingData } = await supabase
        .from(Tables.performance)
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (existingData) {
        // Update existing record
        let newTotalInvested = existingData.total_invested;
        let newCurrentValue = existingData.current_value;
        
        if (transactionType === 'buy') {
          newTotalInvested += amount;
          newCurrentValue += amount * 1.05; // Simple mock 5% appreciation for demo
        } else if (transactionType === 'sell') {
          newTotalInvested = Math.max(0, newTotalInvested - amount);
          newCurrentValue = Math.max(0, newCurrentValue - amount);
        }
        
        // Calculate new ROI
        const roiPercentage = newTotalInvested > 0 
          ? ((newCurrentValue - newTotalInvested) / newTotalInvested) * 100 
          : 0;
        
        await supabase
          .from(Tables.performance)
          .update({
            total_invested: newTotalInvested,
            current_value: newCurrentValue,
            roi_percentage: roiPercentage,
            annual_yield: 8.2, // Mock values for demo
            monthly_income: newCurrentValue * 0.007, // Monthly income at ~8.4% annual
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Create new record
        const initialValue = transactionType === 'buy' ? amount : 0;
        
        await supabase
          .from(Tables.performance)
          .insert({
            user_id: user.id,
            total_invested: initialValue,
            current_value: initialValue * 1.05, // Simple mock 5% appreciation for demo
            roi_percentage: 5, // Mock 5% ROI for demo
            annual_yield: 8.2, // Mock value for demo
            monthly_income: initialValue * 0.007 // Monthly income at ~8.4% annual
          });
      }
    } catch (error) {
      console.error('Error updating investment performance:', error);
    }
  };

  const handleBuyTokens = async () => {
    if (!user?.id) {
      transactionToast({
        title: "Authentication Required",
        description: "Please log in to purchase tokens",
        status: "error"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Calculate amount in USD
      const amountInUSD = property.tokenPrice * tokenAmount;
      
      // Generate mock transaction hash
      const txHash = generateTransactionHash();
      
      // Calculate ownership percentage
      const ownershipPercentage = calculateOwnershipPercentage();
      
      // 1. First, check if user already has this property in portfolio
      const { data: existingPortfolio } = await supabase
        .from(Tables.portfolios)
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', property.id)
        .single();
      
      if (existingPortfolio) {
        // Update existing portfolio entry
        await supabase
          .from(Tables.portfolios)
          .update({
            tokens_owned: existingPortfolio.tokens_owned + tokenAmount,
            ownership_percentage: existingPortfolio.ownership_percentage + ownershipPercentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPortfolio.id);
      } else {
        // Create new portfolio entry
        await supabase
          .from(Tables.portfolios)
          .insert({
            user_id: user.id,
            property_id: property.id,
            property_name: property.name,
            tokens_owned: tokenAmount,
            value_per_token: property.tokenPrice,
            ownership_percentage: ownershipPercentage,
            property_type: property.type.toLowerCase(),
            progress: Math.round((property.funded / property.target) * 100)
          });
      }
      
      // 2. Record the transaction
      await supabase
        .from(Tables.transactions)
        .insert({
          user_id: user.id,
          property_id: property.id,
          property_name: property.name,
          transaction_type: 'buy',
          tokens: tokenAmount,
          amount: amountInUSD,
          transaction_hash: txHash
        });
      
      // 3. Update investment performance
      await updateInvestmentPerformance(amountInUSD, 'buy');
      
      // Show success notification
      transactionToast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${tokenAmount} tokens of ${property.name}`,
        status: "success",
        txHash: txHash
      });
    } catch (error) {
      console.error('Error processing purchase:', error);
      transactionToast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        status: "error"
      });
    } finally {
      setIsProcessing(false);
      setBuyDialogOpen(false);
    }
  };

  const handleSellTokens = async () => {
    if (!user?.id) {
      transactionToast({
        title: "Authentication Required",
        description: "Please log in to sell tokens",
        status: "error"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Calculate amount in USD
      const amountInUSD = property.tokenPrice * tokenAmount;
      
      // Generate mock transaction hash
      const txHash = generateTransactionHash();
      
      // Calculate ownership percentage
      const ownershipPercentage = calculateOwnershipPercentage();
      
      // 1. Check if user has enough tokens to sell
      const { data: existingPortfolio } = await supabase
        .from(Tables.portfolios)
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', property.id)
        .single();
      
      if (!existingPortfolio || existingPortfolio.tokens_owned < tokenAmount) {
        throw new Error("You don't have enough tokens to sell");
      }
      
      // 2. Update portfolio
      const newTokensOwned = existingPortfolio.tokens_owned - tokenAmount;
      const newOwnershipPercentage = existingPortfolio.ownership_percentage - ownershipPercentage;
      
      if (newTokensOwned > 0) {
        // Update portfolio with reduced tokens
        await supabase
          .from(Tables.portfolios)
          .update({
            tokens_owned: newTokensOwned,
            ownership_percentage: newOwnershipPercentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPortfolio.id);
      } else {
        // Remove property from portfolio if no tokens left
        await supabase
          .from(Tables.portfolios)
          .delete()
          .eq('id', existingPortfolio.id);
      }
      
      // 3. Record the transaction
      await supabase
        .from(Tables.transactions)
        .insert({
          user_id: user.id,
          property_id: property.id,
          property_name: property.name,
          transaction_type: 'sell',
          tokens: tokenAmount,
          amount: amountInUSD,
          transaction_hash: txHash
        });
      
      // 4. Update investment performance
      await updateInvestmentPerformance(amountInUSD, 'sell');
      
      // Show success notification
      transactionToast({
        title: "Sale Successful",
        description: `You have successfully sold ${tokenAmount} tokens of ${property.name}`,
        status: "success",
        txHash: txHash
      });
    } catch (error) {
      console.error('Error processing sale:', error);
      transactionToast({
        title: "Sale Failed",
        description: error instanceof Error ? error.message : "There was an error processing your sale. Please try again.",
        status: "error"
      });
    } finally {
      setIsProcessing(false);
      setSellDialogOpen(false);
    }
  };

  const handleTransferTokens = async () => {
    if (!user?.id) {
      transactionToast({
        title: "Authentication Required",
        description: "Please log in to transfer tokens",
        status: "error"
      });
      return;
    }

    if (!recipientAddress || !recipientAddress.startsWith('0x')) {
      transactionToast({
        title: "Invalid Address",
        description: "Please enter a valid wallet address starting with 0x",
        status: "error"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Calculate amount in USD
      const amountInUSD = property.tokenPrice * tokenAmount;
      
      // Generate mock transaction hash
      const txHash = generateTransactionHash();
      
      // Calculate ownership percentage
      const ownershipPercentage = calculateOwnershipPercentage();
      
      // 1. Check if user has enough tokens to transfer
      const { data: existingPortfolio } = await supabase
        .from(Tables.portfolios)
        .select('*')
        .eq('user_id', user.id)
        .eq('property_id', property.id)
        .single();
      
      if (!existingPortfolio || existingPortfolio.tokens_owned < tokenAmount) {
        throw new Error("You don't have enough tokens to transfer");
      }
      
      // 2. Update portfolio
      const newTokensOwned = existingPortfolio.tokens_owned - tokenAmount;
      const newOwnershipPercentage = existingPortfolio.ownership_percentage - ownershipPercentage;
      
      if (newTokensOwned > 0) {
        // Update portfolio with reduced tokens
        await supabase
          .from(Tables.portfolios)
          .update({
            tokens_owned: newTokensOwned,
            ownership_percentage: newOwnershipPercentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPortfolio.id);
      } else {
        // Remove property from portfolio if no tokens left
        await supabase
          .from(Tables.portfolios)
          .delete()
          .eq('id', existingPortfolio.id);
      }
      
      // 3. Record the transaction
      await supabase
        .from(Tables.transactions)
        .insert({
          user_id: user.id,
          property_id: property.id,
          property_name: property.name,
          transaction_type: 'transfer',
          tokens: tokenAmount,
          amount: amountInUSD,
          recipient_address: recipientAddress,
          transaction_hash: txHash
        });
      
      // 4. Update investment performance
      await updateInvestmentPerformance(amountInUSD, 'transfer');
      
      // Show success notification
      transactionToast({
        title: "Transfer Successful",
        description: `You have successfully transferred ${tokenAmount} tokens of ${property.name} to ${recipientAddress}`,
        status: "success",
        txHash: txHash
      });
    } catch (error) {
      console.error('Error processing transfer:', error);
      transactionToast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "There was an error processing your transfer. Please try again.",
        status: "error"
      });
    } finally {
      setIsProcessing(false);
      setTransferDialogOpen(false);
    }
  };

  return (
    <>
      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Property Tokens</DialogTitle>
            <DialogDescription>
              Purchase tokens for {property.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col space-y-1.5 mb-4">
              <label
                htmlFor="amount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Number of tokens
              </label>
              <input
                id="amount"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value))}
                min={1}
              />
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Select payment method</h4>
              <Tabs 
                defaultValue="fiat" 
                className="w-full" 
                onValueChange={(val) => val === "fiat" ? setPaymentMethod("INR") : setPaymentMethod("BTC")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fiat">Fiat Currency</TabsTrigger>
                  <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fiat" className="pt-4">
                  <RadioGroup 
                    defaultValue="INR"
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INR" id="INR" />
                      <Label htmlFor="INR" className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" /> 
                        Indian Rupee (INR)
                      </Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                
                <TabsContent value="crypto" className="pt-4">
                  <RadioGroup 
                    defaultValue="BTC"
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BTC" id="BTC" />
                      <Label htmlFor="BTC" className="flex items-center gap-1">
                        <Bitcoin className="h-4 w-4" /> 
                        Bitcoin (BTC)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ETH" id="ETH" />
                      <Label htmlFor="ETH">Ethereum (ETH)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USDC" id="USDC" />
                      <Label htmlFor="USDC">USD Coin (USDC)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USDT" id="USDT" />
                      <Label htmlFor="USDT">Tether (USDT)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SOL" id="SOL" />
                      <Label htmlFor="SOL">Solana (SOL)</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-4 space-y-2 border p-3 rounded-md bg-muted/30">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Price per token
                </span>
                <span className="text-sm font-medium">
                  {paymentMethod === "INR" ? `₹${priceInINR}` : `${getCurrencySymbol(paymentMethod)}${getCryptoAmount(paymentMethod)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total cost
                </span>
                <span className="text-sm font-semibold">
                  {paymentMethod === "INR" 
                    ? `₹${totalPriceInINR.toLocaleString()}` 
                    : `${getCurrencySymbol(paymentMethod)}${getCryptoAmount(paymentMethod)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">Your wallet balance</span>
                <span className="text-sm font-medium">
                  {wallet.balance ? `${wallet.balance} ETH` : "Connect wallet"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleBuyTokens} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Processing...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Buy Tokens
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell Property Tokens</DialogTitle>
            <DialogDescription>
              Sell your tokens for {property.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="sell-amount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Number of tokens to sell
              </label>
              <input
                id="sell-amount"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value))}
                min={1}
                max={0} // Would be the user's actual token balance
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Price per token
                </span>
                <span className="text-sm font-medium">
                  ₹{priceInINR}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total proceeds
                </span>
                <span className="text-sm font-semibold">
                  ₹{totalPriceInINR.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">Your token balance</span>
                <span className="text-sm font-medium">0 tokens</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSellDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSellTokens} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Processing...
                </>
              ) : (
                "Sell Tokens"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Property Tokens</DialogTitle>
            <DialogDescription>
              Transfer your tokens for {property.name} to another wallet
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col space-y-1.5 mb-4">
              <label
                htmlFor="recipient"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Recipient wallet address
              </label>
              <input
                id="recipient"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="transfer-amount"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Number of tokens to transfer
              </label>
              <input
                id="transfer-amount"
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(parseInt(e.target.value))}
                min={1}
                max={0} // Would be the user's actual token balance
              />
            </div>

            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-sm">Your token balance</span>
                <span className="text-sm font-medium">0 tokens</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTransferDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleTransferTokens} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Processing...
                </>
              ) : (
                "Transfer Tokens"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyTransactionDialogs;
