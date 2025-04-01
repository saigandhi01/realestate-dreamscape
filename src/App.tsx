
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
import Profile from "./pages/Profile";

// Configure the React Query client with toast error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Handle global query errors - using the correct structure for Tanstack Query v5+
      meta: {
        onError: (error: any) => {
          console.error("Query error:", error);
        },
      },
    },
    mutations: {
      // Handle global mutation errors - using the correct structure for Tanstack Query v5+
      meta: {
        onError: (error: any) => {
          console.error("Mutation error:", error);
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner position="top-right" closeButton />
          <Router>
            <LoginModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/erc-standards" element={<ERCStandards />} />
              <Route path="/profile" element={<Profile />} />
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
