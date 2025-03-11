
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, GitHub, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-background border-t border-border py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-bold font-display text-primary">TokenEstate</span>
          </Link>
          <p className="mt-4 text-muted-foreground">
            Revolutionizing real estate investments through blockchain technology and tokenization.
          </p>
          <div className="flex mt-6 space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
              <GitHub size={20} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Platform</h3>
          <ul className="space-y-3">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/marketplace" className="text-muted-foreground hover:text-primary transition-colors">Marketplace</Link></li>
            <li><Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
            <li><Link to="/erc-standards" className="text-muted-foreground hover:text-primary transition-colors">ERC Standards</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Whitepaper</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Compliance</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} TokenEstate. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            Powered by Ethereum Blockchain
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
