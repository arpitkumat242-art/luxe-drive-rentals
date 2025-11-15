import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { carsData } from "@/data/cars";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [transmission, setTransmission] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredCars = carsData
    .filter((car) => {
      if (searchQuery && !car.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedType && car.type !== selectedType) {
        return false;
      }
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        if (car.pricePerDay < min || car.pricePerDay > max) {
          return false;
        }
      }
      if (transmission && car.transmission !== transmission) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse Our Fleet
            </h1>
            <p className="text-lg text-muted-foreground">
              {filteredCars.length} premium vehicles available
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl shadow-lg p-6 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <SlidersHorizontal className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-bold text-foreground">Filters</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Car Type */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-foreground"
              >
                <option value="">All Types</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
                <option value="Luxury">Luxury</option>
                <option value="Hatchback">Hatchback</option>
              </select>

              {/* Price Range */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-foreground"
              >
                <option value="">All Prices</option>
                <option value="0-3000">₹0 - ₹3,000</option>
                <option value="3000-6000">₹3,000 - ₹6,000</option>
                <option value="6000-10000">₹6,000 - ₹10,000</option>
                <option value="10000-999999">₹10,000+</option>
              </select>

              {/* Transmission */}
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-foreground"
              >
                <option value="">All Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-foreground"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedType || priceRange || transmission) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("");
                  setPriceRange("");
                  setTransmission("");
                }}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>

          {/* Results */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No cars match your filters
              </h3>
              <p className="text-muted-foreground mb-6">
                Try broadening your dates or location.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("");
                  setPriceRange("");
                  setTransmission("");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Listings;
