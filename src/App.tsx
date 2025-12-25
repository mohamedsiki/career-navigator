import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";

import Dashboard from "./pages/Dashboard"; // page statistiques
import Visit from "./pages/visit";      // si tu sépares plus tard
import Index from "./pages/Index";
import CandidatesList from "./pages/CandidatesList";
import NewCandidate from "./pages/NewCandidate";
import EditCandidate from "./pages/EditCandidate";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Redirection principale */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/*  Dashboard statistiques */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Visit / gestion */}
              <Route path="/visit" element={<Visit />} />

              {/* Autres pages */}
              <Route path="/index" element={<Index />} />
              <Route path="/candidats" element={<CandidatesList />} />
              <Route path="/nouveau" element={<NewCandidate />} />
              <Route path="/modifier/:id" element={<EditCandidate />} />
              <Route path="/profile" element={<Profile />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
