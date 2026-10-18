/** Illustrative demo shapes. Replace with real API types once endpoints exist. */
export interface DemoSessionRecord {
  id: string;
  label: string;
  role: string;
  score: number;
  focus: string;
}

export interface ScoreComponent {
  key: string;
  label: string;
  score: number;
  evidence: string;
}
