
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from "lucide-react";
import { format } from "date-fns";

interface ContactRequest {
  id: string;
  property_id: string;
  property_name: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  newsletter_subscription: boolean;
  created_at: string;
}

interface ContactRequestsTableProps {
  searchQuery: string;
  refreshTrigger: number;
}

const ContactRequestsTable = ({ searchQuery, refreshTrigger }: ContactRequestsTableProps) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchContactRequests = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("seller_contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching contact requests:", error);
        setRequests([]);
      } else {
        setRequests(data as ContactRequest[]);
      }
      
      setLoading(false);
    };
    
    fetchContactRequests();
  }, [refreshTrigger]);
  
  const filteredRequests = requests.filter(request => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      request.name.toLowerCase().includes(query) ||
      request.email.toLowerCase().includes(query) ||
      request.mobile.toLowerCase().includes(query) ||
      request.property_name.toLowerCase().includes(query) ||
      request.message.toLowerCase().includes(query)
    );
  });
  
  const handleViewDetails = (request: ContactRequest) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableCaption>
            {loading ? "Loading requests..." : `${filteredRequests.length} contact requests found`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Newsletter</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No contact requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatDateTime(request.created_at)}
                  </TableCell>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{request.email}</span>
                      <span className="text-sm text-muted-foreground">{request.mobile}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.property_name}</TableCell>
                  <TableCell>
                    {request.newsletter_subscription ? (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(request)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Contact Request Details</DialogTitle>
                <DialogDescription>
                  Submitted on {formatDateTime(selectedRequest.created_at)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Customer Info</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedRequest.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mobile Number</p>
                        <p className="font-medium">{selectedRequest.mobile}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Newsletter Subscription</p>
                        <p className="font-medium">
                          {selectedRequest.newsletter_subscription ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Property Info</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Property Name</p>
                        <p className="font-medium">{selectedRequest.property_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Property ID</p>
                        <p className="font-medium">{selectedRequest.property_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Request ID</p>
                        <p className="font-medium break-all">{selectedRequest.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Message</h3>
                  <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedRequest.message}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setOpenDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      window.location.href = `mailto:${selectedRequest.email}?subject=RE: Your inquiry about ${selectedRequest.property_name}`;
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactRequestsTable;
