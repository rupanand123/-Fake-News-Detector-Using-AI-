export type Verdict = 'REAL' | 'FAKE' | 'PARTIALLY TRUE';

export interface AnalysisResult {
  id: string;
  title: string;
  verdict: Verdict;
  confidence: number;
  explanation: string;
  factSummary: string;
  sourceScore: number;
  timestamp: number;
  url?: string;
  text?: string;
  imageUrl?: string;
}

export interface UserStats {
  totalChecked: number;
  realCount: number;
  fakeCount: number;
  partialCount: number;
  accuracy: number;
}
