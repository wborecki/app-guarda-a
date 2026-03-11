import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="h-14 flex items-center justify-between border-b border-border/60 px-4 md:px-6 bg-background sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:block h-5 w-px bg-border" />
        <span className="hidden sm:block text-sm text-muted-foreground">Minha conta</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
          <Bell size={18} />
        </Button>
      </div>
    </header>
  );
}
