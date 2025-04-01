
import { toast } from "@/hooks/use-toast";

// This file contains functions to extend the AuthContext with toast notifications
// Import and use these in the AuthContext

export const showLoginSuccessToast = (username: string) => {
  toast({
    title: "Login Successful",
    description: `Welcome back, ${username}!`,
    variant: "default",
  });
};

export const showLogoutToast = () => {
  toast({
    title: "Logged Out",
    description: "You have been successfully logged out",
    variant: "default",
  });
};

export const showWalletConnectedToast = (address: string) => {
  const truncatedAddress = address.slice(0, 6) + '...' + address.slice(-4);
  
  toast({
    title: "Wallet Connected",
    description: `Successfully connected to wallet ${truncatedAddress}`,
    variant: "default",
  });
};

export const showKycVerifiedToast = () => {
  toast({
    title: "KYC Verified",
    description: "Your KYC verification has been completed successfully",
    variant: "default",
  });
};
