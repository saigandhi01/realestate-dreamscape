
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  name: string;
  email: string;
  propertyName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { name, email, propertyName }: EmailData = await req.json();

    // Validate required fields
    if (!name || !email || !propertyName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    // In a real implementation, you would send an email here.
    // For example, using a service like SendGrid, Mailgun, or AWS SES
    console.log(`Would send confirmation email to ${name} at ${email} about ${propertyName}`);

    // Mock successful email sending
    const mockEmailResponse = {
      success: true,
      message: "Email has been sent successfully",
      to: email,
      subject: `Your interest in ${propertyName}`,
    };

    return new Response(
      JSON.stringify(mockEmailResponse),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error in send-contact-confirmation function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send confirmation email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
