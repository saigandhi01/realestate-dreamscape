
import { useEffect, useState } from "react";
import { PropertyImage } from "@/hooks/usePropertyData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, IndianRupee, Send, Phone } from "lucide-react";
import { Property } from "@/components/PropertyCard";
import { SlideUp } from "@/components/ui/animations";
import { truncateAddress } from "@/utils/wallet";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ContactSellerForm from "./ContactSellerForm";

interface PropertyHeroProps {
  property: Property & { images?: PropertyImage[] };
  isLoggedIn: boolean;
  wallet: {
    address?: string;
    balance?: number;
  };
  fundingPercentage: number;
  openLoginModal: () => void;
  onBuyClick?: () => void;
  onSellClick?: () => void;
  onTransferClick?: () => void;
}

// INR conversion rate (1 USD = approximately 75 INR)
const USD_TO_INR = 75;

// Table names for type safety
const Tables = {
  portfolios: 'user_portfolios'
} as const;

const PropertyHero = ({
  property,
  isLoggedIn,
  wallet,
  fundingPercentage,
  openLoginModal,
  onBuyClick,
  onSellClick,
  onTransferClick,
}: PropertyHeroProps) => {
  // Convert prices to INR
  const priceInINR = property.price * USD_TO_INR;
  const tokenPriceInINR = property.tokenPrice * USD_TO_INR;
  const fundedInINR = property.funded * USD_TO_INR;
  const targetInINR = property.target * USD_TO_INR;
  
  const { user } = useAuth();
  const [userInvestment, setUserInvestment] = useState({
    tokensOwned: 0,
    ownership: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Contact seller dialog state
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // Fetch user's investment in this property
  useEffect(() => {
    const fetchUserInvestment = async () => {
      if (!isLoggedIn || !user?.id || !property.id) return;
      
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from(Tables.portfolios)
          .select('tokens_owned, ownership_percentage')
          .eq('user_id', user.id)
          .eq('property_id', property.id)
          .maybeSingle();
          
        if (data) {
          setUserInvestment({
            tokensOwned: data.tokens_owned,
            ownership: data.ownership_percentage
          });
        }
      } catch (error) {
        console.error('Error fetching user investment:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserInvestment();
    
    // Set up real-time subscription for updates
    if (isLoggedIn && user?.id && property.id) {
      const portfolioChannel = supabase
        .channel('property-investment')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: Tables.portfolios,
          filter: `user_id=eq.${user.id} AND property_id=eq.${property.id}`
        }, () => {
          fetchUserInvestment();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(portfolioChannel);
      };
    }
  }, [isLoggedIn, user?.id, property.id]);

  return (
    <section className="relative">
      <div className="h-80 md:h-96 w-full overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <PropertyImageCarousel images={property.images} />
        ) : (
          <>
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"></div>
          </>
        )}
      </div>

      <div className="container mx-auto px-6 md:px-10 relative -mt-40 pb-12">
        <SlideUp>
          <Card className="shadow-lg border-2">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Property Information Column */}
                <div className="lg:col-span-2">
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{property.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-6">
                    <MapPin size={16} className="mr-2" />
                    <span>{property.location}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Property Overview</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Property Type</span>
                          <span className="font-medium">{property.type}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Token Standard</span>
                          <span className="font-medium">ERC-1155</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Blockchain</span>
                          <span className="font-medium">Ethereum</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Tokenization Date</span>
                          <span className="font-medium">January 15, 2023</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Total Investors</span>
                          <span className="font-medium">{property.investors}</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Token Details</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Property Value</span>
                          <span className="font-medium">₹{priceInINR.toLocaleString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Token Price</span>
                          <span className="font-medium">₹{tokenPriceInINR}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Total Tokens</span>
                          <span className="font-medium">{Math.floor(property.price / property.tokenPrice).toLocaleString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Tokens Sold</span>
                          <span className="font-medium">{Math.floor(property.funded / property.tokenPrice).toLocaleString()}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Funding Progress</span>
                          <span className="font-medium">{fundingPercentage}%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact The Seller Column */}
                <div className="border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6">
                  <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
                  <div className="space-y-4">
                    <Button className="w-full" onClick={() => setContactDialogOpen(true)}>
                      <Phone size={16} className="mr-2" />
                      Contact The Seller
                    </Button>
                    
                    {/* Transaction Buttons */}
                    {isLoggedIn ? (
                      <div className="space-y-2">
                        <Button 
                          className="w-full" 
                          onClick={onBuyClick}
                          variant="outline"
                        >
                          Buy Tokens
                        </Button>
                        <Button 
                          className="w-full" 
                          onClick={onSellClick}
                          variant="outline"
                        >
                          Sell Tokens
                        </Button>
                        <Button 
                          className="w-full" 
                          onClick={onTransferClick}
                          variant="outline"
                        >
                          Transfer Tokens
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={openLoginModal}
                        variant="outline"
                      >
                        Login to Trade
                      </Button>
                    )}
                  </div>

                  {/* Funding Progress */}
                  <div className="mt-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span>₹{fundedInINR.toLocaleString()} raised</span>
                      <span className="font-medium">{fundingPercentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${fundingPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Target: ₹{targetInINR.toLocaleString()}
                    </p>
                  </div>

                  {/* Current User Balance (if logged in) */}
                  {isLoggedIn && (
                    <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Your Investment</h4>
                      {isLoading ? (
                        <div className="flex justify-center py-2">
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Wallet</span>
                            <span className="font-medium">{truncateAddress(wallet.address || '')}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Tokens Owned</span>
                            <span className="font-medium">{userInvestment.tokensOwned || 0}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Ownership</span>
                            <span className="font-medium">{userInvestment.ownership ? userInvestment.ownership.toFixed(2) : '0.00'}%</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Contact Seller Form Dialog */}
      <ContactSellerForm 
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        propertyName={property.name}
        propertyId={property.id}
      />
    </section>
  );
};

export default PropertyHero;
