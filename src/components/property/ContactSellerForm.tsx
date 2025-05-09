
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, Phone, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobile: z.string().min(10, { message: "Mobile number must be at least 10 digits." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  newsletter: z.boolean().default(false),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Privacy Policy.",
  }),
});

interface ContactSellerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyName: string;
  propertyId: string;
}

const ContactSellerForm = ({
  open,
  onOpenChange,
  propertyName,
  propertyId,
}: ContactSellerFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      message: "",
      newsletter: false,
      privacyPolicy: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Save contact request to database
      // Use the correct method to insert data into the Supabase table
      const { error } = await supabase
        .from("seller_contact_requests")
        .insert({
          property_id: propertyId,
          property_name: propertyName,
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          message: values.message,
          newsletter_subscription: values.newsletter,
        });

      if (error) throw error;

      // Send confirmation email to user via edge function
      try {
        const { error: emailError } = await supabase.functions.invoke("send-contact-confirmation", {
          body: {
            name: values.name,
            email: values.email,
            propertyName: propertyName
          }
        });

        if (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }
      } catch (emailErr) {
        console.error("Failed to call edge function:", emailErr);
      }

      // Show success message
      toast({
        title: "Contact request sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });

      // Close the dialog
      onOpenChange(false);

      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Something went wrong",
        description: "Your contact request couldn't be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-br from-[#9b87f5] via-[#7E69AB] to-[#D946EF] p-6 pt-8 rounded-t-lg">
          <DialogHeader className="text-white">
            <DialogTitle className="text-xl font-bold">Contact The Seller</DialogTitle>
            <DialogDescription className="text-white/90 text-sm mt-1">
              Interested in this property? Fill out the form below and we'll connect you with the seller.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center relative">
                        <User className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Your name" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="flex items-center relative">
                          <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="your.email@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center relative">
                          <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Your mobile number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I'm interested in this property and would like to know more about..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md bg-muted/30 p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5 leading-none">
                        <FormLabel>Keep me posted</FormLabel>
                        <FormDescription className="text-xs">
                          Receive news and information about TokenEstate
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacyPolicy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md bg-muted/30 p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5 leading-none">
                        <FormLabel>Privacy Policy</FormLabel>
                        <FormDescription className="text-xs">
                          I agree to TokenEstate's{" "}
                          <a
                            href="#"
                            className="text-primary underline hover:text-primary/90"
                            onClick={(e) => e.preventDefault()}
                          >
                            Privacy Policy
                          </a>
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-5 pt-3 border-t flex flex-row justify-end gap-2">
                <Button 
                  variant="outline"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="px-6" 
                  disabled={isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <span className="mr-2">Sending...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Contact Seller
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSellerForm;
