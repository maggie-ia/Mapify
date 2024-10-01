import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import OptionsSelection from "./pages/OptionsSelection";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import MembershipSelection from "./pages/MembershipSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-white text-[#545454]">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/options" element={<OptionsSelection />} />
              <Route path="/results" element={<Results />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/membership" element={<MembershipSelection />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;