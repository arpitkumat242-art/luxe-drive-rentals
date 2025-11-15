import CarCard from "./CarCard";
import { carsData } from "@/data/cars";

const FeaturedCars = () => {
  const featuredCars = carsData.filter((car) => car.featured);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Popular Cars
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved vehicles — verified, maintained, and ready for your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/listings">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg hover:-translate-y-0.5 h-11 px-8">
              View all cars
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
