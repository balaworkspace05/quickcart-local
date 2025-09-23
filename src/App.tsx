import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Landing from "@/pages/Landing";
import ShopBrowser from "@/pages/ShopBrowser";
import ProductListing from "@/pages/ProductListing";
import OrderTracking from "@/pages/OrderTracking";
import ShopkeeperDashboard from "@/pages/ShopkeeperDashboard";
import DeliveryDashboard from "@/pages/DeliveryDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/shops" element={<ShopBrowser />} />
            <Route path="/shop/:shopId" element={<ProductListing />} />
            <Route path="/orders" element={<OrderTracking />} />
            <Route path="/dashboard" element={<ShopkeeperDashboard />} />
            <Route path="/inventory" element={<ShopkeeperDashboard />} />
            <Route path="/analytics" element={<ShopkeeperDashboard />} />
            <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
            <Route path="/routes" element={<DeliveryDashboard />} />
            <Route path="/earnings" element={<DeliveryDashboard />} />
            <Route path="/feedback" element={<OrderTracking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
