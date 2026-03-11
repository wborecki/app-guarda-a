import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, actionHref, actionOnClick }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
      <Icon size={28} className="text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
    {actionLabel && actionHref && (
      <Button asChild>
        <Link to={actionHref}>{actionLabel}</Link>
      </Button>
    )}
    {actionLabel && actionOnClick && (
      <Button onClick={actionOnClick}>{actionLabel}</Button>
    )}
  </div>
);
