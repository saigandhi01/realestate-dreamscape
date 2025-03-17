
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PropertyImage } from "@/hooks/usePropertyData";
import { Badge } from "@/components/ui/badge";

interface PropertyImageCarouselProps {
  images: PropertyImage[];
}

const PropertyImageCarousel = ({ images }: PropertyImageCarouselProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  console.log("PropertyImageCarousel images:", images);

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem key={image.id}>
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded-lg"
                />
              </AspectRatio>
              <Badge 
                className="absolute bottom-4 left-4 capitalize"
                variant="secondary"
              >
                {image.type} View
              </Badge>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};

export default PropertyImageCarousel;
