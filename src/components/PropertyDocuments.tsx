
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Shield, Calculator, FileCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DemoTransactionService } from '@/utils/contracts/DemoTransactionService';

interface Document {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  icon: React.ComponentType<{ className?: string }>;
  propertyName: string;
}

const PropertyDocuments: React.FC = () => {
  const { wallet } = useAuth();

  // Get demo portfolio to generate documents for owned properties
  const demoPortfolio = wallet.walletType === 'demo' ? DemoTransactionService.getDemoPortfolio() : [];

  // Generate documents for each owned property
  const generateDocuments = (): Document[] => {
    const documents: Document[] = [];
    
    demoPortfolio.forEach((property: any, index: number) => {
      const baseId = `${property.id || property.propertyId}-`;
      
      documents.push(
        {
          id: `${baseId}deed`,
          name: `Property Deed - ${property.propertyName}`,
          description: 'Legal ownership document and title deed',
          type: 'PDF',
          size: '2.1 MB',
          icon: FileCheck,
          propertyName: property.propertyName
        },
        {
          id: `${baseId}financial`,
          name: `Financial Report - ${property.propertyName}`,
          description: 'Detailed financial performance and projections',
          type: 'PDF',
          size: '1.8 MB',
          icon: Calculator,
          propertyName: property.propertyName
        },
        {
          id: `${baseId}legal`,
          name: `Legal Compliance - ${property.propertyName}`,
          description: 'Legal compliance certificates and permits',
          type: 'PDF',
          size: '945 KB',
          icon: Shield,
          propertyName: property.propertyName
        },
        {
          id: `${baseId}token`,
          name: `Token Certificate - ${property.propertyName}`,
          description: 'Blockchain token ownership certificate',
          type: 'PDF',
          size: '512 KB',
          icon: FileText,
          propertyName: property.propertyName
        }
      );
    });

    return documents;
  };

  const documents = generateDocuments();

  const handleDownload = (docId: string) => {
    console.log(`Downloading document: ${docId}`);
    // In a real implementation, this would trigger an actual download
    alert(`Demo: Downloading document ${docId}`);
  };

  if (wallet.walletType !== 'demo') {
    return (
      <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Property Documents</CardTitle>
          <CardDescription>Access your property documents and certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Property documents will appear here after making investments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Property Documents
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">DEMO</span>
        </CardTitle>
        <CardDescription>
          Download legal and financial documents for your demo properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No property documents found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Purchase demo properties to see their documents here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Group documents by property */}
            {demoPortfolio.map((property: any) => {
              const propertyDocs = documents.filter(doc => doc.propertyName === property.propertyName);
              
              return (
                <div key={property.id || property.propertyId} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-lg">{property.propertyName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {propertyDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="mr-3 p-2 bg-primary/10 rounded-lg">
                          <doc.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium mb-1 text-sm">{doc.name}</h5>
                          <p className="text-xs text-muted-foreground mb-2">{doc.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{doc.type} • {doc.size}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center h-7 text-xs"
                              onClick={() => handleDownload(doc.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyDocuments;
