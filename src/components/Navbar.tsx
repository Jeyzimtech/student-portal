import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "School Life", href: "#school-life" },
    { label: "Admissions", href: "#admissions" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-extrabold text-xl text-foreground">CABS Primary</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link to="/student-login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Student Portal
            </Button>
          </Link>
          <Link to="/admin-login">
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Admin Login
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-border p-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/student-login" onClick={() => setIsOpen(false)}>
            <Button size="sm" className="w-full bg-primary text-primary-foreground">Student Portal</Button>
          </Link>
          <Link to="/admin-login" onClick={() => setIsOpen(false)}>
            <Button size="sm" variant="outline" className="w-full border-primary text-primary">Admin Login</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
