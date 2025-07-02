import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RepositoryInput } from "@/components/repository-input";
import { LoadingState } from "@/components/loading-state";
import { AnalysisResults } from "@/components/analysis-results";
import { useQuery } from "@tanstack/react-query";
import type { RepositoryAnalysis } from "@shared/schema";

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [shouldAnalyze, setShouldAnalyze] = useState(false);

  const {
    data: analysis,
    isLoading,
    error,
    refetch,
  } = useQuery<RepositoryAnalysis>({
    queryKey: ["/api/analyze", repositoryUrl],
    queryFn: async () => {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: repositoryUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze repository");
      }

      return response.json();
    },
    enabled: shouldAnalyze && !!repositoryUrl,
  });

  const handleAnalyze = (url: string) => {
    setRepositoryUrl(url);
    setShouldAnalyze(false);
    // Reset state and trigger new analysis
    setTimeout(() => setShouldAnalyze(true), 100);
  };

  const handleRetry = () => {
    setShouldAnalyze(false);
    setTimeout(() => setShouldAnalyze(true), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent" style={{ lineHeight: 1.3 }}>
              Analyze Repository Health
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get comprehensive insights into GitHub repositories with detailed health metrics, 
              code quality analysis, and community engagement scores
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-12">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gh-success rounded-full"></div>
                <span>Code Quality Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Community Metrics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gh-warning rounded-full"></div>
                <span>Maintenance Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>PDF Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RepositoryInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        {isLoading && <LoadingState />}
        
        {error && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-destructive">Analysis Failed</h3>
              <p className="text-muted-foreground mb-4">{error.message}</p>
              <button
                onClick={handleRetry}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {analysis && !isLoading && <AnalysisResults analysis={analysis} />}
      </main>
      
      <Footer />
    </div>
  );
}
