
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PropertyImage } from "@/hooks/usePropertyData";
import { Badge } from "@/components/ui/badge";

interface PropertyImageCarouselProps {
  images: PropertyImage[];
}

const PropertyImageCarousel = ({ images }: PropertyImageCarouselProps) => {
  // This component is kept for reference but will no longer be used
  // in the PropertyOverviewTab component
  if (!images || images.length === 0) {
    return null;
  }

  return null; // Component is effectively disabled
};

export default PropertyImageCarousel;
