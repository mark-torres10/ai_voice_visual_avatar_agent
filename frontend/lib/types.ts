// API Response types
export interface VideoResponse {
  taskId: string;
  videoUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  script?: string;
  estimatedTime?: number;
}

export interface StatusResponse {
  taskId: string;
  status: 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
}

// UI Component types
export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'system';
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}