
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useContactGoals from "@/hooks/use-contact-goals";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";

const Privacy = lazy(() => import("./pages/Privacy"));
const SeoIndex = lazy(() => import("./pages/SeoIndex"));
const SeoLanding = lazy(() => import("./pages/SeoLanding"));
const Blog = lazy(() => import("./pages/Blog"));
const PartnersPage = lazy(() => import("./pages/Partners"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Calculators = lazy(() => import("./pages/Calculators"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const Checklists = lazy(() => import("./pages/Checklists"));
const ChecklistPage = lazy(() => import("./pages/ChecklistPage"));
const Read = lazy(() => import("./pages/Read"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
          <Route path="/test" element={<Quiz />} />
          <Route path="/kalkulyatory" element={<Calculators />} />
          <Route path="/kalkulyatory/:slug" element={<CalculatorPage />} />
          <Route path="/chek-listy" element={<Checklists />} />
          <Route path="/chek-listy/:slug" element={<ChecklistPage />} />
          <Route path="/pochitat" element={<Read />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;