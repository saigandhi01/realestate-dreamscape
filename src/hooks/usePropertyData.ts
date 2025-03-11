
import { useState, useMemo } from 'react';
import { Property } from '@/components/PropertyCard';

export const usePropertyData = () => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  // Filter properties based on search term and active filter
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || property.type.toLowerCase() === activeFilter.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }, [properties, searchTerm, activeFilter]);

  // Sort properties based on selected option
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
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
  }, [filteredProperties, sortOption]);

  // Property types for filtering
  const propertyTypes = useMemo(() => {
    return ['all', ...Array.from(new Set(properties.map(p => p.type.toLowerCase())))];
  }, [properties]);

  const resetFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
  };

  return {
    properties,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    sortOption,
    setSortOption,
    filteredProperties,
    sortedProperties,
    propertyTypes,
    resetFilters
  };
};
