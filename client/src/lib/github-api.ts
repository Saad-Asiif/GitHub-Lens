import { apiRequest } from "./queryClient";
import type { RepositoryAnalysis, GitHubUrlInput } from "@shared/schema";

export const githubApi = {
  async analyzeRepository(url: string): Promise<RepositoryAnalysis> {
    const response = await apiRequest("POST", "/api/analyze", { url });
    return response.json();
  },

  async validateUrl(url: string): Promise<{ valid: boolean; owner?: string; repo?: string; message?: string }> {
    try {
      const response = await apiRequest("POST", "/api/validate-url", { url });
      return response.json();
    } catch (error) {
      return { valid: false, message: error.message };
    }
  },

  async generatePDF(analysis: RepositoryAnalysis): Promise<Blob> {
    const response = await apiRequest("POST", "/api/generate-pdf", analysis);
    return response.blob();
  },

  async getRecentAnalyses(limit: number = 10) {
    const response = await apiRequest("GET", `/api/recent-analyses?limit=${limit}`);
    return response.json();
  },
};
