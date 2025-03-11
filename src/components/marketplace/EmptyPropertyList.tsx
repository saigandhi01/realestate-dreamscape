
import { Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from '@/components/ui/animations';

interface EmptyPropertyListProps {
  onResetFilters: () => void;
}

const EmptyPropertyList = ({ onResetFilters }: EmptyPropertyListProps) => {
  return (
    <RevealOnScroll className="text-center py-16">
      <Building2 className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
      <p className="text-muted-foreground">
        Try adjusting your search or filter criteria
      </p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onResetFilters}
      >
        Reset Filters
      </Button>
    </RevealOnScroll>
  );
};

export default EmptyPropertyList;
