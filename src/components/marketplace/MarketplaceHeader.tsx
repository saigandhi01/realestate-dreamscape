
import { Building2, DollarSign, TrendingUp } from 'lucide-react';
import { RevealOnScroll, FadeIn } from '@/components/ui/animations';

type MarketStatProps = {
  label: string;
  value: string;
  icon: React.ElementRef<typeof Building2 | typeof DollarSign | typeof TrendingUp>;
}

const MarketplaceHeader = () => {
  // Marketplace stats (similar to Lofty.ai)
  const marketStats: MarketStatProps[] = [
    { label: 'Properties', value: '24', icon: Building2 },
    { label: 'Token Price', value: '$50', icon: DollarSign },
    { label: 'Total Value', value: '$7.2M', icon: TrendingUp },
    { label: 'Avg. Projected Return', value: '10.4%', icon: TrendingUp },
  ];

  return (
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
  );
};

export default MarketplaceHeader;
