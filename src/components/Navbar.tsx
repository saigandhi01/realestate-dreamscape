
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'ERC Standards', path: '/erc-standards' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 transition-all duration-300 ${
        isScrolled ? 'py-3 glass shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-display text-2xl font-bold text-primary">
            TokenEstate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`hover-underline font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'text-primary' 
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button className="ml-4 button-hover">Connect Wallet</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-background shadow-md transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-10px] opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col py-4 px-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`py-2 font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'text-primary' 
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button className="mt-2 w-full">Connect Wallet</Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
