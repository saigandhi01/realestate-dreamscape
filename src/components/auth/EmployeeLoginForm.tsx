
import React from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema
export const employeeLoginSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type EmployeeLoginFormProps = {
  onSubmit: (values: z.infer<typeof employeeLoginSchema>) => void;
  isConnecting: boolean;
  onBack: () => void;
};

const EmployeeLoginForm = ({ onSubmit, isConnecting, onBack }: EmployeeLoginFormProps) => {
  const form = useForm<z.infer<typeof employeeLoginSchema>>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: {
      employeeId: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col gap-4 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your employee ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
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
            {isConnecting ? "Signing in..." : "Employee Sign In"}
          </Button>
        </form>
      </Form>
      <Button variant="outline" type="button" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default EmployeeLoginForm;
