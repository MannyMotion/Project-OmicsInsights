export interface Step {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  examples: Array<{
    type: 'text' | 'code' | 'image';
    title: string;
    content: string;
    language?: string;
  }>;
  checklist: Array<{
    text: string;
  }>;
}

export type ChecklistState = {
  [key: string]: boolean;
};
