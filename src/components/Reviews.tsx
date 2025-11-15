import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    name: "Sarah Johnson",
    location: "Mumbai",
    rating: 5,
    comment:
      "Absolutely seamless experience! The Tesla Model 3 was spotless and the booking process took less than 5 minutes. Will definitely use again.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    name: "Raj Patel",
    location: "Delhi",
    rating: 5,
    comment:
      "Best car rental service I've used. Transparent pricing, no hidden fees, and the customer support was incredibly helpful when I had questions.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj",
  },
  {
    name: "Emily Chen",
    location: "Bangalore",
    rating: 5,
    comment:
      "The BMW was in perfect condition and made our family trip extra special. The flexible pickup times really helped with our schedule.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
];

const Reviews = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied drivers who trust us for their journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="hover-lift border-2 border-border hover:border-secondary transition-all duration-300"
            >
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-accent mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed">
                  "{review.comment}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-bold text-foreground">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
