
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, LucideIcon } from "lucide-react";

interface Document {
  id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  icon: LucideIcon;
}

interface PropertyDocumentsTabProps {
  documents: Document[];
  onDownload: (docId: string) => void;
}

const PropertyDocumentsTab = ({ documents, onDownload }: PropertyDocumentsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Documents</CardTitle>
        <CardDescription>Download legal and financial documents related to this property</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                <doc.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">{doc.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{doc.type} • {doc.size}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                    onClick={() => onDownload(doc.id)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDocumentsTab;
