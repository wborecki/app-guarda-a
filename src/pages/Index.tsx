import SEO from "@/components/SEO";
import Header from "@/components/guardaai/Header";
import Hero from "@/components/guardaai/Hero";
import HowItWorks from "@/components/guardaai/HowItWorks";
import Differentials from "@/components/guardaai/Differentials";
import Pricing from "@/components/guardaai/Pricing";
import Security from "@/components/guardaai/Security";
import UseCases from "@/components/guardaai/UseCases";
import ForHosts from "@/components/guardaai/ForHosts";
import Testimonials from "@/components/guardaai/Testimonials";
import FAQ from "@/components/guardaai/FAQ";
import ContactSection from "@/components/guardaai/ContactSection";
import FinalCTA from "@/components/guardaai/FinalCTA";
import Footer from "@/components/guardaai/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        canonical="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "GuardaAí",
          description: "Marketplace de self storage descentralizado. Encontre espaços para guardar seus objetos perto de você. Guarde móveis, estoque e mudanças por menos.",
          url: "https://guardaai.com.br",
          applicationCategory: "BusinessApplication",
          offers: { "@type": "Offer", price: "1.50", priceCurrency: "BRL", description: "Diárias a partir de R$1,50 por m²" },
        }}
      />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Differentials />
        <Pricing />
        <Security />
        <UseCases />
        <ForHosts />
        <Testimonials />
        <FAQ />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
