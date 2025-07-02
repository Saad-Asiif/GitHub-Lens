import { Github } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Github className="h-8 w-8 text-foreground" />
            <h1 className="text-xl font-semibold">Repository Health Analyzer</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Sign in with GitHub
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
