
import { Link } from 'react-router-dom';
import { Building2, MapPin, IndianRupee, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ZoomIn } from '@/components/ui/animations';

export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  tokenPrice: number;
  image: string;
  type: string;
  investors: number;
  funded: number;
  target: number;
}

interface PropertyCardProps {
  property: Property;
  index: number;
}

// INR conversion rate (1 USD = approximately 75 INR)
const USD_TO_INR = 75;

const PropertyCard = ({ property, index }: PropertyCardProps) => {
  const percentFunded = Math.round((property.funded / property.target) * 100);
  
  // Convert prices to INR
  const priceInINR = property.price * USD_TO_INR;
  const fundedInINR = property.funded * USD_TO_INR;
  const tokenPriceInINR = property.tokenPrice * USD_TO_INR;
  
  return (
    <ZoomIn delay={index * 0.1} className="h-full">
      <Link 
        to={`/property/${property.id}`} 
        className="block h-full rounded-xl overflow-hidden bg-card border border-border shadow-sm card-hover"
      >
        <div className="relative">
          {/* Property Image */}
          <div className="aspect-[16/9] overflow-hidden">
            <img 
              src={property.image} 
              alt={property.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          {/* Property Type Badge */}
          <Badge className="absolute top-3 left-3 font-medium bg-background/80 backdrop-blur-sm">
            {property.type}
          </Badge>
        </div>
        
        <div className="p-5">
          {/* Property Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1 line-clamp-1">{property.name}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin size={14} className="mr-1" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </div>
          </div>
          
          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span>₹{fundedInINR.toLocaleString()} raised</span>
              <span className="font-medium">{percentFunded}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: `${percentFunded}%` }}
              ></div>
            </div>
          </div>
          
          {/* Investment Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="flex items-center">
              <IndianRupee size={16} className="mr-2 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Token Price</p>
                <p className="font-medium">₹{tokenPriceInINR}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users size={16} className="mr-2 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Investors</p>
                <p className="font-medium">{property.investors}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ZoomIn>
  );
};

export default PropertyCard;
