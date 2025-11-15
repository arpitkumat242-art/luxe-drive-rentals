import { useState } from "react";
import { Star, Users, Luggage, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookingModal } from "@/components/BookingModal";

interface CarCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  seats: number;
  luggage: number;
  transmission: string;
  featured?: boolean;
}

const CarCard = ({
  id,
  name,
  type,
  image,
  rating,
  reviews,
  pricePerDay,
  seats,
  luggage,
  transmission,
  featured = false,
}: CarCardProps) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
    <Card className="group hover-lift overflow-hidden border-2 border-border hover:border-primary transition-all duration-300">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {featured && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              Featured
            </Badge>
          )}
          {/* Quick Book Overlay */}
          <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button variant="accent" size="lg" onClick={() => setIsBookingModalOpen(true)}>
              Book now
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{type}</p>
            </div>
            <div className="flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span className="font-semibold text-foreground">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">{seats}</span>
            </div>
            <div className="flex items-center gap-1">
              <Luggage className="h-4 w-4" />
              <span className="text-sm">{luggage}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span className="text-sm">{transmission}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <div className="text-2xl font-bold text-foreground">
                ₹{pricePerDay.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">per day</div>
            </div>
            <Link to={`/car/${id}`}>
              <Button variant="outline" size="sm">
                Check availability
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>

    <BookingModal
      isOpen={isBookingModalOpen}
      onClose={() => setIsBookingModalOpen(false)}
      car={{
        id,
        name,
        pricePerDay,
        image
      }}
    />
    </>
  );
};

export default CarCard;
