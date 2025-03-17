
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CookieConsent = () => {
  // Check if user has already accepted cookies
  const [accepted, setAccepted] = useState(true);
  
  useEffect(() => {
    // Check localStorage on component mount
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setAccepted(false);
    }
  }, []);
  
  if (accepted) return null;
  
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setAccepted(true);
    toast({
      title: "Cookies accepted",
      description: "Your cookie preferences have been saved.",
    });
  };
  
  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false');
    setAccepted(true);
    toast({
      title: "Cookies rejected",
      description: "We respect your choice. Note that some features might be limited.",
    });
  };
  
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <Alert className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start gap-4 sm:items-center justify-between bg-secondary/70 backdrop-blur-md border border-border">
        <AlertDescription className="flex-1">
          <p className="mb-2">
            We use cookies to enhance your experience on our site, personalize content, and analyze our traffic. 
            By clicking "Accept", you consent to our use of cookies.
          </p>
          <a href="#" className="text-primary underline text-sm">
            Learn more about our cookie policy
          </a>
        </AlertDescription>
        <div className="flex flex-wrap gap-3 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="min-w-20"
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="min-w-20"
          >
            Accept
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default CookieConsent;
