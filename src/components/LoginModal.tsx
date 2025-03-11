
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, connectWithMetamask, isConnecting } = useAuth();

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to TokenEstate</DialogTitle>
          <DialogDescription>
            Connect your wallet to access the TokenEstate platform and invest in tokenized real estate.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button 
            onClick={connectWithMetamask} 
            disabled={isConnecting}
            className="flex items-center justify-center gap-2"
          >
            <Wallet className="h-5 w-5" />
            {isConnecting ? "Connecting..." : "Connect with MetaMask"}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Coming Soon
              </span>
            </div>
          </div>
          <Button variant="outline" disabled className="opacity-50">
            Connect with Email
          </Button>
          <Button variant="outline" disabled className="opacity-50">
            Connect with Social
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
