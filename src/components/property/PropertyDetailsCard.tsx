
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calendar, 
  Users, 
  Gauge, 
  Building, 
  MapPin,
  Ruler,
  Bed,
  Bath,
  Car
} from 'lucide-react';

interface PropertyDetailsCardProps {
  propertyName: string;
  propertyLocation: string;
  propertyType: string;
}

const PropertyDetailsCard = ({ propertyName, propertyLocation, propertyType }: PropertyDetailsCardProps) => {
  // Mock detailed property data - in real app, this would come from props or API
  const propertyDetails = {
    area: "2,500 sq ft",
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    yearBuilt: 2018,
    lotSize: "0.25 acres",
    occupancyRate: "95%",
    propertyManager: "BlockEstate Management",
    heating: "Central HVAC",
    cooling: "Central Air",
    flooring: "Hardwood & Tile",
    appliances: "All Included"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Home className="mr-2 h-5 w-5" />
          Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Property Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Type:</span>
            <Badge variant="secondary">{propertyType}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Built:</span>
            <span className="font-medium">{propertyDetails.yearBuilt}</span>
          </div>
        </div>

        {/* Property Specifications */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Ruler className="mr-2 h-4 w-4" />
            Specifications
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Area:</span>
              <span className="font-medium">{propertyDetails.area}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lot Size:</span>
              <span className="font-medium">{propertyDetails.lotSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Bed className="mr-1 h-3 w-3" />
                Bedrooms:
              </span>
              <span className="font-medium">{propertyDetails.bedrooms}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Bath className="mr-1 h-3 w-3" />
                Bathrooms:
              </span>
              <span className="font-medium">{propertyDetails.bathrooms}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Car className="mr-1 h-3 w-3" />
                Parking:
              </span>
              <span className="font-medium">{propertyDetails.parking} spaces</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occupancy:</span>
              <span className="font-medium text-green-600">{propertyDetails.occupancyRate}</span>
            </div>
          </div>
        </div>

        {/* Property Features */}
        <div>
          <h4 className="font-semibold mb-3">Features & Amenities</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heating:</span>
              <span className="font-medium">{propertyDetails.heating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cooling:</span>
              <span className="font-medium">{propertyDetails.cooling}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flooring:</span>
              <span className="font-medium">{propertyDetails.flooring}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Appliances:</span>
              <span className="font-medium">{propertyDetails.appliances}</span>
            </div>
          </div>
        </div>

        {/* Management Info */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Management
          </h4>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property Manager:</span>
              <span className="font-medium">{propertyDetails.propertyManager}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsCard;
