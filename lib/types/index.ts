// Shared TypeScript types

export interface Student {
  id: string;
  email: string;
  name: string;
  current_week: number;
  created_at: string;
  updated_at: string;
}

export type WeekStatus = 'not_started' | 'in_progress' | 'completed';

export interface WeekProgress {
  id: string;
  student_id: string;
  week_number: number;
  status: WeekStatus;
  completed_at: string | null;
  created_at: string;
}

export interface Checkpoint {
  id: string;
  week_progress_id: string;
  title: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export type NodeType = 'concept' | 'exercise' | 'checkpoint' | 'material';

export interface MapNode {
  id: string;
  week: number;
  title: string;
  type: NodeType;
  content: string | null;
  parent_id: string | null;
  created_at: string;
}
