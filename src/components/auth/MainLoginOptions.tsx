
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Phone, Facebook, Github, Twitter } from "lucide-react";
import WalletSelectionPopover from "@/components/WalletSelectionPopover";

type MainLoginOptionsProps = {
  onSelectOption: (option: string) => void;
  onSocialLogin: (provider: string) => void;
};

const MainLoginOptions = ({ onSelectOption, onSocialLogin }: MainLoginOptionsProps) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Button 
        variant="outline" 
        onClick={() => onSelectOption("email")}
        className="flex items-center justify-center gap-2"
      >
        <LogIn className="h-5 w-5" />
        Sign In with Email
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onSelectOption("create-account")}
        className="flex items-center justify-center gap-2"
      >
        <UserPlus className="h-5 w-5" />
        Create New Account
      </Button>
      <WalletSelectionPopover triggerText="Connect with Wallet" variant="default" />
      <Button 
        variant="outline" 
        onClick={() => onSelectOption("phone")}
        className="flex items-center justify-center gap-2"
      >
        <Phone className="h-5 w-5" />
        Verify with Phone
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Social Options
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          onClick={() => onSocialLogin("facebook")}
          className="flex items-center justify-center gap-2"
        >
          <Facebook className="h-5 w-5" />
          Facebook
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onSocialLogin("twitter")}
          className="flex items-center justify-center gap-2"
        >
          <Twitter className="h-5 w-5" />
          Twitter
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onSocialLogin("github")}
          className="flex items-center justify-center gap-2"
        >
          <Github className="h-5 w-5" />
          GitHub
        </Button>
      </div>
    </div>
  );
};

export default MainLoginOptions;
