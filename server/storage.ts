import { repositories, analyses, type Repository, type InsertRepository, type Analysis, type InsertAnalysis } from "@shared/schema";

export interface IStorage {
  getRepository(fullName: string): Promise<Repository | undefined>;
  createRepository(repository: InsertRepository): Promise<Repository>;
  updateRepository(fullName: string, updates: Partial<InsertRepository>): Promise<Repository | undefined>;
  getAnalysis(repositoryId: number): Promise<Analysis | undefined>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getLatestAnalyses(limit?: number): Promise<Analysis[]>;
}

export class MemStorage implements IStorage {
  private repositories: Map<string, Repository>;
  private analyses: Map<number, Analysis>;
  private currentRepoId: number;
  private currentAnalysisId: number;

  constructor() {
    this.repositories = new Map();
    this.analyses = new Map();
    this.currentRepoId = 1;
    this.currentAnalysisId = 1;
  }

  async getRepository(fullName: string): Promise<Repository | undefined> {
    return this.repositories.get(fullName);
  }

  async createRepository(insertRepository: InsertRepository): Promise<Repository> {
    const id = this.currentRepoId++;
    const repository: Repository = {
      ...insertRepository,
      id,
      description: insertRepository.description || null,
      language: insertRepository.language || null,
      stars: insertRepository.stars || null,
      forks: insertRepository.forks || null,
      watchers: insertRepository.watchers || null,
      openIssues: insertRepository.openIssues || null,
      lastAnalyzed: new Date(),
    };
    this.repositories.set(repository.fullName, repository);
    return repository;
  }

  async updateRepository(fullName: string, updates: Partial<InsertRepository>): Promise<Repository | undefined> {
    const existing = this.repositories.get(fullName);
    if (!existing) return undefined;

    const updated: Repository = {
      ...existing,
      ...updates,
      lastAnalyzed: new Date(),
    };
    this.repositories.set(fullName, updated);
    return updated;
  }

  async getAnalysis(repositoryId: number): Promise<Analysis | undefined> {
    return Array.from(this.analyses.values()).find(a => a.repositoryId === repositoryId);
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.currentAnalysisId++;
    const analysis: Analysis = {
      id,
      repositoryId: insertAnalysis.repositoryId || null,
      healthScore: insertAnalysis.healthScore,
      codeQuality: insertAnalysis.codeQuality,
      community: insertAnalysis.community,
      maintenance: insertAnalysis.maintenance,
      analysisData: insertAnalysis.analysisData,
      createdAt: new Date(),
    };
    this.analyses.set(id, analysis);
    return analysis;
  }

  async getLatestAnalyses(limit: number = 10): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
