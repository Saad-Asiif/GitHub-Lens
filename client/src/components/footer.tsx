import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-3 flex flex-col justify-center">
              <h5 className="font-semibold mb-2">About</h5>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                GitHub Repository Health Analyzer is an open source project. <br />
                <span className="text-foreground font-medium">Contributions are welcome!</span> Help us make it better for everyone.
              </p>
              </div>
          <div>
            <h5 className="font-semibold mb-3">Connect</h5>
            <div className="flex space-x-4">
              <a href="mailto:saad.asif0995@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://github.com/Saad-Asiif" target="blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/saad-asiif/" target="blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 GitHub Repository Health Analyzer. Built for the open source community.</p>
        </div>
      </div>
    </footer>
  );
}
