
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useContactGoals from "@/hooks/use-contact-goals";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import SeoIndex from "./pages/SeoIndex";
import SeoLanding from "./pages/SeoLanding";
import Blog from "./pages/Blog";
import PartnersPage from "./pages/Partners";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useContactGoals();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/uslugi" element={<SeoIndex kind="service" />} />
          <Route path="/uslugi/:slug" element={<SeoLanding />} />
          <Route path="/goroda" element={<SeoIndex kind="city" />} />
          <Route path="/goroda/:slug" element={<SeoLanding />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/partnery" element={<PartnersPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;