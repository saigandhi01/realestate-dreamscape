
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Mail, Facebook, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { isWalletAvailable } from "@/utils/wallet";

const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    connectWithMetamask,
    connectWithCoinbase,
    connectWithTrustWallet,
    connectWithPhantom,
    connectWithEmail,
    connectWithSocial,
    isConnecting 
  } = useAuth();
  
  const [view, setView] = useState<"main" | "email" | "social" | "wallet">("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check wallet availability
  const isMetaMaskAvailable = isWalletAvailable('metamask');
  const isCoinbaseWalletAvailable = isWalletAvailable('coinbase');
  const isTrustWalletAvailable = isWalletAvailable('trustwallet');
  const isPhantomWalletAvailable = isWalletAvailable('phantom');

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    connectWithEmail(email, password);
  };

  const resetView = () => {
    setView("main");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    resetView();
    closeLoginModal();
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to TokenEstate</DialogTitle>
          <DialogDescription>
            Connect your wallet to access the TokenEstate platform and invest in tokenized real estate.
          </DialogDescription>
        </DialogHeader>

        {view === "main" && (
          <div className="flex flex-col gap-4 py-4">
            <Button 
              onClick={() => setView("wallet")} 
              className="flex items-center justify-center gap-2"
            >
              <Wallet className="h-5 w-5" />
              Connect with Wallet
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Other Options
                </span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setView("email")}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Connect with Email
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setView("social")}
              className="flex items-center justify-center gap-2"
            >
              <Facebook className="h-5 w-5" />
              Connect with Social
            </Button>
          </div>
        )}

        {view === "wallet" && (
          <div className="flex flex-col gap-4 py-4">
            <Button 
              variant="outline" 
              onClick={connectWithMetamask} 
              disabled={isConnecting || !isMetaMaskAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="h-6 w-6" 
              />
              <div className="text-left">
                <p className="font-medium">MetaMask</p>
                <p className="text-xs text-muted-foreground">
                  {isMetaMaskAvailable ? "Connect to your MetaMask wallet" : "Install MetaMask extension"}
                </p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={connectWithCoinbase} 
              disabled={isConnecting || !isCoinbaseWalletAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3"
            >
              <img 
                src="https://static.coingecko.com/s/coinbase-wallet-f64d0a2ae5a0a601cef3bc0d35d8872e5f37880b2b9a78b9e1c5e922c9c9581c.png" 
                alt="Coinbase Wallet" 
                className="h-6 w-6" 
              />
              <div className="text-left">
                <p className="font-medium">Coinbase Wallet</p>
                <p className="text-xs text-muted-foreground">
                  {isCoinbaseWalletAvailable ? "Connect to your Coinbase wallet" : "Install Coinbase Wallet extension"}
                </p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={connectWithTrustWallet} 
              disabled={isConnecting || !isTrustWalletAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3"
            >
              <img 
                src="https://trustwallet.com/assets/images/favicon.png" 
                alt="Trust Wallet" 
                className="h-6 w-6" 
              />
              <div className="text-left">
                <p className="font-medium">Trust Wallet</p>
                <p className="text-xs text-muted-foreground">
                  {isTrustWalletAvailable ? "Connect to your Trust wallet" : "Install Trust Wallet extension"}
                </p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={connectWithPhantom} 
              disabled={isConnecting || !isPhantomWalletAvailable}
              className="flex justify-start items-center gap-2 h-auto py-3"
            >
              <img 
                src="https://phantom.app/img/phantom-logo.svg" 
                alt="Phantom" 
                className="h-6 w-6" 
              />
              <div className="text-left">
                <p className="font-medium">Phantom (Solana)</p>
                <p className="text-xs text-muted-foreground">
                  {isPhantomWalletAvailable ? "Connect to your Phantom wallet" : "Install Phantom extension"}
                </p>
              </div>
            </Button>
            
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </div>
        )}

        {view === "email" && (
          <div className="flex flex-col gap-4 py-4">
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Login"}
              </Button>
            </form>
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </div>
        )}

        {view === "social" && (
          <div className="flex flex-col gap-4 py-4">
            <Button 
              variant="outline" 
              onClick={() => connectWithSocial("facebook")}
              className="flex items-center justify-center gap-2"
            >
              <Facebook className="h-5 w-5" />
              Connect with Facebook
            </Button>
            <Button 
              variant="outline" 
              onClick={() => connectWithSocial("github")}
              className="flex items-center justify-center gap-2"
            >
              <Github className="h-5 w-5" />
              Connect with GitHub
            </Button>
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
