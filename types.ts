export interface Candidate {
  id: string;
  number: number;
  name: string;
  role: 'president' | 'vice_president';
}

export interface Vote {
  presidentId: string;
  vicePresidentId: string;
  timestamp: any; // Firestore Timestamp
}

export interface VoteResult {
  candidateId: string;
  candidateName: string;
  count: number;
  fill: string;
}

// Chart colors for visualization (assigned by candidate index)
export const CHART_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

export const PRESIDENT_CANDIDATES: Candidate[] = [
  { id: 'p1', number: 1, name: '한시우', role: 'president' },
  { id: 'p2', number: 2, name: '김재광', role: 'president' },
  { id: 'p3', number: 3, name: '장현준', role: 'president' },
  { id: 'p4', number: 4, name: '이주봉', role: 'president' },
];

export const VICE_PRESIDENT_CANDIDATES: Candidate[] = [
  { id: 'v1', number: 1, name: '윤시후', role: 'vice_president' },
  { id: 'v2', number: 2, name: '길윤호', role: 'vice_president' },
  { id: 'v3', number: 3, name: '정요엘', role: 'vice_president' },
  { id: 'v4', number: 4, name: '장지현', role: 'vice_president' },
];