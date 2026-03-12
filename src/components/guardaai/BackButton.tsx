import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label?: string;
  fallbackTo?: string;
  className?: string;
}

const BackButton = ({ label = "Página anterior", fallbackTo = "/", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`gap-1 text-muted-foreground hover:text-foreground group ${className}`}
    >
      <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Button>
  );
};

export default BackButton;
