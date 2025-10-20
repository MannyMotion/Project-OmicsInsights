
export interface Example {
  type: 'code' | 'text' | 'image';
  title: string;
  content: string;
  language?: 'javascript' | 'python' | 'sql' | 'bash' | 'json';
}

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  examples: Example[];
  checklist: { text: string }[];
}

export interface ChecklistState {
  [key: string]: boolean;
}
