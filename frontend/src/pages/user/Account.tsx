import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Key, Shield, Mail, User, ShieldCheck, LogOut, Settings } from "lucide-react";

import { toast } from "sonner";
import Avatar from "boring-avatars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Account() {
  const { logout, user, refetchUser, authLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") !== "true") return;
    toast.success("Email verified successfully!");
    refetchUser();
    params.delete("verified");
    const newSearch = params.toString();
    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [location.search]);



  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          <User className="h-4 w-4" /> Account
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, security, and preferences.</p>
      </header>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar name={user?.name || "User"} variant="beam" size={64} className="rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-serif">{user?.name}</h2>
                  <span className="badge bg-secondary text-secondary-foreground">{user?.role}</span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {user?.email}
                </p>
                {user?.emailVerified && (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={logout} disabled={authLoading === "logout"} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
              <LogOut className="h-4 w-4 mr-2" /> {authLoading === "logout" ? "Logging Out..." : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Update your password regularly for security.</p>
            </div>
            <Link to="/auth/change-password">
              <Button variant="outline"><Key className="h-4 w-4 mr-2" /> Change Password</Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">Preferences</p>
              <p className="text-sm text-muted-foreground">Configure dashboard and notification settings.</p>
            </div>
            <Button variant="outline" disabled><Settings className="h-4 w-4 mr-2" /> Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
