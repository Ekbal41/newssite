import { Link } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import NotificationBell from "../NotificationBell";
import { Button } from "../ui/button";
import { CircleUser } from "lucide-react";
import ProjectLogo from "../ProjectLogo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        <ProjectLogo />
        <div className="flex items-center gap-2">
          <NotificationBell types="user,system" />
          <ModeToggle />
          <Link to="/account">
            <Button size="icon" variant="outline">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
