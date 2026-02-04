// Core task interface
export interface Task {
  id: string;
  title: string;
  details: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

// Category configuration
export interface Category {
  id: string;
  label: string;
  color: string;
  icon: string;
}
