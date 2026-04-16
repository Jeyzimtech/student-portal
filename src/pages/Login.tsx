import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Shield, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { signIn, user, role } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user && role) {
      if (role === "student") navigate("/student-dashboard");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "admin") navigate("/admin");
    }
  }, [user, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast({ 
        title: "Login Failed", 
        description: error, 
        variant: "destructive" 
      });
    } else {
      // The redirection will be handled by the useEffect above
      // but we can also do an immediate check here for speed
      const emailLower = email.toLowerCase().trim();
      if (emailLower === "student@cabsprimary.ac.zw") navigate("/student-dashboard");
      else if (emailLower === "teacher@cabsprimary.ac.zw") navigate("/teacher");
      else if (emailLower === "admin@cabsprimary.ac.zw") navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md border border-border/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4 border border-primary/20">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-black text-2xl text-foreground">School Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Access Student, Teacher & Admin Dashboards</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                placeholder="email@cabsprimary.ac.zw" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
              <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
              <Shield className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11">
            {loading ? "Authenticating..." : "Sign In to Portal"}
          </Button>
        </form>

        <div className="mt-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Access (Demo Mode)</p>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => { setEmail("student@cabsprimary.ac.zw"); setPassword("student123"); }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10 text-primary">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">Student Portal</p>
                  <p className="text-[10px] text-muted-foreground">Results & Financials</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button 
              onClick={() => { setEmail("admin@cabsprimary.ac.zw"); setPassword("admin123"); }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-secondary/10 text-secondary">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">Management Portal</p>
                  <p className="text-[10px] text-muted-foreground">Admin & Staff Control</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to front office</Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
