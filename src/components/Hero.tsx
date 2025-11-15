import { useState } from "react";
import { Search, MapPin, Calendar, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage1 from "@/assets/hero-1.jpg";
import heroImage2 from "@/assets/hero-2.jpg";
import heroImage3 from "@/assets/hero-3.jpg";

const Hero = () => {
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carType, setCarType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to listings page with filters
    window.location.href = "/listings";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-background/90 z-10" />
        <img
          src={heroImage1}
          alt="Luxury car on coastal highway"
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            Rent premium cars, on your terms.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Flexible pick-up, transparent pricing, and verified vehicles — ready when you are.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-card rounded-2xl shadow-elevated p-6 md:p-8 animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="City or airport"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Pickup Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Pickup Date
                </label>
                <Input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Return Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Return Date
                </label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Car Type */}
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Car className="inline h-4 w-4 mr-1" />
                  Car Type
                </label>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">All types</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="luxury">Luxury</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
            </div>

            <Button variant="accent" size="lg" type="submit" className="w-full md:w-auto px-12">
              <Search className="mr-2 h-5 w-5" />
              Find a car
            </Button>
          </form>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">5,000+</div>
              <div className="text-sm">Premium Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50+</div>
              <div className="text-sm">Cities Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.9/5</div>
              <div className="text-sm">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
