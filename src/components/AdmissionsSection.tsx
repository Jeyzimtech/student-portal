import { motion } from "framer-motion";
import { CheckCircle, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const steps = [
  "Complete the online application form",
  "Submit required documents (birth certificate, previous reports)",
  "Attend an assessment session",
  "Receive offer and confirm enrollment",
];

const AdmissionsSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "Application Received!",
        description: "Thank you for applying. Our admissions team will contact you shortly with next steps.",
      });
    }, 1500);
  };

  return (
    <section id="admissions" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Enroll Now</span>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-2 mb-6">
              Admissions Open for 2026
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join the CABS Primary School family. We welcome students from ECD through Grade 7
              and provide a nurturing environment for academic and personal growth.
            </p>
            <ul className="space-y-4 mb-8">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8">
                  Start Application
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl">Application for 2026</DialogTitle>
                  <DialogDescription>
                    Fill out the quick inquiry form below and our admissions team will guide you through the remaining steps.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="bg-muted p-4 rounded-lg my-2 flex gap-3 text-sm">
                  <Info className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <strong>Required Documents for Later:</strong>
                    <ul className="list-disc pl-4 mt-1 text-muted-foreground">
                      <li>Child's Birth Certificate</li>
                      <li>Latest School Report (if applicable)</li>
                      <li>Parent/Guardian ID</li>
                    </ul>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent_name">Parent Name</Label>
                      <Input id="parent_name" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+263 77..." required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student_name">Child's Name</Label>
                      <Input id="student_name" placeholder="Jane Doe" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Applying For</Label>
                      <Input id="grade" placeholder="e.g. Grade 1" required />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                      {loading ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-2xl p-10 text-primary-foreground"
          >
            <h3 className="font-heading font-bold text-2xl mb-6">Quick Facts</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Founded", value: "1985" },
                { label: "Students", value: "600+" },
                { label: "Teachers", value: "35+" },
                { label: "Pass Rate", value: "98%" },
              ].map((fact) => (
                <div key={fact.label} className="bg-primary-foreground/10 rounded-lg p-4">
                  <div className="text-3xl font-heading font-black">{fact.value}</div>
                  <div className="text-sm text-primary-foreground/70 mt-1">{fact.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsSection;
