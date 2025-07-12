export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  role: 'user' | 'admin';
  rating: number;
  completedSwaps: number;
  joinedDate: Date;
  isBanned: boolean;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  rating?: number;
  feedback?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'swap_completed' | 'system';
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'update';
  createdAt: Date;
}