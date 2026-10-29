import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from "./components/RequireAuth";
import AccountMenu from "./components/AccountMenu";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const TravelPreference = lazy(() => import("./pages/TravelPreference"));
const HolidayPackages = lazy(() => import("./pages/HolidayPackages"));
const SelfPlanning = lazy(() => import("./pages/SelfPlanning"));
const PlaceDetails = lazy(() => import("./pages/PlaceDetails"));
const Itineraries = lazy(() => import("./pages/Itineraries"));
const ItineraryDetail = lazy(() => import("./pages/ItineraryDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AccountMenu />
          <Suspense fallback={
            <div role="status" className="flex min-h-screen items-center justify-center bg-vander-light text-sm font-medium text-vander-teal">
              Loading your page...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/travel-preference" element={<RequireAuth><TravelPreference /></RequireAuth>} />
              <Route path="/holiday-packages" element={<HolidayPackages />} />
              <Route path="/self-planning" element={<RequireAuth><SelfPlanning /></RequireAuth>} />
              <Route path="/place/:placeId" element={<PlaceDetails />} />
              <Route path="/itineraries" element={<RequireAuth><Itineraries /></RequireAuth>} />
              <Route path="/itinerary/:itineraryId" element={<RequireAuth><ItineraryDetail /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><ProfileSettings /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
