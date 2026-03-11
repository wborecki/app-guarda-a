import {
  LayoutDashboard,
  Package,
  Home,
  CalendarDays,
  MessageSquare,
  Wallet,
  UserCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/guardaai-logo-transparent.png";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainItems = [
  { title: "Visão geral", url: "/minha-conta", icon: LayoutDashboard },
  { title: "Minhas reservas", url: "/minha-conta/reservas", icon: Package },
  { title: "Meus espaços", url: "/minha-conta/espacos", icon: Home },
  { title: "Agenda", url: "/minha-conta/agenda", icon: CalendarDays },
  { title: "Mensagens", url: "/minha-conta/mensagens", icon: MessageSquare },
  { title: "Financeiro", url: "/minha-conta/financeiro", icon: Wallet },
];

const accountItems = [
  { title: "Perfil e configurações", url: "/minha-conta/perfil", icon: UserCircle },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { displayName, signOut, user } = useAuth();
  const { isAdmin } = useAdminCheck();

  const isActive = (path: string) => {
    if (path === "/minha-conta") return location.pathname === "/minha-conta";
    return location.pathname.startsWith(path);
  };

  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarContent className="py-2">
        {/* Logo */}
        <div className={`px-4 py-3 mb-1 ${collapsed ? "flex justify-center" : ""}`}>
          <Link to="/">
            {collapsed ? (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">G</span>
              </div>
            ) : (
              <img src={logo} alt="GuardaAí" className="h-7" />
            )}
          </Link>
        </div>

        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? "sr-only" : ""} text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold px-3`}>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-2">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-lg"
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === "/minha-conta"}
                      className="hover:bg-sidebar-accent/60 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? "sr-only" : ""} text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold px-3`}>
            Conta
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-2">
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="h-9 rounded-lg"
                  >
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/60 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className={`${collapsed ? "sr-only" : ""} text-[11px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold px-3`}>
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5 px-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith("/admin")}
                    tooltip="Painel admin"
                    className="h-9 rounded-lg"
                  >
                    <NavLink
                      to="/admin"
                      className="hover:bg-sidebar-accent/60 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    >
                      <ShieldCheck className="h-[18px] w-[18px]" />
                      {!collapsed && <span className="text-[13px]">Painel admin</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer — user info */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        {collapsed ? (
          <button onClick={signOut} className="flex items-center justify-center w-full" title="Sair">
            <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-lg hover:bg-sidebar-accent/40 p-2 -m-1 transition-colors">
            <Avatar className="h-9 w-9 ring-2 ring-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {displayName || "Usuário"}
              </p>
              <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-sidebar-foreground/40 hover:text-destructive transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
