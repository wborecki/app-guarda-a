import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertCircle size={28} className="text-destructive" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Algo deu errado</h2>
            <p className="text-sm text-muted-foreground">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-muted-foreground/60 bg-secondary rounded-lg p-3 overflow-x-auto text-left max-h-24">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" size="sm" onClick={this.handleReset} className="gap-1.5">
                <RefreshCw size={14} /> Tentar novamente
              </Button>
              <Button size="sm" onClick={() => window.location.reload()} className="gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground">
                Recarregar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
