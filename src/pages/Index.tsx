import Header from "@/components/guardaai/Header";
import Hero from "@/components/guardaai/Hero";
import HowItWorks from "@/components/guardaai/HowItWorks";
import Differentials from "@/components/guardaai/Differentials";
import Pricing from "@/components/guardaai/Pricing";
import Simulator from "@/components/guardaai/Simulator";
import Security from "@/components/guardaai/Security";
import UseCases from "@/components/guardaai/UseCases";
import SmallBusiness from "@/components/guardaai/SmallBusiness";
import ForHosts from "@/components/guardaai/ForHosts";
import Testimonials from "@/components/guardaai/Testimonials";
import FAQ from "@/components/guardaai/FAQ";
import ContactSection from "@/components/guardaai/ContactSection";
import FinalCTA from "@/components/guardaai/FinalCTA";
import Footer from "@/components/guardaai/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Differentials />
        <Pricing />
        <Simulator />
        <Security />
        <UseCases />
        <SmallBusiness />
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
