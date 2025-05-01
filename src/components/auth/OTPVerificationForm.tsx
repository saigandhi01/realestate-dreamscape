
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema
export const otpVerificationSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPVerificationFormProps = {
  onSubmit: (values: z.infer<typeof otpVerificationSchema>) => void;
  onBack: () => void;
  phoneNumber: string;
};

const OTPVerificationForm = ({ onSubmit, onBack, phoneNumber }: OTPVerificationFormProps) => {
  const [otpValue, setOtpValue] = useState("");
  
  const form = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <div className="flex flex-col gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
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
      <Button variant="outline" type="button" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default OTPVerificationForm;
