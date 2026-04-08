import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ItemProvider } from "./contexts/ItemContext";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import Emergency from "./pages/Emergency";
import Medical from "./pages/Medical";
import Matches from "./pages/Matches";
import Rewards from "./pages/Rewards";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ItemProvider>
          <NotificationProvider>
            <ChatProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/lost-items" element={<LostItems />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/medical" element={<Medical />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ChatProvider>
          </NotificationProvider>
        </ItemProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
