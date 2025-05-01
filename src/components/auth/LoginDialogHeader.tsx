
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type View = "main" | "email" | "social" | "wallet" | "create-account" | "phone" | "verify-otp";

type LoginDialogHeaderProps = {
  view: View;
  phoneNumber?: string;
};

const LoginDialogHeader = ({ view, phoneNumber }: LoginDialogHeaderProps) => {
  const getTitleForView = (): string => {
    switch (view) {
      case "main": return "Connect to TokenEstate";
      case "email": return "Sign In with Email";
      case "create-account": return "Create New Account";
      case "social": return "Connect with Social";
      case "wallet": return "Connect Wallet";
      case "phone": return "Phone Verification";
      case "verify-otp": return "Verify OTP";
      default: return "Connect to TokenEstate";
    }
  };

  const getDescriptionForView = (): string => {
    switch (view) {
      case "main": return "Connect your wallet to access the TokenEstate platform and invest in tokenized real estate.";
      case "email": return "Sign in with your email and password.";
      case "create-account": return "Create a new account to join TokenEstate.";
      case "social": return "Connect with your social accounts.";
      case "wallet": return "Connect with your crypto wallet.";
      case "phone": return "Verify your phone number to continue.";
      case "verify-otp": return `Enter the verification code sent to ${phoneNumber}.`;
      default: return "Connect with your preferred method to access the platform.";
    }
  };

  return (
    <DialogHeader>
      <DialogTitle>{getTitleForView()}</DialogTitle>
      <DialogDescription>{getDescriptionForView()}</DialogDescription>
    </DialogHeader>
  );
};

export default LoginDialogHeader;
