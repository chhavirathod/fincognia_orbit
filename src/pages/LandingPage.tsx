import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import TechStack from "@/components/TechStack";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Showcase />
      <TechStack />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
