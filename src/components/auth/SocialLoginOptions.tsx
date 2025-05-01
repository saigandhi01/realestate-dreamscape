
import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Github } from "lucide-react";

type SocialLoginOptionsProps = {
  onSocialLogin: (provider: string) => void;
  onBack: () => void;
};

const SocialLoginOptions = ({ onSocialLogin, onBack }: SocialLoginOptionsProps) => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Button 
        variant="outline" 
        onClick={() => onSocialLogin("facebook")}
        className="flex items-center justify-center gap-2"
      >
        <Facebook className="h-5 w-5" />
        Connect with Facebook
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onSocialLogin("twitter")}
        className="flex items-center justify-center gap-2"
      >
        <Twitter className="h-5 w-5" />
        Connect with Twitter
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onSocialLogin("github")}
        className="flex items-center justify-center gap-2"
      >
        <Github className="h-5 w-5" />
        Connect with GitHub
      </Button>
      <Button variant="outline" type="button" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default SocialLoginOptions;
