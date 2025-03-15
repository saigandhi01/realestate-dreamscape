
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyImage } from "@/hooks/usePropertyData";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";

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
  return (
    <div className="space-y-8">
      {/* Property Image Display */}
      <div className="rounded-lg overflow-hidden mb-8">
        {propertyImages && propertyImages.length > 0 ? (
          <PropertyImageCarousel images={propertyImages} />
        ) : mainImage ? (
          <img
            src={mainImage}
            alt={propertyName}
            className="w-full h-auto object-cover rounded-lg"
          />
        ) : (
          <div className="bg-muted h-64 flex items-center justify-center text-muted-foreground">
            No property image available
          </div>
        )}
      </div>

      {/* Property Overview Content - Moved below the image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Property Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Located in the heart of {propertyLocation}, this property offers an excellent investment opportunity. The property has been tokenized to provide fractional ownership to investors worldwide.
            </p>
            <p className="text-muted-foreground mb-4">
              The property benefits from strong rental demand in the area, with projected annual returns of {financials.overview.rentalYield}% from rental yield alone. Additional returns are expected from property appreciation, which has historically averaged {financials.overview.annualAppreciation}% per year in this neighborhood.
            </p>
            <p className="text-muted-foreground">
              By investing in this property, you receive tokens that represent direct ownership. Rental income is distributed to token holders monthly, in proportion to their ownership stake.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-medium">2,500 sq ft</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Year Built</span>
                  <span className="font-medium">2018</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Current Use</span>
                  <span className="font-medium">Residential Rental</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-medium">95%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Property Manager</span>
                  <span className="font-medium">BlockEstate Mgmt</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Prime location with high demand</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Close to public transportation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Growing neighborhood with appreciation potential</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Low vacancy rates in the area</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyOverviewTab;
