
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

// Import our new component files
import LoginDialogHeader from "@/components/auth/LoginDialogHeader";
import MainLoginOptions from "@/components/auth/MainLoginOptions";
import EmailSignInForm, { emailSignInSchema } from "@/components/auth/EmailSignInForm";
import CreateAccountForm, { createAccountSchema } from "@/components/auth/CreateAccountForm";
import PhoneVerificationForm, { phoneVerificationSchema } from "@/components/auth/PhoneVerificationForm";
import OTPVerificationForm, { otpVerificationSchema } from "@/components/auth/OTPVerificationForm";
import SocialLoginOptions from "@/components/auth/SocialLoginOptions";

type View = "main" | "email" | "social" | "wallet" | "create-account" | "phone" | "verify-otp";

const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    connectWithEmail,
    connectWithSocial,
    isConnecting
  } = useAuth();
  
  const [view, setView] = useState<View>("main");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleEmailLogin = (values: z.infer<typeof emailSignInSchema>) => {
    connectWithEmail(values.email, values.password);
  };

  const handleCreateAccount = (values: z.infer<typeof createAccountSchema>) => {
    // Simulate account creation and login
    toast({
      title: "Account created",
      description: "Your account has been created successfully!",
      variant: "default",
    });
    connectWithEmail(values.email, values.password);
  };

  const handlePhoneVerification = (values: z.infer<typeof phoneVerificationSchema>) => {
    // Simulate sending OTP
    setPhoneNumber(values.phoneNumber);
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${values.phoneNumber}`,
      variant: "default",
    });
    setView("verify-otp");
  };

  const handleOtpVerification = (values: z.infer<typeof otpVerificationSchema>) => {
    // Simulate OTP verification
    toast({
      title: "Verification Successful",
      description: "Your phone number has been verified",
      variant: "default",
    });
    // Connect user with phone
    toast({
      title: "Login Successful",
      description: `Welcome back, phone user!`,
      variant: "default",
    });
    closeLoginModal();
  };

  const resetView = () => {
    setView("main");
    setPhoneNumber("");
  };

  const handleClose = () => {
    resetView();
    closeLoginModal();
  };

  const handleSelectOption = (option: string) => {
    setView(option as View);
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <LoginDialogHeader view={view} phoneNumber={phoneNumber} />
        
        {view === "main" && (
          <MainLoginOptions 
            onSelectOption={handleSelectOption}
            onSocialLogin={connectWithSocial}
          />
        )}

        {view === "email" && (
          <EmailSignInForm 
            onSubmit={handleEmailLogin} 
            isConnecting={isConnecting}
            onBack={() => setView("main")}
          />
        )}

        {view === "create-account" && (
          <CreateAccountForm 
            onSubmit={handleCreateAccount}
            isConnecting={isConnecting}
            onBack={() => setView("main")}
          />
        )}

        {view === "phone" && (
          <PhoneVerificationForm
            onSubmit={handlePhoneVerification}
            onBack={() => setView("main")}
          />
        )}

        {view === "verify-otp" && (
          <OTPVerificationForm 
            onSubmit={handleOtpVerification}
            onBack={() => setView("phone")}
            phoneNumber={phoneNumber}
          />
        )}

        {view === "social" && (
          <SocialLoginOptions 
            onSocialLogin={connectWithSocial}
            onBack={() => setView("main")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
