import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GitHubService } from "./services/github-service";
import { PDFService } from "./services/pdf-service";
import { githubUrlSchema, insertRepositorySchema, insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const githubService = new GitHubService();
  const pdfService = new PDFService();

  // Analyze repository endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = githubUrlSchema.parse(req.body);
      const { owner, repo } = githubService.parseRepositoryUrl(url);
      
      // Check if repository already exists and was recently analyzed
      const existingRepo = await storage.getRepository(`${owner}/${repo}`);
      if (existingRepo) {
        const hoursSinceAnalysis = (Date.now() - existingRepo.lastAnalyzed!.getTime()) / (1000 * 60 * 60);
        if (hoursSinceAnalysis < 1) { // Cache for 1 hour
          const existingAnalysis = await storage.getAnalysis(existingRepo.id);
          if (existingAnalysis) {
            return res.json({
              ...JSON.parse(existingAnalysis.analysisData as string),
              repository: existingRepo,
            });
          }
        }
      }

      // Perform new analysis
      const analysis = await githubService.analyzeRepository(owner, repo);
      
      // Store or update repository
      let repository;
      if (existingRepo) {
        repository = await storage.updateRepository(analysis.repository.fullName, {
          description: analysis.repository.description,
          language: analysis.repository.language,
          stars: analysis.repository.stars,
          forks: analysis.repository.forks,
          watchers: analysis.repository.watchers,
          openIssues: analysis.repository.openIssues,
        });
      } else {
        repository = await storage.createRepository(analysis.repository);
      }

      // Store analysis
      await storage.createAnalysis({
        repositoryId: repository!.id,
        healthScore: analysis.healthScore,
        codeQuality: analysis.codeQuality,
        community: analysis.community,
        maintenance: analysis.maintenance,
        analysisData: JSON.stringify(analysis),
      });

      res.json({ ...analysis, repository });
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(400).json({ 
        message: error?.message || "Failed to analyze repository" 
      });
    }
  });

  // Generate PDF report
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const analysisData = req.body;
      const pdfBuffer = await pdfService.generateReport(analysisData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="repository-health-${analysisData.repository.name}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate PDF report" 
      });
    }
  });

  // Get recent analyses
  app.get("/api/recent-analyses", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getLatestAnalyses(limit);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      res.status(500).json({ 
        message: "Failed to fetch recent analyses" 
      });
    }
  });

  // Validate GitHub URL endpoint
  app.post("/api/validate-url", async (req, res) => {
    try {
      const { url } = githubUrlSchema.parse(req.body);
      const { owner, repo } = githubService.parseRepositoryUrl(url);
      res.json({ valid: true, owner, repo });
    } catch (error) {
      res.status(400).json({ 
        valid: false, 
        message: "Invalid GitHub repository URL" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
