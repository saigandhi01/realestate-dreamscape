
import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema
export const phoneVerificationSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

type PhoneVerificationFormProps = {
  onSubmit: (values: z.infer<typeof phoneVerificationSchema>) => void;
  onBack: () => void;
};

const PhoneVerificationForm = ({ onSubmit, onBack }: PhoneVerificationFormProps) => {
  const form = useForm<z.infer<typeof phoneVerificationSchema>>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  return (
    <div className="flex flex-col gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
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
      <Button variant="outline" type="button" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default PhoneVerificationForm;
