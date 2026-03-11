import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  const { displayName } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative" asChild>
          <Link to="/minha-conta">
            <Bell size={18} />
          </Link>
        </Button>
      </div>
    </header>
  );
}
