import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage3 from "@/assets/hero-3.jpg";

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70 z-10" />
        <img
          src={heroImage3}
          alt="Sports car on mountain road"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Ready to Hit the Road?
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Book your dream car today and experience the freedom of the open road.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/listings">
            <Button variant="accent" size="lg" className="text-lg px-12">
              Find a car
            </Button>
          </Link>
          <Link to="/faq">
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-12 bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white hover:text-primary"
            >
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
