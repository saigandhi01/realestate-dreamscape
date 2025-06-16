
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyTransactionButton from './marketplace/PropertyTransactionButton';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  roi: string;
  investors: number;
  description: string;
  type: string;
  tokenPrice: string;
  totalTokens: number;
  availableTokens: number;
}

interface PropertyCardProps {
  property: Property;
  view?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, view = 'grid' }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  if (view === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              src={property.image} 
              alt={property.title}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {property.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 mb-4">{property.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Property Value</p>
                  <p className="font-semibold text-lg">{property.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Token Price</p>
                  <p className="font-semibold text-lg text-purple-600">{property.tokenPrice}</p>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="font-semibold text-green-600">{property.roi}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="font-semibold">{property.investors}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  onClick={handleViewDetails}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <PropertyTransactionButton 
                  property={property}
                  className="flex-1"
                />
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-white/90 text-gray-800"
        >
          {property.type}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">{property.title}</h3>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Property Value</span>
            <span className="font-semibold">{property.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Token Price</span>
            <span className="font-semibold text-purple-600">{property.tokenPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-semibold text-green-600">{property.roi}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-500 mr-1" />
              <span className="font-semibold">{property.investors}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 space-y-2">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        <PropertyTransactionButton 
          property={property}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
