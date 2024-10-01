import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import OperationSelection from "./pages/OperationSelection";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import MembershipSelection from "./pages/MembershipSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router>
            <div className="min-h-screen bg-secondary text-primary">
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/operations" element={<OperationSelection />} />
                <Route path="/results" element={<Results />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/membership" element={<MembershipSelection />} />
              </Routes>
            </div>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;