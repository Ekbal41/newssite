import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          SatyaNews
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" variant="outline">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
