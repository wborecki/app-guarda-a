import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardCarouselProps {
  photos: string[];
  name: string;
}

const CardCarousel = ({ photos, name }: CardCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback((e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback((e: React.MouseEvent) => { e.stopPropagation(); emblaApi?.scrollNext(); }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative group h-full">
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {photos.map((photo, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 h-full">
              <img src={photo} alt={`${name} – ângulo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
      <button onClick={scrollPrev} className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" aria-label="Foto anterior">
        <ChevronLeft size={14} className="text-foreground" />
      </button>
      <button onClick={scrollNext} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" aria-label="Próxima foto">
        <ChevronRight size={14} className="text-foreground" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {photos.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? "bg-background w-3" : "bg-background/50 w-1.5"}`} />
        ))}
      </div>
    </div>
  );
};

export default CardCarousel;
