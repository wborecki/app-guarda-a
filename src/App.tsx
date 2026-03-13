import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import FloatingChat from "./components/guardaai/FloatingChat";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const HostLanding = lazy(() => import("./pages/HostLanding"));
const SpaceOnboarding = lazy(() => import("./pages/SpaceOnboarding"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const SpaceDetails = lazy(() => import("./pages/SpaceDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const TermsRenter = lazy(() => import("./pages/TermsRenter"));
const TermsHost = lazy(() => import("./pages/TermsHost"));
const ProhibitedItems = lazy(() => import("./pages/ProhibitedItems"));
const Contact = lazy(() => import("./pages/Contact"));
const QueroGuardar = lazy(() => import("./pages/QueroGuardar"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const DashboardReservas = lazy(() => import("./pages/dashboard/DashboardReservas"));
const DashboardEspacos = lazy(() => import("./pages/dashboard/DashboardEspacos"));
const DashboardAgenda = lazy(() => import("./pages/dashboard/DashboardAgenda"));
const DashboardMensagens = lazy(() => import("./pages/dashboard/DashboardMensagens"));
const DashboardFinanceiro = lazy(() => import("./pages/dashboard/DashboardFinanceiro"));
const DashboardPerfil = lazy(() => import("./pages/dashboard/DashboardPerfil"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminEspacos = lazy(() => import("./pages/admin/AdminEspacos"));
const AdminAnalises = lazy(() => import("./pages/admin/AdminAnalises"));
const AdminUsuarios = lazy(() => import("./pages/admin/AdminUsuarios"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="animate-spin text-primary" size={32} />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/anunciar" element={<HostLanding />} />
            <Route path="/anunciar/finalizar" element={<SpaceOnboarding />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/buscar" element={<SearchResults />} />
            <Route path="/espaco/:id" element={<SpaceDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pagamento-sucesso" element={<PaymentSuccess />} />
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
        </Suspense>
        <FloatingChat />
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
