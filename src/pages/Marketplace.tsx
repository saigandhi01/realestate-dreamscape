
import { useEffect, useState } from 'react';
import { Search, Filter, Building2, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from '@/components/PropertyCard';
import PropertyCard from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, PageTransition, RevealOnScroll } from '@/components/ui/animations';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Properties data
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

  // Filter properties based on search term and active filter
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || property.type.toLowerCase() === activeFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  // Property types for filtering
  const propertyTypes = ['all', ...Array.from(new Set(properties.map(p => p.type.toLowerCase())))];

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header Section */}
        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-6 md:px-10">
            <FadeIn>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Property Marketplace
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Browse our selection of tokenized real estate properties. 
                Filter by property type or search for specific listings.
              </p>
            </FadeIn>
          </div>
        </section>
        
        {/* Search and Filters */}
        <section className="py-8 border-b">
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
              
              {/* Filter Toggle (Mobile) */}
              <Button 
                variant="outline" 
                className="md:hidden w-full"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              
              {/* Filters (Desktop) */}
              <div className="hidden md:flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground mr-2" />
                <span className="text-sm font-medium">Filter by:</span>
                <Tabs 
                  defaultValue="all" 
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                  className="w-full"
                >
                  <TabsList>
                    {propertyTypes.map(type => (
                      <TabsTrigger 
                        key={type} 
                        value={type}
                        className="capitalize"
                      >
                        {type === 'all' ? 'All Properties' : type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {/* Filters (Mobile) */}
            {isFilterOpen && (
              <div className="mt-4 md:hidden">
                <Tabs 
                  defaultValue="all" 
                  value={activeFilter}
                  onValueChange={setActiveFilter}
                  className="w-full"
                >
                  <TabsList className="w-full flex overflow-x-auto">
                    {propertyTypes.map(type => (
                      <TabsTrigger 
                        key={type} 
                        value={type}
                        className="capitalize flex-1"
                      >
                        {type === 'all' ? 'All' : type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
        </section>
        
        {/* Properties Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6 md:px-10">
            {filteredProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
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
