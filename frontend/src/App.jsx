import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import OperationSelection from "./pages/OperationSelection";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import MembershipSelection from "./pages/MembershipSelection";
import Register from "./components/Register";
import Login from "./components/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-secondary text-primary">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/operations" element={<OperationSelection />} />
                <Route path="/results" element={<Results />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/membership" element={<MembershipSelection />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;