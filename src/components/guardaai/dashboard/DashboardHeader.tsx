import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Check, Package, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeIcons: Record<string, typeof Package> = {
  new_reservation: Package,
  reservation_confirmed: CheckCircle2,
  reservation_cancelled: XCircle,
};

const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) => {
  const Icon = typeIcons[notification.type] || Package;
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <button
      onClick={() => !notification.read && onRead(notification.id)}
      className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-accent/50 ${
        !notification.read ? "bg-primary/5" : ""
      }`}
    >
      <div
        className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          !notification.read
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-tight ${
            !notification.read ? "font-semibold text-foreground" : "text-muted-foreground"
          }`}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo}</p>
      </div>
      {!notification.read && (
        <div className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </button>
  );
};

export function DashboardHeader() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <header className="h-14 flex items-center justify-between border-b border-border/60 px-4 md:px-6 bg-background sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:block h-5 w-px bg-border" />
        <span className="hidden sm:block text-sm text-muted-foreground">
          Minha conta
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 sm:w-96 p-0"
            sideOffset={8}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <h3 className="text-sm font-semibold text-foreground">
                Notificações
              </h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                  onClick={markAllAsRead}
                >
                  <Check size={12} />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell
                    size={28}
                    className="mx-auto text-muted-foreground/40 mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={markAsRead}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
