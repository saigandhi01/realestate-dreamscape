
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Receipt, BarChart, Shield } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/ui/animations';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePropertyData } from '@/hooks/usePropertyData';
import { useAuth } from '@/contexts/AuthContext';

// Import new component files
import PropertyHero from '@/components/property/PropertyHero';
import PropertyOverviewTab from '@/components/property/PropertyOverviewTab';
import PropertyFinancialsTab from '@/components/property/PropertyFinancialsTab';
import PropertyDocumentsTab from '@/components/property/PropertyDocumentsTab';
import PropertyTransactionDialogs from '@/components/property/PropertyTransactionDialogs';

// INR conversion rate (1 USD = approximately 75 INR)
const USD_TO_INR = 75;

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { properties } = usePropertyData();
  const { isLoggedIn, wallet, openLoginModal } = useAuth();
  
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  
  // Find the property by ID
  const property = properties.find(p => p.id === id);
  
  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the property you're looking for.
            </p>
            <Button asChild>
              <a href="/marketplace">Return to Marketplace</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate funding percentage
  const fundingPercentage = Math.round((property.funded / property.target) * 100);
  
  // Document data
  const documents = [
    {
      id: 'ownership',
      name: 'Ownership Agreement',
      description: 'Legal document outlining ownership terms',
      type: 'PDF',
      size: '1.2MB',
      icon: FileText
    },
    {
      id: 'valuation',
      name: 'Property Valuation Report',
      description: 'Professional valuation of the property',
      type: 'PDF',
      size: '3.5MB',
      icon: Receipt
    },
    {
      id: 'financials',
      name: 'Financial Projections',
      description: 'Projected ROI and financial performance',
      type: 'PDF',
      size: '0.8MB',
      icon: BarChart
    },
    {
      id: 'audit',
      name: 'Smart Contract Audit',
      description: 'Security audit of the property token contract',
      type: 'PDF',
      size: '1.7MB',
      icon: Shield
    },
  ];
  
  // Financials data - update to INR
  const financials = {
    overview: {
      propertyValue: property.price * USD_TO_INR,
      tokensIssued: property.price / property.tokenPrice,
      rentalYield: 8.2,
      annualAppreciation: 5.4,
      lastDistribution: '2023-11-15',
      nextDistribution: '2023-12-15',
      currency: 'INR'
    },
    returns: {
      projectedAnnualReturn: 13.6,
      rentalIncome: 8.2,
      propertyAppreciation: 5.4,
      projectedROI5Years: 89.3,
      projectedROI10Years: 258.7
    }
  };
  
  const downloadDocument = (docId: string) => {
    console.log(`Downloading document: ${docId}`);
    // In a real app, this would trigger a download from S3, IPFS, or similar
  };
  
  // Convert wallet state to match expected props
  const walletProps = {
    address: wallet.address,
    balance: typeof wallet.balance === 'string' ? parseFloat(wallet.balance) : wallet.balance
  };
  
  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section - Now using PropertyHero component */}
        <PropertyHero 
          property={property}
          isLoggedIn={isLoggedIn}
          wallet={walletProps}
          fundingPercentage={fundingPercentage}
          openLoginModal={openLoginModal}
          setBuyDialogOpen={setBuyDialogOpen}
          setSellDialogOpen={setSellDialogOpen}
          setTransferDialogOpen={setTransferDialogOpen}
        />
        
        {/* Property Details Tabs */}
        <section className="py-8">
          <div className="container mx-auto px-6 md:px-10">
            <FadeIn>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-8 bg-background border overflow-x-auto hide-scrollbar">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab - using PropertyOverviewTab component */}
                <TabsContent value="overview" className="pt-2">
                  <PropertyOverviewTab 
                    propertyName={property.name}
                    propertyLocation={property.location}
                    financials={financials}
                  />
                </TabsContent>
                
                {/* Financials Tab - using PropertyFinancialsTab component */}
                <TabsContent value="financials" className="pt-2">
                  <PropertyFinancialsTab financials={financials} />
                </TabsContent>
                
                {/* Documents Tab - using PropertyDocumentsTab component */}
                <TabsContent value="documents" className="pt-2">
                  <PropertyDocumentsTab documents={documents} onDownload={downloadDocument} />
                </TabsContent>
              </Tabs>
            </FadeIn>
          </div>
        </section>
      </main>
      
      {/* Transaction Dialogs - using PropertyTransactionDialogs component */}
      <PropertyTransactionDialogs
        property={property}
        wallet={walletProps}
        buyDialogOpen={buyDialogOpen}
        sellDialogOpen={sellDialogOpen}
        transferDialogOpen={transferDialogOpen}
        setBuyDialogOpen={setBuyDialogOpen}
        setSellDialogOpen={setSellDialogOpen}
        setTransferDialogOpen={setTransferDialogOpen}
      />
      
      <Footer />
    </PageTransition>
  );
};

export default PropertyDetail;
