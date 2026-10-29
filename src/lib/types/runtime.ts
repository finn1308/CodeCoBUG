export type ExecutionStatus = 'idle' | 'loading_runtime' | 'running' | 'completed' | 'timeout' | 'error';

export type OutputType = 'stdout' | 'stderr' | 'system' | 'judge';

export interface OutputLog {
  id: string;
  type: OutputType;
  content: string;
  timestamp: number;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  exitCode: number;
  error?: string;
}

export type Verdict = 
  | 'pending'
  | 'evaluating'
  | 'accepted' 
  | 'wrong_answer' 
  | 'runtime_error' 
  | 'time_limit_exceeded' 
  | 'compile_error';

export interface TestResultItem {
  testCaseId: string;
  orderIndex: number;
  isPassed: boolean;
  actualOutput?: string;
  expectedOutput?: string;
  errorMessage?: string;
  executionTimeMs: number;
  isHidden: boolean;
}

export interface SubmissionReport {
  id: string;
  exerciseId: string;
  verdict: Verdict;
  passedTestsCount: number;
  totalTestsCount: number;
  executionTimeMs: number;
  testResults: TestResultItem[];
  submittedAt: string;
}
