export interface User {
  id: string;
  username: string;
  name: string; // Será o mesmo que username
  role: 'marido' | 'esposa';
  starBalance: number;
  coupleCode?: string; // Código para vincular casais
  partnerId?: string; // ID do parceiro vinculado
  email?: string; // Email do Supabase Auth
  created_at?: string; // Timestamp de criação
  updated_at?: string; // Timestamp de atualização
}

export interface Task {
  id: string;
  title: string;
  description: string;
  starValue: number; // Estrelas que a tarefa vale
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
  theme: 'light' | 'dark' | 'blue' | 'green' | 'purple';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string, role: 'marido' | 'esposa', coupleCode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'blue' | 'green' | 'purple' }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_USER'; payload: Omit<User, 'id' | 'starBalance'> & { coupleCode?: string } }
  | { type: 'REGISTER_AND_LINK_USER'; payload: { username: string; name: string; role: 'marido' | 'esposa'; coupleCode: string } }
  | { type: 'LINK_COUPLE'; payload: { userId: string; partnerId: string } }
  | { type: 'CREATE_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CREATE_REWARD'; payload: Omit<Reward, 'id' | 'createdAt'> }
  | { type: 'UPDATE_REWARD'; payload: { id: string; updates: Partial<Reward> } }
  | { type: 'DELETE_REWARD'; payload: string }
  | { type: 'REDEEM_REWARD'; payload: { rewardId: string; userId: string } }
  | { type: 'RATE_REDEMPTION'; payload: { redemptionId: string; rating: number } }
  | { type: 'UPDATE_STAR_BALANCE'; payload: { userId: string; amount: number } }
  | { type: 'RESET_APP' }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'SET_REDEMPTIONS'; payload: RewardRedemption[] };

// Types para as tabelas do Supabase Database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'createdAt'>;
        Update: Partial<Omit<Task, 'id' | 'createdAt'>>;
      };
      rewards: {
        Row: Reward;
        Insert: Omit<Reward, 'id' | 'createdAt'>;
        Update: Partial<Omit<Reward, 'id' | 'createdAt'>>;
      };
      reward_redemptions: {
        Row: RewardRedemption;
        Insert: Omit<RewardRedemption, 'id'>;
        Update: Partial<Omit<RewardRedemption, 'id'>>;
      };
    };
  };
}