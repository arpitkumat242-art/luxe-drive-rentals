import { Search, Calendar, Key, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Select",
    description: "Search from thousands of verified vehicles in your area.",
  },
  {
    icon: Calendar,
    title: "Book Your Dates",
    description: "Choose your pickup and return times with flexible options.",
  },
  {
    icon: Key,
    title: "Pick Up & Drive",
    description: "Collect your keys and hit the road — it's that simple.",
  },
  {
    icon: ThumbsUp,
    title: "Return & Review",
    description: "Drop off the car and share your experience with others.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Renting a car has never been easier — four simple steps to get you on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-8 shadow-md hover:shadow-elevated transition-all duration-300 hover:-translate-y-2"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-accent-foreground">{index + 1}</span>
              </div>

              {/* Icon */}
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mt-4">
                <step.icon className="h-8 w-8 text-secondary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
