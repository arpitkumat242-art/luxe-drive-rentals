import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

const addOns: AddOn[] = [
  { id: "gps", name: "GPS Navigation", price: 500, description: "Never get lost with turn-by-turn directions" },
  { id: "childSeat", name: "Child Seat", price: 300, description: "Safety-certified seat for children" },
  { id: "extraDriver", name: "Extra Driver", price: 800, description: "Add an additional authorized driver" },
  { id: "insurance", name: "Premium Insurance", price: 1200, description: "Full coverage with zero excess" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM"
];

export const BookingModal = ({ isOpen, onClose, car }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropoffTime, setDropoffTime] = useState("10:00 AM");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleClose = () => {
    setStep(1);
    setPickupDate(undefined);
    setDropoffDate(undefined);
    setPickupLocation("");
    setDropoffLocation("");
    setSelectedAddOns([]);
    setPromoCode("");
    setPromoApplied(false);
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setIsConfirmed(false);
    onClose();
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
      toast.success("Promo code applied! 10% discount added.");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const calculateDays = () => {
    if (!pickupDate || !dropoffDate) return 1;
    const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotal = () => {
    if (!car) return { subtotal: 0, addOnsTotal: 0, discount: 0, taxes: 0, total: 0, deposit: 0 };
    
    const days = calculateDays();
    const subtotal = car.pricePerDay * days;
    const addOnsTotal = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return sum + (addOn?.price || 0) * days;
    }, 0);
    
    const beforeDiscount = subtotal + addOnsTotal;
    const discount = promoApplied ? beforeDiscount * 0.1 : 0;
    const afterDiscount = beforeDiscount - discount;
    const taxes = afterDiscount * 0.18; // 18% tax
    const total = afterDiscount + taxes;
    const deposit = total * 0.2; // 20% deposit
    
    return { subtotal, addOnsTotal, discount, taxes, total, deposit };
  };

  const canProceedStep1 = pickupDate && dropoffDate && pickupLocation && dropoffLocation;
  const canProceedStep3 = contactName && contactEmail && contactPhone;

  const handleConfirmBooking = () => {
    setIsConfirmed(true);
    setStep(5);
  };

  const pricing = calculateTotal();

  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isConfirmed ? "Booking Confirmed!" : `Book ${car.name}`}
          </DialogTitle>
        </DialogHeader>

        {!isConfirmed && (
          <>
            {/* Stepper */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    step >= s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {step > s ? <Check className="h-5 w-5" /> : s}
                  </div>
                  {s < 4 && (
                    <div className={cn(
                      "h-1 flex-1 mx-2 transition-all",
                      step > s ? "bg-accent" : "bg-muted"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Date Selection */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-xl font-semibold">Select Dates & Location</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pickup Date */}
                    <div className="space-y-2">
                      <Label>Pickup Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {pickupDate ? format(pickupDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Dropoff Date */}
                    <div className="space-y-2">
                      <Label>Dropoff Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dropoffDate ? format(dropoffDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dropoffDate}
                            onSelect={setDropoffDate}
                            disabled={(date) => date < new Date() || (pickupDate && date <= pickupDate)}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Pickup Time */}
                    <div className="space-y-2">
                      <Label>Pickup Time</Label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dropoff Time */}
                    <div className="space-y-2">
                      <Label>Dropoff Time</Label>
                      <select
                        value={dropoffTime}
                        onChange={(e) => setDropoffTime(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    {/* Pickup Location */}
                    <div className="space-y-2">
                      <Label>Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter pickup address"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Dropoff Location */}
                    <div className="space-y-2">
                      <Label>Dropoff Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter dropoff address"
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button 
                      variant="accent" 
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Add-ons */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-xl font-semibold">Choose Add-ons</h3>
                  
                  <div className="space-y-4">
                    {addOns.map((addOn) => (
                      <div
                        key={addOn.id}
                        className={cn(
                          "border rounded-xl p-4 cursor-pointer transition-all hover:border-accent",
                          selectedAddOns.includes(addOn.id) && "border-accent bg-accent/5"
                        )}
                        onClick={() => toggleAddOn(addOn.id)}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedAddOns.includes(addOn.id)}
                            onCheckedChange={() => toggleAddOn(addOn.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{addOn.name}</h4>
                              <span className="text-lg font-semibold">₹{addOn.price}/day</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button variant="accent" onClick={() => setStep(3)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Price Review */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-xl font-semibold">Review & Apply Promo</h3>
                  
                  {/* Booking Summary */}
                  <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <img src={car.image} alt={car.name} className="w-24 h-16 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-semibold">{car.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Car rental ({calculateDays()} days @ ₹{car.pricePerDay})</span>
                        <span>₹{pricing.subtotal.toLocaleString()}</span>
                      </div>
                      
                      {selectedAddOns.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Add-ons ({calculateDays()} days)</span>
                          <span>₹{pricing.addOnsTotal.toLocaleString()}</span>
                        </div>
                      )}

                      {promoApplied && (
                        <div className="flex justify-between text-sm text-secondary">
                          <span>Discount (WELCOME10)</span>
                          <span>-₹{pricing.discount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span>Taxes (18%)</span>
                        <span>₹{pricing.taxes.toLocaleString()}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-accent">₹{pricing.total.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Deposit (20%)</span>
                        <span>₹{pricing.deposit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <Label>Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                      />
                      <Button
                        variant={promoApplied ? "secondary" : "outline"}
                        onClick={applyPromo}
                        disabled={promoApplied || !promoCode}
                      >
                        {promoApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Try: WELCOME10 for 10% off</p>
                  </div>

                  <div className="flex justify-between gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button variant="accent" onClick={() => setStep(4)}>Continue to Checkout</Button>
                  </div>
                </div>
              )}

              {/* Step 4: Checkout */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-xl font-semibold">Contact & Payment</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        placeholder="Enter your full name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>

                    <Separator />

                    {/* Payment Simulation */}
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                      <h4 className="font-semibold">Payment Details (Demo)</h4>
                      <p className="text-sm text-muted-foreground">
                        This is a simulation. No actual payment will be processed.
                      </p>
                      
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="4242 4242 4242 4242" disabled />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry</Label>
                          <Input placeholder="MM/YY" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV</Label>
                          <Input placeholder="123" disabled />
                        </div>
                      </div>

                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm">
                        <p className="font-semibold">Amount to pay now: ₹{pricing.deposit.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Remaining ₹{(pricing.total - pricing.deposit).toLocaleString()} due at pickup
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-3 pt-4">
                    <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                    <Button
                      variant="accent"
                      onClick={handleConfirmBooking}
                      disabled={!canProceedStep3}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Confirmation Screen */}
        {isConfirmed && (
          <div className="text-center py-8 space-y-6 animate-scale-in">
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-secondary" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground">
                Check your email for details — safe travels.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-semibold">LXD{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Car</span>
                <span className="font-semibold">{car.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold">{calculateDays()} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-semibold text-accent">₹{pricing.deposit.toLocaleString()}</span>
              </div>
            </div>

            <Button variant="accent" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
