import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Wallet, LogOut, User, UserRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { truncateAddress } from '@/utils/wallet';
import WalletSelectionPopover from '@/components/WalletSelectionPopover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { wallet, disconnect, isLoggedIn, openLoginModal, user } = useAuth();
  
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
  
  useEffect(() => {
    if (isLoggedIn && wallet.address) {
      const fetchProfileImage = async () => {
        try {
          const { data } = await supabase
            .storage
            .from('profile-photos')
            .getPublicUrl(wallet.address.toLowerCase());
          
          if (data?.publicUrl) {
            setProfileUrl(`${data.publicUrl}?t=${Date.now()}`);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };
      
      fetchProfileImage();
    } else {
      setProfileUrl(null);
    }
  }, [isLoggedIn, wallet.address]);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    console.log("Navbar auth state:", { isLoggedIn, user: user?.email, walletAddress: wallet.address });
  }, [isLoggedIn, user, wallet]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace', requiresAuth: true },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'ERC Standards', path: '/erc-standards' },
  ];

  const getUserInitials = () => {
    if (wallet.address) {
      return wallet.address.substring(2, 4).toUpperCase();
    }
    return "U";
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { path: string; requiresAuth?: boolean }) => {
    if (link.requiresAuth && !isLoggedIn) {
      e.preventDefault();
      openLoginModal();
      toast({
        title: "Authentication Required",
        description: "Please log in to access the marketplace.",
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 transition-all duration-300 ${
        isScrolled ? 'py-3 glass shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="font-display text-2xl font-bold text-primary">
            TokenEstate
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`hover-underline font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'text-primary' 
                  : 'text-foreground/70 hover:text-foreground'
              }`}
              onClick={(e) => handleNavLinkClick(e, link)}
            >
              {link.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="p-2 text-primary hover:text-primary/80 transition-colors">
                <UserRound className="h-6 w-6" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-1 gap-2">
                    {profileUrl ? (
                      <Avatar className="h-6 w-6 mr-1">
                        <AvatarImage src={profileUrl} alt="Profile" />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Wallet className="h-4 w-4" />
                    )}
                    {truncateAddress(wallet.address || '')}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2 text-sm font-medium">
                    {wallet.networkName}
                  </div>
                  <div className="p-2 text-sm">
                    Balance: {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnect} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Disconnect</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={openLoginModal} className="ml-2">
                Sign In
              </Button>
              <WalletSelectionPopover />
            </div>
          )}
        </nav>

        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

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
              onClick={(e) => handleNavLinkClick(e, link)}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="flex items-center py-2 font-medium text-primary hover:text-primary/80">
                <UserRound className="mr-2 h-5 w-5" />
                Profile
              </Link>
              <div className="py-2 font-medium">
                <div className="flex items-center gap-2">
                  {profileUrl ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profileUrl} alt="Profile" />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  ) : null}
                  <span>{truncateAddress(wallet.address || '')}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {wallet.networkName} • {wallet.balance ? `${parseFloat(wallet.balance).toFixed(4)} ETH` : '0 ETH'}
                </div>
              </div>
              <Button variant="outline" onClick={disconnect} className="justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={openLoginModal} className="w-full justify-center">
                Sign In
              </Button>
              <WalletSelectionPopover triggerText="Connect Wallet" variant="secondary" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
