
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
import { Property } from "@/components/PropertyCard";

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

  const handleBuyTokens = () => {
    console.log(`Buying ${tokenAmount} tokens of property ${property.id}`);
    setBuyDialogOpen(false);
  };

  const handleSellTokens = () => {
    console.log(`Selling ${tokenAmount} tokens of property ${property.id}`);
    setSellDialogOpen(false);
  };

  const handleTransferTokens = () => {
    console.log(
      `Transferring ${tokenAmount} tokens of property ${property.id} to ${recipientAddress}`
    );
    setTransferDialogOpen(false);
  };

  return (
    <>
      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Property Tokens</DialogTitle>
            <DialogDescription>
              Purchase tokens for {property.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col space-y-1.5">
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

            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Price per token
                </span>
                <span className="text-sm font-medium">
                  ${property.tokenPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total cost
                </span>
                <span className="text-sm font-semibold">
                  ${property.tokenPrice * tokenAmount}
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
            <Button onClick={handleBuyTokens}>Buy Tokens</Button>
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
                  ${property.tokenPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total proceeds
                </span>
                <span className="text-sm font-semibold">
                  ${property.tokenPrice * tokenAmount}
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
