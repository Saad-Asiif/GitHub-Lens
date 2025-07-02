import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="bg-card border border-border rounded-lg p-8 text-center mb-8">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <h3 className="text-lg font-semibold mb-2">Analyzing Repository...</h3>
      <p className="text-muted-foreground">
        Fetching data from GitHub API, this may take a few moments
      </p>
    </div>
  );
}
