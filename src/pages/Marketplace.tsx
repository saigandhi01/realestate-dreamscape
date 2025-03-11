
import { useEffect, useState } from 'react';
import { PageTransition } from '@/components/ui/animations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePropertyData } from '@/hooks/usePropertyData';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceSearch from '@/components/marketplace/MarketplaceSearch';
import PropertyList from '@/components/marketplace/PropertyList';
import EmptyPropertyList from '@/components/marketplace/EmptyPropertyList';

const Marketplace = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState('grid');
  
  const {
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    sortedProperties,
    propertyTypes,
    resetFilters
  } = usePropertyData();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header Section */}
        <MarketplaceHeader />
        
        {/* Search and Filters */}
        <MarketplaceSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          activeView={activeView}
          setActiveView={setActiveView}
          sortOption={sortOption}
          setSortOption={setSortOption}
          propertyTypes={propertyTypes}
        />
        
        {/* Properties Grid/List */}
        {sortedProperties.length > 0 ? (
          <PropertyList 
            properties={sortedProperties} 
            activeView={activeView} 
          />
        ) : (
          <EmptyPropertyList onResetFilters={resetFilters} />
        )}
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default Marketplace;
