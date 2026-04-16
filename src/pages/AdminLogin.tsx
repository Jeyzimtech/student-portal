import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, role } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login Failed", description: error, variant: "destructive" });
    } else {
      // Route based on role — teachers and admins get different portals
      const emailLower = email.toLowerCase().trim();
      if (emailLower.startsWith("teacher")) {
        navigate("/teacher");
      } else {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-secondary-foreground" />
          </div>
          <h1 className="font-heading font-black text-2xl text-foreground">Staff Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Teachers & Administrators</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="email@cabsprimary.ac.zw" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 space-y-1 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
          <div><strong>Admin:</strong> admin@cabsprimary.ac.zw / admin123</div>
          <div><strong>Teacher:</strong> teacher@cabsprimary.ac.zw / teacher123</div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-primary hover:underline">← Back to website</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
