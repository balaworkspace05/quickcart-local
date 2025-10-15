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
import Landing from "@/pages/Landing";
import ShopBrowser from "@/pages/ShopBrowser";
import ProductListing from "@/pages/ProductListing";
import OrderTracking from "@/pages/OrderTracking";
import ShopkeeperDashboard from "@/pages/ShopkeeperDashboard";
import DeliveryDashboard from "@/pages/DeliveryDashboard";
import LoyaltyRewards from "@/pages/LoyaltyRewards";
import Cart from "@/pages/Cart";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/shops" element={<ShopBrowser />} />
                  <Route path="/shop/:shopId" element={<ProductListing />} />
                  <Route 
                    path="/cart" 
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/orders" 
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/loyalty" 
                    element={
                      <ProtectedRoute>
                        <LoyaltyRewards />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requireRole="shopkeeper">
                        <ShopkeeperDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory" 
                    element={
                      <ProtectedRoute requireRole="shopkeeper">
                        <ShopkeeperDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute requireRole="shopkeeper">
                        <ShopkeeperDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/delivery-dashboard" 
                    element={
                      <ProtectedRoute requireRole="delivery">
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/routes" 
                    element={
                      <ProtectedRoute requireRole="delivery">
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/earnings" 
                    element={
                      <ProtectedRoute requireRole="delivery">
                        <DeliveryDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/feedback" element={<OrderTracking />} />
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
