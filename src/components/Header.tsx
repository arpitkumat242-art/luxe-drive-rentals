import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Menu, X, Phone, Mail, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { BookingModal } from "@/components/BookingModal";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Browse Cars" },
    { to: "/account", label: "My Account" },
    { to: "/faq", label: "FAQ" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-accent p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Car className="h-6 w-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LuxeDrive</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-foreground/80 hover:text-foreground transition-colors link-underline"
                activeClassName="text-foreground font-semibold"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className={`flex items-center gap-4 mr-4 text-sm transition-colors ${
              isScrolled ? "text-muted-foreground" : "text-white"
            }`}>
              <a href="tel:+1234567890" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                <span>+1 (234) 567-890</span>
              </a>
              <a href="mailto:hello@luxedrive.com" className="flex items-center gap-1 hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                <span>hello@luxedrive.com</span>
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="accent" size="sm" onClick={() => setIsBookingModalOpen(true)}>
              Book now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-6 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-foreground/80 hover:text-foreground transition-colors py-2"
                  activeClassName="text-foreground font-semibold"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+1 (234) 567-890</span>
                </a>
                <a href="mailto:hello@luxedrive.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <Mail className="h-4 w-4" />
                  <span>hello@luxedrive.com</span>
                </a>
              </div>
              <Button variant="accent" className="w-full mt-2" onClick={() => setIsBookingModalOpen(true)}>
                Book now
              </Button>
            </div>
          </nav>
        )}
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        car={null}
      />
    </header>
  );
};

export default Header;
