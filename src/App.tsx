
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginModal from "./components/LoginModal";
import Marketplace from "./pages/Marketplace";
import HowItWorks from "./pages/HowItWorks";
import ERCStandards from "./pages/ERCStandards";
import PropertyDetail from "./pages/PropertyDetail";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Router>
            <LoginModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/erc-standards" element={<ERCStandards />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
