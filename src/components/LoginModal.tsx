
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Mail, Facebook, Github } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    connectWithMetamask, 
    connectWithEmail,
    connectWithSocial,
    isConnecting 
  } = useAuth();
  
  const [view, setView] = useState<"main" | "email" | "social">("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
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

        {view === "email" && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 py-4">
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
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </form>
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
