import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
  Info,
  ShieldCheck,
  Mail,
  Lock,
  User,
  ArrowRight,
  Newspaper,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function LoginRegister() {
  const { login, register, authLoading, error } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "READER",
  });

  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password, form.role);
      } else {
        await login(form.email, form.password);
      }
      setForm({ name: "", email: "", password: "", role: "READER" });
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg space-y-8 relative">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-serif font-bold tracking-tight">
            {isRegister ? "Join the Truth Circle" : "Welcome Back to SatyaNews"}
          </h1>

          <p className="text-muted-foreground text-lg">
            {isRegister
              ? "Become part of a community dedicated to verified, high-integrity journalism."
              : "Access your personalized portal for verified news and editorial oversight."}
          </p>
        </div>

        {/* Card */}
        <Card className="p-2">
          <CardContent className="p-8 space-y-8">
            {error && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle className="uppercase tracking-widest text-xs font-bold">
                  Authentication Error
                </AlertTitle>
                <AlertDescription className="font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-xs">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                    <Input
                      className="pl-12"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                  <Input
                    type="email"
                    className="pl-12"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-xs">
                    Your Role
                  </Label>
                  <Select
                    value={form.role}
                    onValueChange={(value) =>
                      setForm({ ...form, role: value })
                    }
                  >
                    <SelectTrigger className="pl-12 w-full relative">
                      <Newspaper className="absolute left-4 h-5 w-5 text-muted-foreground/40" />
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="READER">
                        Reader (Truth Seeker)
                      </SelectItem>
                      <SelectItem value="JOURNALIST">
                        Journalist (Truth Teller)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs">
                  Secure Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="pl-12"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <Button
                  type="submit"
                  disabled={authLoading !== null}
                  className="w-full h-14 text-lg flex items-center justify-center gap-3"
                >
                  {isRegister
                    ? authLoading === "register"
                      ? "Creating Account..."
                      : "Join SatyaNews"
                    : authLoading === "login"
                      ? "Authenticating..."
                      : "Sign In to Portal"}
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsRegister(!isRegister)}
                  className="w-full uppercase tracking-widest text-xs"
                >
                  {isRegister
                    ? "Already a member? Sign In"
                    : "New to SatyaNews? Create Account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            to="/auth/request-password-reset"
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            Forgotten your credentials? Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
