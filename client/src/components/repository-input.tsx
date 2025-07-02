import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RepositoryInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function RepositoryInput({ onAnalyze, isLoading }: RepositoryInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateAndAnalyze = () => {
    setError("");
    
    if (!url.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    if (!url.includes("github.com")) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    const urlParts = url.replace("https://github.com/", "").split("/");
    if (urlParts.length < 2) {
      setError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    onAnalyze(url);
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(`https://github.com/${exampleUrl}`);
    setError("");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Analyze Any GitHub Repository</h2>
        <p className="text-muted-foreground">
          Get comprehensive health metrics, code quality insights, and community analysis
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="https://github.com/owner/repository"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              className="w-full"
              disabled={isLoading}
            />
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>
          <Button
            onClick={validateAndAnalyze}
            disabled={isLoading || !url.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? "Analyzing..." : "Analyze Repository"}
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Try popular repos:</span>
          <button
            onClick={() => handleExampleClick("facebook/react")}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            facebook/react
          </button>
          <button
            onClick={() => handleExampleClick("microsoft/vscode")}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            microsoft/vscode
          </button>
          <button
            onClick={() => handleExampleClick("vercel/next.js")}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            vercel/next.js
          </button>
        </div>
      </div>
    </div>
  );
}
