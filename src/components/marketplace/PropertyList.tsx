
import { Building2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RevealOnScroll } from '@/components/ui/animations';
import { Badge } from "@/components/ui/badge";
import PropertyCard, { Property } from '@/components/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyListProps {
  properties: Property[];
  activeView: string;
}

const PropertyList = ({ properties, activeView }: PropertyListProps) => {
  const { isLoggedIn, openLoginModal } = useAuth();

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-6 md:px-10">
        {properties.length > 0 ? (
          <>
            {activeView === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {properties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {properties.map((property, index) => (
                  <RevealOnScroll key={property.id} className="delay-100">
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={property.image} 
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="flex-1 p-5">
                          <div className="flex flex-col h-full">
                            <div className="mb-auto">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg line-clamp-1">{property.name}</h3>
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin size={14} className="mr-1" />
                                    <span className="text-sm">{property.location}</span>
                                  </div>
                                </div>
                                <Badge>{property.type}</Badge>
                              </div>
                              
                              <div className="my-4">
                                <div className="flex justify-between text-sm mb-1.5">
                                  <span>${property.funded.toLocaleString()} raised</span>
                                  <span className="font-medium">{Math.round((property.funded / property.target) * 100)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div 
                                    className="bg-primary h-1.5 rounded-full" 
                                    style={{ width: `${Math.round((property.funded / property.target) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div>
                                <p className="text-sm text-muted-foreground">Property Price</p>
                                <p className="font-semibold">${property.price.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Token Price</p>
                                <p className="font-semibold">${property.tokenPrice}</p>
                              </div>
                              <Button size="sm">View Property</Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </RevealOnScroll>
                ))}
              </div>
            )}
            
            {/* Enhanced Connection banner for non-logged in users */}
            {!isLoggedIn && (
              <div className="mt-12 bg-primary/5 border rounded-xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet to Invest</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    To purchase property tokens, you'll need to connect your wallet first. 
                    We support multiple cryptocurrencies for investment, including ETH, BTC, USDT, and USDC.
                  </p>
                  <Button className="mx-auto mt-4" onClick={openLoginModal}>Connect Wallet</Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium text-lg mb-2">How to Connect Your Wallet</h4>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Click the "Connect Wallet" button above</li>
                        <li>Select your preferred wallet provider</li>
                        <li>Follow the authentication steps in your wallet</li>
                        <li>Once connected, you can browse and invest in properties</li>
                      </ol>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-medium text-lg mb-2">How to Purchase Property Tokens</h4>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Browse properties in the marketplace</li>
                        <li>Select a property you're interested in</li>
                        <li>Choose how many tokens you want to purchase</li>
                        <li>Complete the transaction using ETH, BTC, USDT, or USDC</li>
                        <li>Receive your property tokens in your wallet</li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        ) : (
          <RevealOnScroll className="text-center py-16">
            <Building2 className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                // This will be handled by the parent
              }}
            >
              Reset Filters
            </Button>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
};

export default PropertyList;
