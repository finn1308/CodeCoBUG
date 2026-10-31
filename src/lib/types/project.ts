/**
 * CodeCoBUG Project-Based Learning (PBL) Types
 * Defines data structures for the 3 major Python Crash Course projects:
 * 1. Alien Invasion (Pygame)
 * 2. Data Visualization (Matplotlib, Plotly, APIs)
 * 3. Web Applications (Django Full-Stack)
 */

export type ProjectCategory = 'game' | 'data' | 'web';
export type ProjectRuntimeMode = 'pyodide_canvas' | 'pyodide_data' | 'hybrid_server_local';

export interface ProjectTestCase {
  id: string;
  inputData: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface ProjectCheckpoint {
  id: string;
  projectId: string;
  slug: string;
  orderIndex: number;
  title: string;
  description: string;
  learningObjectives: string[];
  theoryContent: string;
  codeExplanation: string;
  starterCode: string;
  solutionCode: string;
  exerciseSlug: string;
  hints: string[];
  localRunHint?: string;
  testCases: ProjectTestCase[];
}

export interface LocalExecutionGuide {
  prerequisites: string[];
  installCommands: string[];
  runCommand: string;
  folderStructure: string;
  notes?: string[];
}

export interface ProjectCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  level: 'advanced';
  accentColor: 'mint' | 'sky' | 'lavender';
  estimatedHours: number;
  prerequisites: string[];
  learningObjectives: string[];
  overview: string;
  architectureOverview: string;
  runtimeMode: ProjectRuntimeMode;
  runtimeNotice: string;
  localExecutionGuide: LocalExecutionGuide;
  checkpoints: ProjectCheckpoint[];
}

export interface ProjectProgressRecord {
  projectId: string;
  completedCheckpoints: string[];
  totalCheckpoints: number;
  percentage: number;
  lastActiveCheckpointSlug?: string;
  updatedAt: string;
}

