import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import Landing from "@/pages/Landing";
import Market from "@/pages/Market";
import ShopBrowser from "@/pages/ShopBrowser";
import ProductListing from "@/pages/ProductListing";
import OrderTracking from "@/pages/OrderTracking";
import ShopkeeperDashboard from "@/pages/ShopkeeperDashboard";
import VendorDashboard from "@/pages/VendorDashboard";
import DeliveryDashboard from "@/pages/DeliveryDashboard";
import LoyaltyRewards from "@/pages/LoyaltyRewards";
import Cart from "@/pages/Cart";
import AuthNew from "@/pages/AuthNew";

import Profile from "@/pages/Profile";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Help from "@/pages/Help";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerFeedback from "./pages/CustomerFeedback";
import VendorProfile from "./pages/VendorProfile";
import VendorInventory from "./pages/VendorInventory";
import VendorOrders from "./pages/VendorOrders";
import VendorFeedback from "./pages/VendorFeedback";
import VendorWork from "./pages/VendorWork";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background font-body">
              <AnimatedBackground />
              <Navigation />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<AuthNew />} />
          <Route path="/shops" element={<ShopBrowser />} />
          <Route path="/market" element={<Market />} />
                  <Route path="/shop/:shopId" element={<ProductListing />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<OrderTracking />} />
                  <Route path="/loyalty" element={<LoyaltyRewards />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<ShopkeeperDashboard />} />
                  <Route path="/inventory" element={<ShopkeeperDashboard />} />
                  <Route path="/analytics" element={<ShopkeeperDashboard />} />
                  <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
                  <Route path="/routes" element={<DeliveryDashboard />} />
                  <Route path="/earnings" element={<DeliveryDashboard />} />
                  <Route path="/feedback" element={<OrderTracking />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/customer/profile" element={<CustomerProfile />} />
                  <Route path="/customer/feedback" element={<CustomerFeedback />} />
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="/vendor/inventory" element={<VendorInventory />} />
                  <Route path="/vendor/orders" element={<VendorOrders />} />
                  <Route path="/vendor/feedback" element={<VendorFeedback />} />
                  <Route path="/vendor/work" element={<VendorWork />} />
                  <Route path="/vendor/profile" element={<VendorProfile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
