
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketplaceSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  propertyTypes: string[];
}

const MarketplaceSearch = ({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  isFilterOpen,
  setIsFilterOpen,
  activeView,
  setActiveView,
  sortOption,
  setSortOption,
  propertyTypes
}: MarketplaceSearchProps) => {
  return (
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
  );
};

export default MarketplaceSearch;
