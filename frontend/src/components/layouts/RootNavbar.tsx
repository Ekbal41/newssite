import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "../mode-toggle";
import ProjectLogo from "../ProjectLogo";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ArrowRight, LogIn } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        <ProjectLogo />
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <Link to="/dashboard">
              <Button variant="default" size="sm">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
