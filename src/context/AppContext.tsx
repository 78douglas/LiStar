import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, AppContextType, User } from '../types';

const initialUsers: User[] = [
  { id: 'husband', username: 'husband', role: 'husband', starBalance: 0 },
  { id: 'wife', username: 'wife', role: 'wife', starBalance: 0 }
];

const initialState: AppState = {
  currentUser: null,
  users: initialUsers,
  tasks: [],
  rewards: [],
  redemptions: [],
  theme: 'dark'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    
    case 'LOGOUT':
      return { ...state, currentUser: null };
    
    case 'CREATE_TASK': {
      const newTask = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }
    
    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      );
      
      // If task is being evaluated, update star balance
      let updatedUsers = state.users;
      if (action.payload.updates.rating && action.payload.updates.status === 'evaluated') {
        const task = state.tasks.find(t => t.id === action.payload.id);
        if (task) {
          updatedUsers = state.users.map(user =>
            user.id === task.assignedTo
              ? { ...user, starBalance: user.starBalance + action.payload.updates.rating! }
              : user
          );
        }
      }
      
      return { ...state, tasks: updatedTasks, users: updatedUsers };
    }
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    
    case 'CREATE_REWARD': {
      const newReward = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      return { ...state, rewards: [...state.rewards, newReward] };
    }
    
    case 'UPDATE_REWARD':
      return {
        ...state,
        rewards: state.rewards.map(reward =>
          reward.id === action.payload.id
            ? { ...reward, ...action.payload.updates }
            : reward
        )
      };
    
    case 'DELETE_REWARD':
      return {
        ...state,
        rewards: state.rewards.filter(reward => reward.id !== action.payload)
      };
    
    case 'REDEEM_REWARD': {
      const reward = state.rewards.find(r => r.id === action.payload.rewardId);
      if (!reward) return state;
      
      const newRedemption = {
        id: generateId(),
        rewardId: action.payload.rewardId,
        redeemedBy: action.payload.userId,
        redeemedAt: new Date().toISOString()
      };
      
      const updatedUsers = state.users.map(user =>
        user.id === action.payload.userId
          ? { ...user, starBalance: user.starBalance - reward.starCost }
          : user
      );
      
      return {
        ...state,
        redemptions: [...state.redemptions, newRedemption],
        users: updatedUsers
      };
    }
    
    case 'RATE_REDEMPTION':
      return {
        ...state,
        redemptions: state.redemptions.map(redemption =>
          redemption.id === action.payload.redemptionId
            ? { ...redemption, rating: action.payload.rating }
            : redemption
        )
      };
    
    case 'UPDATE_STAR_BALANCE':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, starBalance: user.starBalance + action.payload.amount }
            : user
        )
      };
    
    case 'RESET_APP':
      return {
        ...initialState,
        currentUser: state.currentUser,
        theme: state.theme
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('couplesAppState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Restore each part of the state
        if (parsedState.users) {
          parsedState.users.forEach((user: User) => {
            dispatch({ type: 'UPDATE_STAR_BALANCE', payload: { userId: user.id, amount: user.starBalance } });
          });
        }
        if (parsedState.tasks) {
          parsedState.tasks.forEach((task: any) => {
            dispatch({ type: 'CREATE_TASK', payload: task });
          });
        }
        if (parsedState.rewards) {
          parsedState.rewards.forEach((reward: any) => {
            dispatch({ type: 'CREATE_REWARD', payload: reward });
          });
        }
        if (parsedState.theme) {
          dispatch({ type: 'SET_THEME', payload: parsedState.theme });
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('couplesAppState', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}