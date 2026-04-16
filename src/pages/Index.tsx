import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SchoolLifeSection from "@/components/SchoolLifeSection";
import AdmissionsSection from "@/components/AdmissionsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SchoolLifeSection />
      <AdmissionsSection />
      <Footer />
    </div>
  );
};

export default Index;
