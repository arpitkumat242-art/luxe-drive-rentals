import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { carsData } from "@/data/cars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  Luggage,
  Settings,
  MapPin,
  Shield,
  CheckCircle,
  Calendar,
  ChevronLeft,
} from "lucide-react";

const CarDetail = () => {
  const { id } = useParams();
  const car = carsData.find((c) => c.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [days, setDays] = useState(3);

  if (!car) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Car Not Found</h1>
          <Link to="/listings">
            <Button variant="accent">Back to Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [car.image, car.image, car.image]; // In real app, would have multiple images
  const totalPrice = car.pricePerDay * days;
  const taxes = totalPrice * 0.18;
  const finalPrice = totalPrice + taxes;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/listings" className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="h-5 w-5" />
            Back to listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
                  <img
                    src={images[selectedImage]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  {car.featured && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-accent scale-95"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <img src={img} alt={`${car.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Car Info */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-4xl font-bold text-foreground mb-2">{car.name}</h1>
                      <p className="text-xl text-muted-foreground">{car.type}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 rounded-lg">
                      <Star className="h-5 w-5 text-accent fill-accent" />
                      <span className="text-lg font-semibold">{car.rating}</span>
                      <span className="text-muted-foreground">({car.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-muted rounded-xl">
                    <div className="text-center">
                      <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <div className="font-semibold">{car.seats} Seats</div>
                    </div>
                    <div className="text-center">
                      <Luggage className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <div className="font-semibold">{car.luggage} Bags</div>
                    </div>
                    <div className="text-center">
                      <Settings className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <div className="font-semibold">{car.transmission}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {car.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Policies */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-secondary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Fuel Policy</h4>
                        <p className="text-muted-foreground">{car.fuelPolicy}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-secondary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Cancellation Policy</h4>
                        <p className="text-muted-foreground">{car.cancellationPolicy}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-secondary/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Pickup & Drop-off</h4>
                        <p className="text-muted-foreground">Available at all major locations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <Card className="sticky top-32 border-2 border-accent/20">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-foreground mb-1">
                      ₹{car.pricePerDay.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">per day</div>
                  </div>

                  {/* Price Calculator */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of days</label>
                      <input
                        type="number"
                        min="1"
                        value={days}
                        onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                      />
                    </div>

                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>₹{car.pricePerDay.toLocaleString()} × {days} days</span>
                        <span>₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes (18%)</span>
                        <span>₹{taxes.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-accent">₹{Math.round(finalPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="accent" size="lg" className="w-full mb-3">
                    Book now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to compare
                  </Button>

                  <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
                    <p>✓ Instant confirmation</p>
                    <p>✓ Free cancellation</p>
                    <p>✓ 24/7 customer support</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarDetail;
