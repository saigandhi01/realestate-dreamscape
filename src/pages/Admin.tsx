
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCcw, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactRequestsTable from "@/components/admin/ContactRequestsTable";
import AdminHeader from "@/components/admin/AdminHeader";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in and is admin
  useEffect(() => {
    const checkAuthAndAdmin = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Access denied",
          description: "You must be logged in to view this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      // For a real implementation, you'd want to check admin role in a separate table
      // This is a simplified check - in a real app, you'd have proper role-based checks
      const { data: userEmail } = await supabase.auth.getUser();
      // Here we're just checking if the email ends with @tokenestate.com as an example
      // In a real application, use a proper roles system
      if (userEmail?.user?.email?.endsWith('@tokenestate.com')) {
        setIsAdmin(true);
      } else {
        toast({
          title: "Access denied",
          description: "You need admin privileges to view this page",
          variant: "destructive",
        });
        navigate("/");
      }
      
      setLoading(false);
    };
    
    checkAuthAndAdmin();
  }, [navigate, toast]);
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The user will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <AdminHeader />
        
        <div className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              Seller Contact Requests
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" onClick={handleRefresh} className="whitespace-nowrap">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          
          <ContactRequestsTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
