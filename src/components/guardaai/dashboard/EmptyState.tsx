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
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
      <Icon size={24} className="text-muted-foreground/60" />
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs mb-5">{description}</p>
    {actionLabel && actionHref && (
      <Button size="sm" asChild>
        <Link to={actionHref}>{actionLabel}</Link>
      </Button>
    )}
    {actionLabel && actionOnClick && (
      <Button size="sm" onClick={actionOnClick}>{actionLabel}</Button>
    )}
  </div>
);
