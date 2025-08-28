export interface User {
  id: string;
  username: string;
  role: 'husband' | 'wife';
  starBalance: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdBy: string; // user id
  assignedTo: string; // user id
  status: 'pending' | 'completed' | 'evaluated';
  rating?: number; // 1-5 stars
  createdAt: string;
  completedAt?: string;
  evaluatedAt?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  starCost: number;
  createdBy: string; // user id
  createdAt: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  redeemedBy: string; // user id
  redeemedAt: string;
  rating?: number; // 1-5 stars (optional evaluation)
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  theme: 'light' | 'dark';
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CREATE_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CREATE_REWARD'; payload: Omit<Reward, 'id' | 'createdAt'> }
  | { type: 'UPDATE_REWARD'; payload: { id: string; updates: Partial<Reward> } }
  | { type: 'DELETE_REWARD'; payload: string }
  | { type: 'REDEEM_REWARD'; payload: { rewardId: string; userId: string } }
  | { type: 'RATE_REDEMPTION'; payload: { redemptionId: string; rating: number } }
  | { type: 'UPDATE_STAR_BALANCE'; payload: { userId: string; amount: number } }
  | { type: 'RESET_APP' };