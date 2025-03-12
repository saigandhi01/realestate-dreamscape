
import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Mail, Facebook, Github, UserPlus, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Simulated reCAPTCHA component (in a real app, you would use a library like react-google-recaptcha)
const ReCaptcha = ({ onVerify }: { onVerify: (token: string) => void }) => {
  return (
    <div className="my-4">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full h-auto py-2" 
        onClick={() => onVerify("simulated-captcha-token")}
      >
        Click to verify (Simulated Captcha)
      </Button>
    </div>
  );
};

const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    connectWithMetamask, 
    connectWithEmail,
    signupWithEmail,
    connectWithSocial,
    isConnecting 
  } = useAuth();
  
  const [view, setView] = useState<"main" | "email" | "social">("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    connectWithEmail(email, password);
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreeToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    if (!captchaToken) {
      toast({
        title: "Captcha required",
        description: "Please complete the captcha verification",
        variant: "destructive",
      });
      return;
    }
    
    signupWithEmail(email, password, captchaToken);
  };

  const resetView = () => {
    setView("main");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCaptchaToken("");
    setAgreeToTerms(false);
    setActiveTab("login");
  };

  const handleClose = () => {
    resetView();
    closeLoginModal();
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    toast({
      title: "Captcha verified",
      description: "You have successfully completed the captcha verification",
    });
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
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
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <ReCaptcha onVerify={handleCaptchaVerify} />
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms} 
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-none">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
                
                <Button type="submit" disabled={isConnecting || !captchaToken || !agreeToTerms}>
                  {isConnecting ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
            
            <div className="mt-4">
              <Button variant="outline" type="button" onClick={() => setView("main")} className="w-full">
                Back
              </Button>
            </div>
          </Tabs>
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
