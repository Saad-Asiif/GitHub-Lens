import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthScoreChart } from "./health-score-chart";
import { MetricCard } from "./metric-card";
import { CommitChart } from "./commit-chart";
import { ContributorsList } from "./contributors-list";
import type { RepositoryAnalysis } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: RepositoryAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysis),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `repository-health-${analysis.repository.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div id="analysisResults">
      {/* Repository Header */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{analysis.repository.fullName}</h2>
              <p className="text-muted-foreground mb-2">
                {analysis.repository.description || "No description available"}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center">
                  ⭐ {analysis.repository.stars?.toLocaleString() || 0} stars
                </span>
                <span className="flex items-center">
                  🍴 {analysis.repository.forks?.toLocaleString() || 0} forks
                </span>
                <span className="flex items-center">
                  👁️ {analysis.repository.watchers?.toLocaleString() || 0} watching
                </span>
                {analysis.repository.language && (
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                    {analysis.repository.language}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleExportPDF} className="bg-gh-success hover:bg-gh-success/90">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <HealthScoreChart score={analysis.healthScore} />
        </div>
        
        <MetricCard
          title="Code Quality"
          score={analysis.codeQuality}
          description="Well-structured, documented code"
          icon="💻"
        />
        
        <MetricCard
          title="Community"
          score={analysis.community}
          description="Active contributors and discussions"
          icon="👥"
        />
        
        <MetricCard
          title="Maintenance"
          score={analysis.maintenance}
          description="Regular updates and issue resolution"
          icon="🔧"
        />
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CommitChart data={analysis.commitActivity} />
        <ContributorsList contributors={analysis.contributors} />

        {/* Issue Response Time */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🐛 Issue Response Time
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gh-success">
                {analysis.issueMetrics.avgResponseTime}
              </div>
              <div className="text-sm text-muted-foreground">days average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gh-warning">
                {analysis.issueMetrics.openIssues}
              </div>
              <div className="text-sm text-muted-foreground">open issues</div>
            </div>
          </div>
        </div>

        {/* Documentation Quality */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📚 Documentation Quality
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>README.md</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${analysis.documentation.readme ? 'bg-gh-success' : 'bg-gh-danger'}`}></div>
                <span className={analysis.documentation.readme ? 'text-gh-success' : 'text-gh-danger'}>
                  {analysis.documentation.readme ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Contributing Guidelines</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${analysis.documentation.contributing ? 'bg-gh-success' : 'bg-gh-warning'}`}></div>
                <span className={analysis.documentation.contributing ? 'text-gh-success' : 'text-gh-warning'}>
                  {analysis.documentation.contributing ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Code of Conduct</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${analysis.documentation.codeOfConduct ? 'bg-gh-success' : 'bg-gh-warning'}`}></div>
                <span className={analysis.documentation.codeOfConduct ? 'text-gh-success' : 'text-gh-warning'}>
                  {analysis.documentation.codeOfConduct ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>License</span>
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${analysis.documentation.license ? 'bg-gh-success' : 'bg-gh-warning'}`}></div>
                <span className={analysis.documentation.license ? 'text-gh-success' : 'text-gh-warning'}>
                  {analysis.documentation.license ? 'Present' : 'Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CI/CD and Dependencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* CI/CD Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            ⚙️ CI/CD Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Build Status</span>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                analysis.cicd.buildStatus === 'passing' ? 'bg-gh-success' :
                analysis.cicd.buildStatus === 'failing' ? 'bg-gh-danger' : 'bg-gh-warning'
              }`}>
                {analysis.cicd.buildStatus === 'passing' ? 'Passing' :
                 analysis.cicd.buildStatus === 'failing' ? 'Failing' : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>GitHub Actions</span>
              <span className={analysis.cicd.hasWorkflows ? 'text-gh-success' : 'text-gh-warning'}>
                {analysis.cicd.hasWorkflows ? 'Configured' : 'Not configured'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Build</span>
              <span className="text-muted-foreground">
                {analysis.cicd.lastBuild ? new Date(analysis.cicd.lastBuild).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Dependencies */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            📦 Dependencies
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Total Dependencies</span>
              <span>{analysis.dependencies.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Outdated</span>
              <span className="text-gh-warning">{analysis.dependencies.outdated}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Security Alerts</span>
              <span className="text-gh-danger">{analysis.dependencies.vulnerable}</span>
            </div>
          </div>
        </div>

        {/* Release Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🏷️ Release Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Latest Release</span>
              <span className="text-primary">{analysis.releases.latest || 'No releases'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Release Frequency</span>
              <span>{analysis.releases.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Releases</span>
              <span>{analysis.releases.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            💡 Recommendations for Improvement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <span className={`mt-1 ${
                  rec.type === 'error' ? 'text-gh-danger' :
                  rec.type === 'warning' ? 'text-gh-warning' : 'text-primary'
                }`}>
                  {rec.type === 'error' ? '⚠️' : rec.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div>
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
