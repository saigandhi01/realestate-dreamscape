
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyImage } from "@/hooks/usePropertyData";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";
import PropertyDetailsCard from "./PropertyDetailsCard";

interface PropertyOverviewTabProps {
  propertyName: string;
  propertyLocation: string;
  financials: {
    overview: {
      rentalYield: number;
      annualAppreciation: number;
    };
  };
  propertyImages?: PropertyImage[];
  mainImage?: string;
}

const PropertyOverviewTab = ({ 
  propertyName, 
  propertyLocation, 
  financials,
  propertyImages,
  mainImage
}: PropertyOverviewTabProps) => {
  // Extract property type from name or default to "Single Family"
  const propertyType = propertyName.includes("Multi") ? "Multi-Family" : "Single Family";

  return (
    <div className="space-y-8">
      {/* Property Images and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Image Display */}
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              {propertyImages && propertyImages.length > 0 ? (
                <PropertyImageCarousel images={propertyImages} />
              ) : mainImage ? (
                <img
                  src={mainImage}
                  alt={propertyName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="bg-muted h-64 flex items-center justify-center text-muted-foreground">
                  No property image available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <PropertyDetailsCard 
          propertyName={propertyName}
          propertyLocation={propertyLocation}
          propertyType={propertyType}
        />
      </div>

      {/* Property Description */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Located in the heart of {propertyLocation}, this {propertyType.toLowerCase()} property offers an excellent investment opportunity. The property has been tokenized to provide fractional ownership to investors worldwide.
            </p>
            <p className="text-muted-foreground">
              The property benefits from strong rental demand in the area, with projected annual returns of {financials.overview.rentalYield}% from rental yield alone. Additional returns are expected from property appreciation, which has historically averaged {financials.overview.annualAppreciation}% per year in this neighborhood.
            </p>
            <p className="text-muted-foreground">
              By investing in this property, you receive tokens that represent direct ownership. Rental income is distributed to token holders monthly, in proportion to their ownership stake.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Location Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Prime location with high rental demand</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Close to public transportation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Growing neighborhood with appreciation potential</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Low vacancy rates in the area</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Strong local economy and job market</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary">•</span>
                <span>Access to schools, shopping, and amenities</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyOverviewTab;
