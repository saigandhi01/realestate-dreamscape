
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, LineChart, Lock, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard, { Property } from '@/components/PropertyCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, SlideUp, ZoomIn, RevealOnScroll, StaggerChildren, Float } from '@/components/ui/animations';

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Featured properties data
  const featuredProperties: Property[] = [
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
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative h-screen flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=3648&auto=format&fit=crop" 
              alt="Modern cityscape with river"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent"></div>
          </div>
          
          {/* Realistic light effect overlay */}
          <div className="absolute inset-0 z-1 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_70%)]"></div>
          
          <div className="container mx-auto px-6 md:px-10 relative z-10 pt-20">
            <div className="max-w-2xl">
              <FadeIn delay={0.2}>
                <Badge 
                  label="Revolutionary"
                  className="rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary mb-6 inline-flex items-center backdrop-blur-sm"
                >
                  Revolutionizing Real Estate Investment
                </Badge>
              </FadeIn>
              
              <SlideUp delay={0.4}>
                <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6 drop-shadow-sm">
                  Unlock Real Estate Investments Through Tokenization
                </h1>
              </SlideUp>
              
              <SlideUp delay={0.6}>
                <p className="text-lg md:text-xl text-foreground mb-8 max-w-xl drop-shadow-sm backdrop-blur-[2px] bg-background/5 rounded-md p-4">
                  Invest in premium properties with as little as $100. Tokenized real estate offers fractional ownership, liquidity, and blockchain security.
                </p>
              </SlideUp>
              
              <SlideUp delay={0.8}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="button-hover">
                    <Link to="/marketplace">Explore Properties</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="button-hover backdrop-blur-sm bg-background/30">
                    <Link to="/how-it-works">Learn More</Link>
                  </Button>
                </div>
              </SlideUp>
            </div>
          </div>
          
          {/* Floating elements for visual interest with improved realism */}
          <Float className="absolute bottom-[10%] right-[10%] hidden md:block" offset={15}>
            <div className="w-40 h-40 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"></div>
          </Float>
          <Float className="absolute top-[20%] right-[30%] hidden md:block" offset={10} duration={4}>
            <div className="w-24 h-24 rounded-full bg-primary/5 backdrop-blur-sm border border-primary/10 shadow-md"></div>
          </Float>
          <Float className="absolute bottom-[30%] left-[20%] hidden lg:block" offset={8} duration={5}>
            <div className="w-32 h-32 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"></div>
          </Float>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Benefits of Tokenized Real Estate
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover why real estate tokenization is revolutionizing the investment landscape.
                </p>
              </div>
            </RevealOnScroll>
            
            <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Building className="h-8 w-8 text-primary" />,
                  title: "Fractional Ownership",
                  description: "Invest in high-value properties with minimal capital through fractional ownership"
                },
                {
                  icon: <LineChart className="h-8 w-8 text-primary" />,
                  title: "Enhanced Liquidity",
                  description: "Trade your property tokens anytime on secondary markets for improved liquidity"
                },
                {
                  icon: <Lock className="h-8 w-8 text-primary" />,
                  title: "Blockchain Security",
                  description: "Benefit from the security and transparency of blockchain technology"
                },
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "Global Accessibility",
                  description: "Access real estate investments from anywhere in the world without intermediaries"
                }
              ].map((benefit, index) => (
                <Card key={index} className="border-0 bg-card shadow-none overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    Featured Properties
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Explore our curated selection of premium tokenized real estate opportunities.
                  </p>
                </div>
                <Button asChild variant="outline" className="mt-4 md:mt-0 button-hover">
                  <Link to="/marketplace" className="flex items-center">
                    View All Properties
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </RevealOnScroll>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-6 md:px-10">
            <RevealOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Ready to Start Your Real Estate Investment Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of investors who are already benefiting from tokenized real estate. 
                  Get started with as little as $100.
                </p>
                <Button asChild size="lg" className="button-hover">
                  <Link to="/marketplace">Explore Opportunities</Link>
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper Badge component
const Badge = ({ children, label, className }: { children: React.ReactNode; label?: string; className?: string }) => (
  <span className={className} aria-label={label}>
    {children}
  </span>
);

export default Index;
