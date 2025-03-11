
import { useEffect, useState } from 'react';
import { Search, Filter, Building2, SlidersHorizontal, MapPin, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Property } from '@/components/PropertyCard';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, PageTransition, RevealOnScroll } from '@/components/ui/animations';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace = () => {
  const { wallet, isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  const [sortOption, setSortOption] = useState('default');
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Properties data - mimicking Lofty.ai style
  const properties: Property[] = [
    {
      id: '1',
      name: '2831 N Cambridge Ave, Milwaukee',
      location: 'Milwaukee, WI',
      price: 217500,
      tokenPrice: 50,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      type: 'Single Family',
      investors: 78,
      funded: 182700,
      target: 217500
    },
    {
      id: '2',
      name: '1523 W Grace St, Richmond',
      location: 'Richmond, VA',
      price: 385000,
      tokenPrice: 50,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
      type: 'Multi-Family',
      investors: 145,
      funded: 290000,
      target: 385000
    },
    {
      id: '3',
      name: '714 Ivy Green Dr, Birmingham',
      location: 'Birmingham, AL',
      price: 164000,
      tokenPrice: 50,
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
      type: 'Single Family',
      investors: 56,
      funded: 121000,
      target: 164000
    },
    {
      id: '4',
      name: '419 E 38th St, Indianapolis',
      location: 'Indianapolis, IN',
      price: 186500,
      tokenPrice: 50,
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2065&auto=format&fit=crop',
      type: 'Single Family',
      investors: 67,
      funded: 149200,
      target: 186500
    },
    {
      id: '5',
      name: '724 Lucy Ave, Memphis',
      location: 'Memphis, TN',
      price: 138000,
      tokenPrice: 50,
      image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=2074&auto=format&fit=crop',
      type: 'Single Family',
      investors: 53,
      funded: 118000,
      target: 138000
    },
    {
      id: '6',
      name: '2705 Kildaire Dr, Baltimore',
      location: 'Baltimore, MD',
      price: 193000,
      tokenPrice: 50,
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop',
      type: 'Single Family',
      investors: 72,
      funded: 162000,
      target: 193000
    }
  ];

  // Filter properties based on search term and active filter
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || property.type.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Sort properties based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'fundingDesc':
        return (b.funded / b.target) - (a.funded / a.target);
      case 'fundingAsc':
        return (a.funded / a.target) - (b.funded / b.target);
      default:
        return 0;
    }
  });

  // Property types for filtering
  const propertyTypes = ['all', ...Array.from(new Set(properties.map(p => p.type.toLowerCase())))];

  // Marketplace stats (similar to Lofty.ai)
  const marketStats = [
    { label: 'Properties', value: '24', icon: Building2 },
    { label: 'Token Price', value: '$50', icon: DollarSign },
    { label: 'Total Value', value: '$7.2M', icon: TrendingUp },
    { label: 'Avg. Projected Return', value: '10.4%', icon: TrendingUp },
  ];

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header Section - similar to Lofty.ai banner */}
        <section className="bg-primary/10 py-12 md:py-16 border-b">
          <div className="container mx-auto px-6 md:px-10">
            <FadeIn>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Real Estate Marketplace
              </h1>
              <p className="text-muted-foreground max-w-3xl text-lg mb-8">
                Browse our curated selection of tokenized real estate properties. 
                Start building your real estate portfolio with as little as $50 per token.
              </p>
              
              {/* Marketplace Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-10">
                {marketStats.map((stat, index) => (
                  <RevealOnScroll 
                    key={stat.label} 
                    delay={index * 0.1} 
                    className="bg-background/80 backdrop-blur-sm rounded-xl border p-4 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm">{stat.label}</p>
                        <p className="text-xl font-semibold">{stat.value}</p>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
        
        {/* Search and Filters - similar to Lofty.ai control bar */}
        <section className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b shadow-sm">
          <div className="container mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                {/* Sort Options */}
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="default">Sort By</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="fundingDesc">Funding: Most</option>
                  <option value="fundingAsc">Funding: Least</option>
                </select>
                
                {/* Filter Toggle (Mobile) */}
                <Button 
                  variant="outline" 
                  className="md:hidden"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                
                {/* View Toggle */}
                <div className="hidden md:flex h-10 items-center rounded-md border bg-muted p-1">
                  <Button
                    variant={activeView === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 rounded-sm px-2.5"
                    onClick={() => setActiveView('grid')}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={activeView === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    className="h-8 rounded-sm px-2.5"
                    onClick={() => setActiveView('list')}
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Filters (Mobile & Desktop) */}
            <div className={`mt-4 ${isFilterOpen || 'hidden md:block'}`}>
              <Tabs 
                defaultValue="all" 
                value={activeFilter}
                onValueChange={setActiveFilter}
                className="w-full"
              >
                <TabsList className="w-full flex overflow-x-auto justify-start">
                  {propertyTypes.map(type => (
                    <TabsTrigger 
                      key={type} 
                      value={type}
                      className="capitalize flex-none"
                    >
                      {type === 'all' ? 'All Properties' : type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Properties Grid/List - similar to Lofty.ai listing display */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-6 md:px-10">
            {sortedProperties.length > 0 ? (
              <>
                {activeView === 'grid' ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {sortedProperties.map((property, index) => (
                      <PropertyCard key={property.id} property={property} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    {sortedProperties.map((property, index) => (
                      <RevealOnScroll key={property.id} delay={index * 0.05}>
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
                
                {/* Connection banner for non-logged in users */}
                {!isLoggedIn && (
                  <div className="mt-12 bg-primary/5 border rounded-xl p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Connect Your Wallet to Invest</h3>
                    <p className="text-muted-foreground mb-4">
                      To purchase property tokens, you'll need to connect your wallet first.
                    </p>
                    <Button className="mx-auto">Connect Wallet</Button>
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
                    setSearchTerm('');
                    setActiveFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </RevealOnScroll>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default Marketplace;
