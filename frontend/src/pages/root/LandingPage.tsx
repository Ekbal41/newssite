import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Globe, Zap, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProjectLogo from "@/components/ProjectLogo";
import { ModeToggle } from "@/components/mode-toggle";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <ProjectLogo />
          <div className="flex items-center gap-4">
            <Link to="/news" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              News Feed
            </Link>
            <ModeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified News Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Truth Over <span className="text-primary">Virality</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The first news platform for Bangladesh where every story is human-verified, source-transparent, and free from engagement-driven bias.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/news">
                <Button size="lg">
                  Read Verified News <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              {!user && (
                <Link to="/auth/register">
                  <Button variant="outline" size="lg">
                    Become a Journalist
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Why SatyaNews?</h2>
            <p className="text-muted-foreground mt-2">Rebuilding trust in journalism through transparency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Human Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every article undergoes a 3-stage verification process by independent fact-checkers and editors.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Globe className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Full Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We cite every source and provide evidence used for verification. Trace every claim to its origin.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Anti-Virality Model</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No likes, no shares, no algorithmic manipulation. We prioritize accuracy over clicks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to see the truth?</h2>
              <p className="text-primary-foreground/80 max-w-md mx-auto">
                Join thousands who have switched to a more honest way of consuming news.
              </p>
              <Link to="/news">
                <Button size="lg" variant="secondary">
                  Enter News Portal
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <ProjectLogo />
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/news" className="hover:text-foreground transition-colors">News</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SatyaNews
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
