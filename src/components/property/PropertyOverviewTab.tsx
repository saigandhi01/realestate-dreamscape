
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyImage } from "@/hooks/usePropertyData";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";
import PropertyDetailsCard from "./PropertyDetailsCard";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield } from "lucide-react";

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

  // Mock contract address and token ID for demonstration
  const contractAddress = "0x742d35Cc6634C0532925a3b8D4321de17b4c8973";
  const tokenId = "12345";
  
  const explorerLinks = [
    {
      name: "Etherscan",
      url: `https://etherscan.io/token/${contractAddress}?a=${tokenId}`,
      icon: ExternalLink
    },
    {
      name: "OpenSea",
      url: `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`,
      icon: ExternalLink
    },
    {
      name: "Rarible",
      url: `https://rarible.com/token/${contractAddress}:${tokenId}`,
      icon: ExternalLink
    },
    {
      name: "LooksRare",
      url: `https://looksrare.org/collections/${contractAddress}/${tokenId}`,
      icon: ExternalLink
    }
  ];

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

      {/* Proof of Authenticity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Proof of Authenticity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This property has been tokenized as an NFT on the Ethereum blockchain. You can verify the authenticity and ownership details on various blockchain explorers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Contract Details</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Contract Address:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                      {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                    </code>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Token ID:</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{tokenId}</code>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Token Standard:</span>
                    <span className="font-medium">ERC-1155</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Blockchain:</span>
                    <span className="font-medium">Ethereum Mainnet</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">View on Explorers</h4>
                <div className="grid grid-cols-1 gap-2">
                  {explorerLinks.map((explorer) => (
                    <Button
                      key={explorer.name}
                      variant="outline"
                      size="sm"
                      className="justify-between"
                      asChild
                    >
                      <a
                        href={explorer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <span>View on {explorer.name}</span>
                        <explorer.icon className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Shield className="inline mr-1 h-4 w-4" />
                <strong>Security Note:</strong> Always verify the contract address matches the official property tokenization contract before making any transactions. This ensures you're interacting with the authentic property NFT.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
