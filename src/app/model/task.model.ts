export type SortOrder = 'asc' | 'desc';

export interface Task {
  isDetail: boolean;
  isDoHomework: boolean;
  doHomework: string;
  description: string;
  dueDate: string;
  priority: string;
}
