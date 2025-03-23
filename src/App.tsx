import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './contexts/AuthContext';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TravelPreference from "./pages/TravelPreference";
import HolidayPackages from "./pages/HolidayPackages";
import SelfPlanning from "./pages/SelfPlanning";
import PlaceDetails from "./pages/PlaceDetails";
import Itineraries from "./pages/Itineraries";
import ItineraryDetail from "./pages/ItineraryDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/travel-preference" element={<TravelPreference />} />
            <Route path="/holiday-packages" element={<HolidayPackages />} />
            <Route path="/self-planning" element={<SelfPlanning />} />
            <Route path="/place/:placeId" element={<PlaceDetails />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/itinerary/:itineraryId" element={<ItineraryDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
