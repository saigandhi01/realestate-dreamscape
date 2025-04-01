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

  const handleBuyTokens = () => {
    console.log(`Buying ${tokenAmount} tokens of property ${property.id} using ${paymentMethod}`);
    
    // Generate a mock transaction hash for demo purposes
    const mockTxHash = "0x" + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
    
    // Show transaction toast notification
    transactionToast({
      title: "Purchase Successful",
      description: `You have successfully purchased ${tokenAmount} tokens of ${property.name}`,
      status: "success",
      txHash: mockTxHash
    });
    
    setBuyDialogOpen(false);
  };

  const handleSellTokens = () => {
    console.log(`Selling ${tokenAmount} tokens of property ${property.id}`);
    
    // Generate a mock transaction hash for demo purposes
    const mockTxHash = "0x" + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
    
    // Show transaction toast notification
    transactionToast({
      title: "Sale Successful",
      description: `You have successfully sold ${tokenAmount} tokens of ${property.name}`,
      status: "success",
      txHash: mockTxHash
    });
    
    setSellDialogOpen(false);
  };

  const handleTransferTokens = () => {
    console.log(
      `Transferring ${tokenAmount} tokens of property ${property.id} to ${recipientAddress}`
    );
    
    // Generate a mock transaction hash for demo purposes
    const mockTxHash = "0x" + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
    
    // Show transaction toast notification
    transactionToast({
      title: "Transfer Successful",
      description: `You have successfully transferred ${tokenAmount} tokens of ${property.name} to ${recipientAddress}`,
      status: "success", 
      txHash: mockTxHash
    });
    
    setTransferDialogOpen(false);
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
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuyTokens}>
              <Wallet className="mr-2 h-4 w-4" />
              Buy Tokens
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
            <Button variant="outline" onClick={() => setSellDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSellTokens}>Sell Tokens</Button>
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
            >
              Cancel
            </Button>
            <Button onClick={handleTransferTokens}>Transfer Tokens</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyTransactionDialogs;
