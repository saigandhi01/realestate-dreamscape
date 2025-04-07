
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Mail, Phone, Facebook, Github, Twitter, LogIn, UserPlus, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import WalletSelectionPopover from "./WalletSelectionPopover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

// Form schemas
const emailSignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const createAccountSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const phoneVerificationSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

const otpVerificationSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type View = "main" | "email" | "social" | "wallet" | "create-account" | "phone" | "verify-otp";

const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    connectWithEmail,
    connectWithSocial,
    isConnecting,
    useTestAccount
  } = useAuth();
  
  const [view, setView] = useState<View>("main");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValue, setOtpValue] = useState("");

  // Forms
  const emailSignInForm = useForm<z.infer<typeof emailSignInSchema>>({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const createAccountForm = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const phoneVerificationForm = useForm<z.infer<typeof phoneVerificationSchema>>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const otpVerificationForm = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleEmailLogin = (values: z.infer<typeof emailSignInSchema>) => {
    connectWithEmail(values.email, values.password);
  };

  const handleCreateAccount = (values: z.infer<typeof createAccountSchema>) => {
    // Simulate account creation and login
    toast({
      title: "Account created",
      description: "Your account has been created successfully!",
      variant: "default", // Changed from "success" to "default"
    });
    connectWithEmail(values.email, values.password);
  };

  const handlePhoneVerification = (values: z.infer<typeof phoneVerificationSchema>) => {
    // Simulate sending OTP
    setPhoneNumber(values.phoneNumber);
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${values.phoneNumber}`,
      variant: "default", // Changed from "success" to "default"
    });
    setView("verify-otp");
  };

  const handleOtpVerification = (values: z.infer<typeof otpVerificationSchema>) => {
    // Simulate OTP verification
    toast({
      title: "Verification Successful",
      description: "Your phone number has been verified",
      variant: "default", // Changed from "success" to "default"
    });
    // Connect user with phone
    toast({
      title: "Login Successful",
      description: `Welcome back, phone user!`,
      variant: "default", // Changed from "success" to "default"
    });
    closeLoginModal();
  };

  const handleUseTestAccount = () => {
    useTestAccount();
    toast({
      title: "Demo Account Activated",
      description: "You're now logged in with a demo account that has 10 ETH",
      variant: "default" // Changed from "success" to "default"
    });
  };

  const resetView = () => {
    setView("main");
    emailSignInForm.reset();
    createAccountForm.reset();
    phoneVerificationForm.reset();
    otpVerificationForm.reset();
    setPhoneNumber("");
    setOtpValue("");
  };

  const handleClose = () => {
    resetView();
    closeLoginModal();
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {view === "main" && "Connect to TokenEstate"}
            {view === "email" && "Sign In with Email"}
            {view === "create-account" && "Create New Account"}
            {view === "social" && "Connect with Social"}
            {view === "wallet" && "Connect Wallet"}
            {view === "phone" && "Phone Verification"}
            {view === "verify-otp" && "Verify OTP"}
          </DialogTitle>
          <DialogDescription>
            {view === "main" && "Connect your wallet to access the TokenEstate platform and invest in tokenized real estate."}
            {view === "email" && "Sign in with your email and password."}
            {view === "create-account" && "Create a new account to join TokenEstate."}
            {view === "social" && "Connect with your social accounts."}
            {view === "wallet" && "Connect with your crypto wallet."}
            {view === "phone" && "Verify your phone number to continue."}
            {view === "verify-otp" && `Enter the verification code sent to ${phoneNumber}.`}
          </DialogDescription>
        </DialogHeader>

        {view === "main" && (
          <div className="flex flex-col gap-4 py-4">
            {/* Demo Account Button */}
            <Button 
              variant="default" 
              onClick={handleUseTestAccount}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Sparkles className="h-5 w-5" />
              Use Demo Account (10 ETH)
            </Button>
            
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setView("email")}
              className="flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In with Email
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setView("create-account")}
              className="flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Create New Account
            </Button>
            <WalletSelectionPopover triggerText="Connect with Wallet" variant="default" />
            <Button 
              variant="outline" 
              onClick={() => setView("phone")}
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
                onClick={() => connectWithSocial("facebook")}
                className="flex items-center justify-center gap-2"
              >
                <Facebook className="h-5 w-5" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                onClick={() => connectWithSocial("twitter")}
                className="flex items-center justify-center gap-2"
              >
                <Twitter className="h-5 w-5" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => connectWithSocial("github")}
                className="flex items-center justify-center gap-2"
              >
                <Github className="h-5 w-5" />
                GitHub
              </Button>
            </div>
          </div>
        )}

        {view === "email" && (
          <div className="flex flex-col gap-4 py-4">
            <Form {...emailSignInForm}>
              <form onSubmit={emailSignInForm.handleSubmit(handleEmailLogin)} className="flex flex-col gap-4">
                <FormField
                  control={emailSignInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailSignInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isConnecting}>
                  {isConnecting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </div>
        )}

        {view === "create-account" && (
          <div className="flex flex-col gap-4 py-4">
            <Form {...createAccountForm}>
              <form onSubmit={createAccountForm.handleSubmit(handleCreateAccount)} className="flex flex-col gap-4">
                <FormField
                  control={createAccountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createAccountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createAccountForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isConnecting}>
                  {isConnecting ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </div>
        )}

        {view === "phone" && (
          <div className="flex flex-col gap-4 py-4">
            <Form {...phoneVerificationForm}>
              <form onSubmit={phoneVerificationForm.handleSubmit(handlePhoneVerification)} className="flex flex-col gap-4">
                <FormField
                  control={phoneVerificationForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  Send Verification Code
                </Button>
              </form>
            </Form>
            <Button variant="outline" type="button" onClick={() => setView("main")}>
              Back
            </Button>
          </div>
        )}

        {view === "verify-otp" && (
          <div className="flex flex-col gap-4 py-4">
            <Form {...otpVerificationForm}>
              <form onSubmit={otpVerificationForm.handleSubmit(handleOtpVerification)} className="flex flex-col gap-4">
                <FormField
                  control={otpVerificationForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={otpValue} onChange={(value) => {
                            setOtpValue(value);
                            field.onChange(value);
                          }}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  Verify Code
                </Button>
              </form>
            </Form>
            <Button variant="outline" type="button" onClick={() => setView("phone")}>
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
              onClick={() => connectWithSocial("twitter")}
              className="flex items-center justify-center gap-2"
            >
              <Twitter className="h-5 w-5" />
              Connect with Twitter
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
