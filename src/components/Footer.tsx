import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="gradient-hero text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-xl">CABS Primary</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Nurturing excellence in education since 1985. Building tomorrow's leaders in Harare, Zimbabwe.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Harare, Zimbabwe</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +263 242 123 456</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@cabsprimary.ac.zw</div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <a href="#school-life" className="block hover:text-primary-foreground transition-colors">School Life</a>
              <a href="#admissions" className="block hover:text-primary-foreground transition-colors">Admissions</a>
              <a href="/student-login" className="block hover:text-primary-foreground transition-colors">Student Portal</a>
              <a href="/admin-login" className="block hover:text-primary-foreground transition-colors">Staff Portal</a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-sm text-primary-foreground/50 flex flex-col md:flex-row justify-between items-center gap-2">
          <div>© 2026 CABS Primary School, Harare. All rights reserved.</div>
          <div>Developed by <a href="https://teramark.tech" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-primary-foreground transition-colors">Teramark.tech</a></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
