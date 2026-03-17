import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppPage from "./pages/AppPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import FraudQuiz from "./pages/FraudDetection";
import CreditScore from "./pages/Credit";
import NRIBankingPage from "./pages/nri";
import KYCPage from "./pages/Kyc";
import KycVideo from "./pages/kycvideo";
import Twilio from "./pages/twillo";
import Transaction from "./pages/Transactions";
import Chatbot from "./pages/chatbot";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fraud-detection" element={<FraudQuiz />} />
          <Route path="/nri" element={<NRIBankingPage />} />
          <Route path="/credit" element={<CreditScore />} />
          <Route path="/kyc" element={<KYCPage />} />
          <Route path="/kyc/video" element={<KycVideo />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/twilio" element={<Twilio />} />
          <Route path="/chat" element={<Chatbot />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
