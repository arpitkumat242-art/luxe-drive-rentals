import { Car, Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay in the Loop</h3>
            <p className="text-primary-foreground/80 mb-6">
              Get exclusive deals, travel tips, and updates straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="accent" type="submit">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent p-2 rounded-lg">
                <Car className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">LuxeDrive</span>
            </div>
            <p className="text-primary-foreground/70 mb-4">
              Premium cars — zero surprises.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-primary-foreground/10 hover:bg-accent transition-colors p-2 rounded-lg"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-primary-foreground/10 hover:bg-accent transition-colors p-2 rounded-lg"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-primary-foreground/10 hover:bg-accent transition-colors p-2 rounded-lg"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-primary-foreground/10 hover:bg-accent transition-colors p-2 rounded-lg"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="hover:text-accent transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-accent transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Insurance Info
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 LuxeDrive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
