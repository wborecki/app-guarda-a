import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import HostLanding from "./pages/HostLanding";
import SpaceOnboarding from "./pages/SpaceOnboarding";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import SearchResults from "./pages/SearchResults";
import SpaceDetails from "./pages/SpaceDetails";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import TermsRenter from "./pages/TermsRenter";
import TermsHost from "./pages/TermsHost";
import ProhibitedItems from "./pages/ProhibitedItems";
import Contact from "./pages/Contact";
import QueroGuardar from "./pages/QueroGuardar";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardReservas from "./pages/dashboard/DashboardReservas";
import DashboardEspacos from "./pages/dashboard/DashboardEspacos";
import DashboardAgenda from "./pages/dashboard/DashboardAgenda";
import DashboardMensagens from "./pages/dashboard/DashboardMensagens";
import DashboardFinanceiro from "./pages/dashboard/DashboardFinanceiro";
import DashboardPerfil from "./pages/dashboard/DashboardPerfil";
import { AuthProvider } from "./hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import FloatingChat from "./components/guardaai/FloatingChat";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminEspacos from "./pages/admin/AdminEspacos";
import AdminAnalises from "./pages/admin/AdminAnalises";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anunciar" element={<HostLanding />} />
          <Route path="/anunciar/finalizar" element={<SpaceOnboarding />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/espaco/:id" element={<SpaceDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/termos/locatario" element={<TermsRenter />} />
          <Route path="/termos/anfitriao" element={<TermsHost />} />
          <Route path="/itens-proibidos" element={<ProhibitedItems />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/quero-guardar" element={<QueroGuardar />} />
          <Route path="/fale-conosco" element={<Contact />} />
          
          {/* Dashboard - Área do cliente */}
          <Route path="/minha-conta" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="reservas" element={<DashboardReservas />} />
            <Route path="espacos" element={<DashboardEspacos />} />
            <Route path="agenda" element={<DashboardAgenda />} />
            <Route path="mensagens" element={<DashboardMensagens />} />
            <Route path="financeiro" element={<DashboardFinanceiro />} />
            <Route path="perfil" element={<DashboardPerfil />} />
          </Route>


          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="espacos" element={<AdminEspacos />} />
            <Route path="analises" element={<AdminAnalises />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingChat />
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
