import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Booking",
    items: [
      {
        question: "How do I cancel?",
        answer:
          "You can cancel your booking directly from your account dashboard. Cancellation policies vary by vehicle and rental period. Most bookings offer free cancellation up to 24-48 hours before pickup. Check your specific booking details for the exact policy.",
      },
      {
        question: "Can I modify my booking dates?",
        answer:
          "Yes! You can modify your booking dates from your account dashboard. Simply select the booking you want to change and click 'Modify Booking'. Please note that price changes may apply based on availability and the new dates selected.",
      },
      {
        question: "What happens if I return the car late?",
        answer:
          "Late returns are subject to additional charges. We charge on an hourly basis for the first 3 hours, then a full day rate applies. Please contact us if you need to extend your rental to avoid extra fees.",
      },
    ],
  },
  {
    category: "Pricing",
    items: [
      {
        question: "What is included in the price?",
        answer:
          "The base price includes the vehicle rental, basic insurance coverage, unlimited mileage (for most vehicles), and 24/7 roadside assistance. Taxes and any optional add-ons (GPS, child seats, additional drivers) are shown separately during booking.",
      },
      {
        question: "Do I need to pay a deposit?",
        answer:
          "Yes, a refundable security deposit is required at pickup. The amount varies by vehicle type and is clearly shown during booking. The deposit is typically held on your credit card and released 7-14 days after the vehicle is returned in good condition.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No hidden fees! We believe in transparent pricing. All costs including taxes, fees, and optional add-ons are clearly displayed during the booking process before you confirm. What you see is what you pay.",
      },
      {
        question: "How do promo codes work?",
        answer:
          "Enter your promo code during checkout before payment. The discount will be automatically applied to your total. Most promo codes offer 5-15% off the base rental price. One code per booking. Check your email for exclusive offers!",
      },
    ],
  },
  {
    category: "Requirements",
    items: [
      {
        question: "What documents do I need?",
        answer:
          "You'll need a valid driver's license (held for at least 1 year), a government-issued ID or passport, and a credit card in your name for the security deposit. International renters may need an International Driving Permit (IDP) depending on their country of origin.",
      },
      {
        question: "What is the minimum age to rent?",
        answer:
          "The minimum age to rent is 21 years old for most vehicles. Drivers under 25 may be subject to a young driver surcharge. Premium and luxury vehicles may require drivers to be 25 or older. Age requirements are clearly stated on each vehicle listing.",
      },
    ],
  },
  {
    category: "Vehicle & Insurance",
    items: [
      {
        question: "What insurance is included?",
        answer:
          "Basic insurance coverage is included in all rentals, covering collision damage waiver (CDW) and third-party liability. You can purchase additional coverage options at checkout for extra peace of mind, including zero-deductible insurance and personal accident insurance.",
      },
      {
        question: "What if the car breaks down?",
        answer:
          "All our vehicles come with 24/7 roadside assistance. If you experience any issues, call our emergency hotline immediately. We'll arrange repairs or provide a replacement vehicle at no extra cost if the breakdown is due to mechanical failure.",
      },
      {
        question: "Can I drive across state borders?",
        answer:
          "Yes, you can drive to neighboring states without restrictions. For longer interstate trips, please inform us at the time of booking. Some vehicles may have geographical restrictions which will be clearly stated in the rental agreement.",
      },
    ],
  },
  {
    category: "Fuel & Mileage",
    items: [
      {
        question: "What is the fuel policy?",
        answer:
          "Most rentals operate on a Full-to-Full fuel policy: you receive the car with a full tank and return it full. For electric vehicles, charging is included at our partner charging stations. You'll receive details about nearby charging points at pickup.",
      },
      {
        question: "Is there a mileage limit?",
        answer:
          "Most vehicles come with unlimited mileage. However, some luxury or specialty vehicles may have daily mileage limits, which will be clearly stated on the vehicle page and in your rental agreement. Excess mileage fees apply if limits are exceeded.",
      },
    ],
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    items: category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-6">
              <HelpCircle className="h-10 w-10 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about renting with LuxeDrive
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-muted-foreground">
                  Try different keywords or browse all categories below
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredFaqs.map((category, idx) => (
                  <div key={idx}>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <div className="h-1 w-12 bg-accent rounded-full" />
                      {category.category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.items.map((item, itemIdx) => (
                        <AccordionItem
                          key={itemIdx}
                          value={`${idx}-${itemIdx}`}
                          className="border-2 border-border rounded-xl px-6 hover:border-accent transition-colors"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-6">
                            <span className="text-lg font-semibold text-foreground pr-4">
                              {item.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-r from-primary to-primary-hover rounded-2xl text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg text-white/90 mb-6">
              Our support team is here to help 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+1234567890">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-primary hover:bg-white/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 h-11 px-8">
                  Call us
                </button>
              </a>
              <a href="mailto:hello@luxedrive.com">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-primary shadow-md hover:shadow-lg h-11 px-8">
                  Email support
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
