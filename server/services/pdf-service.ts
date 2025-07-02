import puppeteer from 'puppeteer';
import type { RepositoryAnalysis } from "@shared/schema";

export class PDFService {
  async generateReport(analysis: RepositoryAnalysis): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
    }); // no path needed

    try {
      const page = await browser.newPage();
      
      const html = this.generateHTML(analysis);
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private generateHTML(analysis: RepositoryAnalysis): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Repository Health Report - ${analysis.repository.fullName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #0969da;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .health-score {
            text-align: center;
            background: #f6f8fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .score-circle {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: conic-gradient(#28a745 ${analysis.healthScore * 3.6}deg, #e1e4e8 0deg);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            position: relative;
        }
        .score-circle::before {
            content: '';
            width: 70px;
            height: 70px;
            background: white;
            border-radius: 50%;
            position: absolute;
        }
        .score-text {
            position: relative;
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .metric-card {
            background: #f6f8fa;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .metric-score {
            font-size: 32px;
            font-weight: bold;
            color: #0969da;
            margin-bottom: 5px;
        }
        .section {
            margin: 30px 0;
        }
        .section h2 {
            color: #0969da;
            border-bottom: 1px solid #e1e4e8;
            padding-bottom: 10px;
        }
        .contributors-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .contributor {
            background: #f6f8fa;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
        }
        .recommendations {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
        }
        .recommendation {
            margin: 10px 0;
            padding: 10px;
            border-left: 4px solid #f39c12;
            background: #fefefe;
        }
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .stats-table th,
        .stats-table td {
            border: 1px solid #e1e4e8;
            padding: 12px;
            text-align: left;
        }
        .stats-table th {
            background: #f6f8fa;
            font-weight: 600;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-success { background: #28a745; color: white; }
        .badge-warning { background: #ffc107; color: #212529; }
        .badge-danger { background: #dc3545; color: white; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Repository Health Report</h1>
        <h2>${analysis.repository.fullName}</h2>
        <p>${analysis.repository.description || 'No description available'}</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="health-score">
        <div class="score-circle">
            <span class="score-text">${analysis.healthScore}</span>
        </div>
        <h3>Overall Health Score</h3>
        <p>${this.getHealthDescription(analysis.healthScore)}</p>
    </div>

    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-score">${analysis.codeQuality}</div>
            <h4>Code Quality</h4>
        </div>
        <div class="metric-card">
            <div class="metric-score">${analysis.community}</div>
            <h4>Community</h4>
        </div>
        <div class="metric-card">
            <div class="metric-score">${analysis.maintenance}</div>
            <h4>Maintenance</h4>
        </div>
    </div>

    <div class="section">
        <h2>Repository Statistics</h2>
        <table class="stats-table">
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Stars</td>
                <td>${analysis.repository.stars?.toLocaleString() || 0}</td>
            </tr>
            <tr>
                <td>Forks</td>
                <td>${analysis.repository.forks?.toLocaleString() || 0}</td>
            </tr>
            <tr>
                <td>Watchers</td>
                <td>${analysis.repository.watchers?.toLocaleString() || 0}</td>
            </tr>
            <tr>
                <td>Open Issues</td>
                <td>${analysis.issueMetrics.openIssues}</td>
            </tr>
            <tr>
                <td>Primary Language</td>
                <td>${analysis.repository.language || 'Not specified'}</td>
            </tr>
            <tr>
                <td>Average Issue Response Time</td>
                <td>${analysis.issueMetrics.avgResponseTime} days</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Top Contributors</h2>
        <div class="contributors-list">
            ${analysis.contributors.map(contributor => `
                <div class="contributor">
                    <h4>${contributor.login}</h4>
                    <p>${contributor.contributions} contributions</p>
                    <p>${contributor.percentage}% of total</p>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>Documentation Status</h2>
        <table class="stats-table">
            <tr>
                <td>README</td>
                <td>${analysis.documentation.readme ? 
                    '<span class="badge badge-success">Present</span>' : 
                    '<span class="badge badge-danger">Missing</span>'}</td>
            </tr>
            <tr>
                <td>Contributing Guidelines</td>
                <td>${analysis.documentation.contributing ? 
                    '<span class="badge badge-success">Present</span>' : 
                    '<span class="badge badge-warning">Missing</span>'}</td>
            </tr>
            <tr>
                <td>Code of Conduct</td>
                <td>${analysis.documentation.codeOfConduct ? 
                    '<span class="badge badge-success">Present</span>' : 
                    '<span class="badge badge-warning">Missing</span>'}</td>
            </tr>
            <tr>
                <td>License</td>
                <td>${analysis.documentation.license ? 
                    '<span class="badge badge-success">Present</span>' : 
                    '<span class="badge badge-warning">Missing</span>'}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>CI/CD Status</h2>
        <table class="stats-table">
            <tr>
                <td>GitHub Actions</td>
                <td>${analysis.cicd.hasWorkflows ? 
                    '<span class="badge badge-success">Configured</span>' : 
                    '<span class="badge badge-warning">Not configured</span>'}</td>
            </tr>
            <tr>
                <td>Build Status</td>
                <td><span class="badge badge-${analysis.cicd.buildStatus === 'passing' ? 'success' : 
                    analysis.cicd.buildStatus === 'failing' ? 'danger' : 'warning'}">${analysis.cicd.buildStatus}</span></td>
            </tr>
            <tr>
                <td>Last Build</td>
                <td>${analysis.cicd.lastBuild ? new Date(analysis.cicd.lastBuild).toLocaleDateString() : 'N/A'}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Release Information</h2>
        <table class="stats-table">
            <tr>
                <td>Latest Release</td>
                <td>${analysis.releases.latest || 'No releases'}</td>
            </tr>
            <tr>
                <td>Release Frequency</td>
                <td>${analysis.releases.frequency}</td>
            </tr>
            <tr>
                <td>Total Releases</td>
                <td>${analysis.releases.total}</td>
            </tr>
        </table>
    </div>

    ${analysis.recommendations.length > 0 ? `
    <div class="section">
        <h2>Recommendations</h2>
        <div class="recommendations">
            ${analysis.recommendations.map(rec => `
                <div class="recommendation">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="section">
        <p style="text-align: center; color: #666; font-size: 14px;">
            This report was generated by GitHub Repository Health Analyzer on ${new Date().toLocaleString()}
        </p>
    </div>
</body>
</html>
    `;
  }

  private getHealthDescription(score: number): string {
    if (score >= 90) return "Excellent repository health with strong community and maintenance";
    if (score >= 80) return "Very good repository health with minor areas for improvement";
    if (score >= 70) return "Good repository health with some recommendations";
    if (score >= 60) return "Fair repository health, several areas need attention";
    return "Repository health needs significant improvement";
  }
}
