
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Building2, Calendar, Users, Banknote, 
  BarChart, ShieldCheck, ArrowLeft, ExternalLink 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PageTransition, SlideUp, ZoomIn, RevealOnScroll } from '@/components/ui/animations';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Properties data (in a real app, you would fetch this based on ID)
  const properties: Property[] = [
    {
      id: '1',
      name: 'Luxury Apartment Complex',
      location: 'Miami, Florida',
      price: 12500000,
      tokenPrice: 100,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2940&auto=format&fit=crop',
      type: 'Residential',
      investors: 342,
      funded: 8750000,
      target: 12500000
    },
    {
      id: '2',
      name: 'Downtown Office Building',
      location: 'Chicago, Illinois',
      price: 28000000,
      tokenPrice: 250,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2940&auto=format&fit=crop',
      type: 'Commercial',
      investors: 513,
      funded: 22400000,
      target: 28000000
    },
    {
      id: '3',
      name: 'Waterfront Shopping Plaza',
      location: 'Seattle, Washington',
      price: 18750000,
      tokenPrice: 125,
      image: 'https://images.unsplash.com/photo-1535025639604-9a804c092faa?q=80&w=2938&auto=format&fit=crop',
      type: 'Retail',
      investors: 267,
      funded: 11250000,
      target: 18750000
    },
    {
      id: '4',
      name: 'Modern Industrial Warehouse',
      location: 'Austin, Texas',
      price: 8400000,
      tokenPrice: 75,
      image: 'https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?q=80&w=2940&auto=format&fit=crop',
      type: 'Industrial',
      investors: 189,
      funded: 5040000,
      target: 8400000
    },
    {
      id: '5',
      name: 'Boutique Hotel Property',
      location: 'San Francisco, California',
      price: 22000000,
      tokenPrice: 200,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2940&auto=format&fit=crop',
      type: 'Hospitality',
      investors: 408,
      funded: 15400000,
      target: 22000000
    },
    {
      id: '6',
      name: 'Urban Residential Tower',
      location: 'New York, New York',
      price: 36000000,
      tokenPrice: 300,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop',
      type: 'Residential',
      investors: 567,
      funded: 25200000,
      target: 36000000
    }
  ];

  // Find the property with the matching ID
  const property = properties.find(p => p.id === id);

  // If property not found, show error message
  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const percentFunded = Math.round((property.funded / property.target) * 100);

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Back to Marketplace Link */}
        <div className="container mx-auto px-6 md:px-10 py-4">
          <Button asChild variant="ghost" size="sm" className="pl-2">
            <Link to="/marketplace" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
        
        {/* Property Images */}
        <section className="container mx-auto px-6 md:px-10 mb-12">
          <ZoomIn>
            <div className="rounded-xl overflow-hidden aspect-[21/9] max-h-[500px]">
              <img 
                src={property.image} 
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
          </ZoomIn>
        </section>
        
        {/* Property Details */}
        <section className="container mx-auto px-6 md:px-10 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Property Info */}
            <div className="lg:col-span-2">
              <SlideUp>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {property.type}
                    </span>
                    <span className="text-muted-foreground text-sm ml-3">
                      Property ID: {property.id}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                    {property.name}
                  </h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin size={16} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </SlideUp>
              
              <SlideUp delay={0.1}>
                <Tabs defaultValue="overview" className="mb-10">
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Property Description</h3>
                      <p className="text-muted-foreground">
                        This {property.type.toLowerCase()} property offers a unique investment opportunity in the heart of {property.location}. 
                        With a total valuation of ${property.price.toLocaleString()}, this property has been tokenized to allow 
                        fractional ownership and is already {percentFunded}% funded by {property.investors} investors.
                      </p>
                      <p className="text-muted-foreground mt-3">
                        Investors can purchase tokens at ${property.tokenPrice} per token, with each token representing 
                        a fractional ownership in the property. This investment offers both potential capital appreciation 
                        and regular dividend distributions from rental income.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Investment Highlights</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>Property tokenized using ERC-721 standard on Ethereum blockchain</span>
                        </li>
                        <li className="flex items-start">
                          <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>Smart contracts audited by leading security firms</span>
                        </li>
                        <li className="flex items-start">
                          <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>Quarterly dividend distributions from rental income</span>
                        </li>
                        <li className="flex items-start">
                          <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>Secondary market trading supported for liquidity</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Property Specifications</h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Property Type:</span>
                              <span className="font-medium">{property.type}</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Year Built:</span>
                              <span className="font-medium">2019</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Total Area:</span>
                              <span className="font-medium">12,500 sq ft</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Occupancy Rate:</span>
                              <span className="font-medium">95%</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
                          <ul className="space-y-3">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Annual Return:</span>
                              <span className="font-medium">7.2%</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Management Fee:</span>
                              <span className="font-medium">1.5%</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Dividend Frequency:</span>
                              <span className="font-medium">Quarterly</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Exit Strategy:</span>
                              <span className="font-medium">5-7 years</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold mb-3">Legal Documents</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                            <span>Property Prospectus.pdf</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                            <span>Legal Structure.pdf</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                            <span>Smart Contract Audit.pdf</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                            <span>Past Performance.pdf</span>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </SlideUp>
            </div>
            
            {/* Right Column - Investment Details */}
            <div>
              <SlideUp delay={0.2}>
                <Card className="sticky top-28">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold mb-1">${property.price.toLocaleString()}</h3>
                      <p className="text-muted-foreground">Total Property Value</p>
                    </div>
                    
                    {/* Funding Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>${property.funded.toLocaleString()} raised</span>
                        <span className="font-medium">{percentFunded}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${percentFunded}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>Target: ${property.target.toLocaleString()}</span>
                        <span>{property.investors} investors</span>
                      </div>
                    </div>
                    
                    {/* Token Information */}
                    <div className="mb-6 space-y-4">
                      <div className="flex items-center">
                        <Banknote className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">Token Price</p>
                          <p className="font-semibold">${property.tokenPrice} per token</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Investors</p>
                          <p className="font-semibold">{property.investors}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">Property Type</p>
                          <p className="font-semibold">{property.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <BarChart className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Annual Return</p>
                          <p className="font-semibold">7.2%</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full mb-3 button-hover">Invest Now</Button>
                    <Button variant="outline" className="w-full">Add to Watchlist</Button>
                  </CardContent>
                </Card>
              </SlideUp>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default PropertyDetails;
