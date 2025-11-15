import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Car, Clock, Download, MapPin } from "lucide-react";

const mockBookings = [
  {
    id: "BK001",
    car: "Tesla Model 3",
    type: "Sedan",
    status: "upcoming",
    pickupDate: "2025-12-01",
    returnDate: "2025-12-05",
    location: "Mumbai Airport",
    price: 26000,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop",
  },
  {
    id: "BK002",
    car: "BMW 5 Series",
    type: "Luxury",
    status: "past",
    pickupDate: "2025-10-15",
    returnDate: "2025-10-18",
    location: "Delhi",
    price: 36000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
  },
  {
    id: "BK003",
    car: "Hyundai Creta",
    type: "SUV",
    status: "past",
    pickupDate: "2025-09-20",
    returnDate: "2025-09-23",
    location: "Bangalore",
    price: 9600,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
  },
];

const Account = () => {
  const upcomingBookings = mockBookings.filter((b) => b.status === "upcoming");
  const pastBookings = mockBookings.filter((b) => b.status === "past");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              My Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your bookings and view your rental history
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-12 border-2 border-accent/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-accent">JD</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">John Doe</h2>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                  <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Upcoming Bookings
            </h2>
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground mb-6">
                    Ready to plan your next adventure?
                  </p>
                  <a href="/listings">
                    <Button variant="accent">Browse cars</Button>
                  </a>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {upcomingBookings.map((booking) => (
                  <Card key={booking.id} className="hover-lift">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                        {/* Image */}
                        <div className="aspect-video md:aspect-square overflow-hidden">
                          <img
                            src={booking.image}
                            alt={booking.car}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="md:col-span-2 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground mb-1">
                                {booking.car}
                              </h3>
                              <p className="text-muted-foreground">{booking.type}</p>
                            </div>
                            <Badge className="bg-secondary text-secondary-foreground">
                              Upcoming
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(booking.pickupDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}{" "}
                                -{" "}
                                {new Date(booking.returnDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Booking ID: {booking.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 bg-muted/50 flex flex-col justify-between">
                          <div className="mb-4">
                            <div className="text-3xl font-bold text-foreground mb-1">
                              ₹{booking.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Total paid</div>
                          </div>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full" size="sm">
                              View details
                            </Button>
                            <Button variant="ghost" className="w-full" size="sm">
                              Cancel booking
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Past Bookings</h2>
            <div className="space-y-6">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                      {/* Image */}
                      <div className="aspect-video md:aspect-square overflow-hidden grayscale hover:grayscale-0 transition-all">
                        <img
                          src={booking.image}
                          alt={booking.car}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-1">
                              {booking.car}
                            </h3>
                            <p className="text-muted-foreground">{booking.type}</p>
                          </div>
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            Completed
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(booking.pickupDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              -{" "}
                              {new Date(booking.returnDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-6 bg-muted/50 flex flex-col justify-between">
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-foreground mb-1">
                            ₹{booking.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Total paid</div>
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                          <Button variant="ghost" className="w-full" size="sm">
                            Book again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
