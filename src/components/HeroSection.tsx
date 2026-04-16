import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-students.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="CABS Primary School students in classroom" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/90 text-secondary-foreground text-sm font-semibold mb-6">
            🏫 Welcome to CABS Primary School, Harare
          </span>
          <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-background leading-tight mb-6">
            Nurturing Tomorrow's{" "}
            <span className="text-secondary">Leaders</span> Today
          </h1>
          <p className="text-lg md:text-xl text-background/80 mb-8 leading-relaxed">
            A premier primary school in Harare, Zimbabwe dedicated to academic excellence,
            character development, and holistic growth for every child.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8">
                Access Portals <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="#admissions">
              <Button size="lg" variant="outline" className="border-background/40 text-background hover:bg-background/10 font-bold text-base px-8">
                Apply Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
