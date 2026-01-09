import { useAuth } from "@/hooks/useAuth";
import { Pen, ShieldCheck, FileText, ShieldAlert, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap gap-4 justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-serif font-bold">Hi, {user?.name}!</h1>
            <p className="text-muted-foreground">Welcome to your SatyaNews dashboard.</p>
          </div>
          <Link to="/account">
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div >
        {user?.role === "JOURNALIST" && (
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/journalist'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pen className="h-5 w-5 text-primary" /> Journalist Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Submit new articles and manage your drafts.</p>
            </CardContent>
          </Card>
        )}

        {user?.role === "FACT_CHECKER" && (
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/fact-checker'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Fact-Checker Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Verify sources and evidence for pending articles.</p>
            </CardContent>
          </Card>
        )}

        {user?.role === "EDITOR" && (
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/editor'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Editor Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Final review and publication of verified news.</p>
            </CardContent>
          </Card>
        )}

        {user?.role === "ADMIN" && (
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/admin'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" /> Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">System oversight, audit logs, and report management.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
