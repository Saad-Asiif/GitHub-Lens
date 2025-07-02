import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const repositories = pgTable("repositories", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull().unique(),
  owner: text("owner").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  language: text("language"),
  stars: integer("stars").default(0),
  forks: integer("forks").default(0),
  watchers: integer("watchers").default(0),
  openIssues: integer("open_issues").default(0),
  lastAnalyzed: timestamp("last_analyzed").defaultNow(),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  repositoryId: integer("repository_id").references(() => repositories.id),
  healthScore: integer("health_score").notNull(),
  codeQuality: integer("code_quality").notNull(),
  community: integer("community").notNull(),
  maintenance: integer("maintenance").notNull(),
  analysisData: json("analysis_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRepositorySchema = createInsertSchema(repositories).omit({
  id: true,
  lastAnalyzed: true,
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type Repository = typeof repositories.$inferSelect;
export type InsertRepository = z.infer<typeof insertRepositorySchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

export const githubUrlSchema = z.object({
  url: z.string().url().refine((url) => {
    return url.includes("github.com") && url.split("/").length >= 5;
  }, "Must be a valid GitHub repository URL"),
});

export type GitHubUrlInput = z.infer<typeof githubUrlSchema>;

export interface RepositoryAnalysis {
  repository: Repository;
  healthScore: number;
  codeQuality: number;
  community: number;
  maintenance: number;
  commitActivity: Array<{ month: string; commits: number }>;
  contributors: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
    percentage: number;
  }>;
  issueMetrics: {
    avgResponseTime: number;
    openIssues: number;
    closedIssues: number;
  };
  documentation: {
    readme: boolean;
    contributing: boolean;
    codeOfConduct: boolean;
    license: boolean;
    wiki: boolean;
  };
  cicd: {
    hasWorkflows: boolean;
    lastBuild: string | null;
    buildStatus: "passing" | "failing" | "unknown";
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
  };
  releases: {
    latest: string | null;
    frequency: string;
    total: number;
  };
  recommendations: Array<{
    type: "warning" | "error" | "info";
    title: string;
    description: string;
  }>;
}
