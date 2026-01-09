import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Scale,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            SatyaNews
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/news"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Latest News
            </Link>

            {user ? (
              <Link to="/dashboard">
                <Button size="sm" variant="outline">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Editorial Hero */}
      <main className="flex-1">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit">
                  Independent Journalism • Bangladesh
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Journalism Built on
                  <br />
                  <span className="text-primary">
                    Evidence and Accountability
                  </span>
                </h1>

                <p className="text-muted-foreground text-lg max-w-xl">
                  SatyaNews is a public-interest news platform where reports are
                  reviewed, sources are disclosed, and popularity does not
                  decide visibility.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/news">
                    <Button size="lg">
                      Browse Verified Reports{" "}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>

                  {!user && (
                    <Link to="/auth/register">
                      <Button size="lg" variant="secondary">
                        Join as Contributor
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Credibility Panel */}
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Our Editorial Principles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Mandatory multi-layer human verification for every
                      article.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Globe2 className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Public source citations and evidence disclosure.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Scale className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Ranking based on factual strength, not engagement metrics.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Globe2 className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Public source citations and evidence disclosure.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Scale className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Ranking based on factual strength, not engagement metrics.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Globe2 className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Public source citations and evidence disclosure.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Scale className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Ranking based on factual strength, not engagement metrics.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Globe2 className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Public source citations and evidence disclosure.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Scale className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Ranking based on factual strength, not engagement metrics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
