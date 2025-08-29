import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction, AppContextType, User } from '../types';
import { supabase } from '../lib/supabase';

const initialUsers: User[] = [];

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

function generateCoupleCode(): string {
  return 'CASAL' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    
    case 'LOGOUT':
      return { ...state, currentUser: null };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'SET_REWARDS':
      return { ...state, rewards: action.payload };
    
    case 'SET_REDEMPTIONS':
      return { ...state, redemptions: action.payload };
    
    case 'REGISTER_USER': {
      const userId = generateId();
      const newUser = {
        ...action.payload,
        id: userId,
        starBalance: 0,
        coupleCode: action.payload.coupleCode || generateCoupleCode()
      };
      return { 
        ...state, 
        users: [...state.users, newUser]
      };
    }
    
    case 'REGISTER_AND_LINK_USER': {
      const { username, name, role, coupleCode } = action.payload;
      
      // Encontrar o usuário com o código fornecido
      const partnerUser = state.users.find(u => u.coupleCode === coupleCode);
      if (!partnerUser) {
        return state; // Se não encontrar o parceiro, não cria o usuário
      }
      
      const newUserId = generateId();
      const newUser = {
        id: newUserId,
        username,
        name,
        role,
        starBalance: 0,
        coupleCode, // usar o mesmo código do parceiro
        partnerId: partnerUser.id
      };
      
      // Atualizar o parceiro para incluir o ID do novo usuário
      const updatedUsers = state.users.map(user => 
        user.id === partnerUser.id 
          ? { ...user, partnerId: newUserId }
          : user
      );
      
      return { 
        ...state, 
        users: [...updatedUsers, newUser]
      };
    }
    
    case 'LINK_COUPLE': {
      const { userId, partnerId } = action.payload;
      const updatedUsers = state.users.map(user => {
        if (user.id === userId || user.id === partnerId) {
          return {
            ...user,
            partnerId: user.id === userId ? partnerId : userId
          };
        }
        return user;
      });
      return { ...state, users: updatedUsers };
    }
    
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
      
      // Update star balance based on task status
      let updatedUsers = state.users;
      const task = state.tasks.find(t => t.id === action.payload.id);
      
      if (task) {
        // If task is being completed, give 5 automatic stars
        if (action.payload.updates.status === 'completed') {
          updatedUsers = state.users.map(user =>
            user.id === task.assignedTo
              ? { ...user, starBalance: user.starBalance + 5 }
              : user
          );
        }
        
        // If task is being evaluated, give additional stars based on rating
        if (action.payload.updates.rating && action.payload.updates.status === 'evaluated') {
          // Additional stars based on rating (1-5 stars from evaluation)
          const additionalStars = action.payload.updates.rating;
          updatedUsers = updatedUsers.map(user =>
            user.id === task.assignedTo
              ? { ...user, starBalance: user.starBalance + additionalStars }
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

  // Funções para sincronizar com o Supabase
  const loadUserData = async (userId: string) => {
    try {
      // Carregar parceiro do usuário
      const { data: currentUserData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (currentUserData) {
        // Carregar dados do casal (usuário + parceiro)
        const coupleCode = currentUserData.couple_code;
        const { data: coupleUsers } = await supabase
          .from('users')
          .select('*')
          .eq('couple_code', coupleCode);

        if (coupleUsers) {
          const mappedUsers = coupleUsers.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            starBalance: user.star_balance || 0,
            coupleCode: user.couple_code,
            partnerId: user.partner_id,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at
          }));
          dispatch({ type: 'SET_USERS', payload: mappedUsers });
        }

        // Carregar tarefas do casal
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .or(`created_by.eq.${userId},assigned_to.eq.${userId},created_by.eq.${currentUserData.partner_id},assigned_to.eq.${currentUserData.partner_id}`);

        if (tasks) {
          const mappedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            starValue: task.star_value,
            createdBy: task.created_by,
            assignedTo: task.assigned_to,
            status: task.status,
            rating: task.rating,
            createdAt: task.created_at,
            completedAt: task.completed_at,
            evaluatedAt: task.evaluated_at
          }));
          dispatch({ type: 'SET_TASKS', payload: mappedTasks });
        }

        // Carregar recompensas do casal
        const { data: rewards } = await supabase
          .from('rewards')
          .select('*')
          .or(`created_by.eq.${userId},created_by.eq.${currentUserData.partner_id}`);

        if (rewards) {
          const mappedRewards = rewards.map(reward => ({
            id: reward.id,
            title: reward.title,
            description: reward.description,
            starCost: reward.star_cost,
            createdBy: reward.created_by,
            createdAt: reward.created_at
          }));
          dispatch({ type: 'SET_REWARDS', payload: mappedRewards });
        }

        // Carregar resgates do casal
        const { data: redemptions } = await supabase
          .from('reward_redemptions')
          .select('*')
          .or(`redeemed_by.eq.${userId},redeemed_by.eq.${currentUserData.partner_id}`);

        if (redemptions) {
          const mappedRedemptions = redemptions.map(redemption => ({
            id: redemption.id,
            rewardId: redemption.reward_id,
            redeemedBy: redemption.redeemed_by,
            redeemedAt: redemption.redeemed_at,
            rating: redemption.rating
          }));
          dispatch({ type: 'SET_REDEMPTIONS', payload: mappedRedemptions });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Carregar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme as any });
    }
  }, []);

  // Salvar tema no localStorage
  useEffect(() => {
    localStorage.setItem('appTheme', state.theme);
  }, [state.theme]);

  // Carregar dados quando usuário fizer login
  useEffect(() => {
    if (state.currentUser?.id) {
      loadUserData(state.currentUser.id);
    }
  }, [state.currentUser?.id]);

  // Migrar dados do localStorage antigo para o Supabase (executar apenas uma vez)
  useEffect(() => {
    const migrateLocalStorageData = async () => {
      const hasRun = localStorage.getItem('supabaseMigrated');
      if (hasRun) return;

      const oldData = localStorage.getItem('couplesAppState');
      if (oldData && state.currentUser?.id) {
        try {
          const parsedData = JSON.parse(oldData);
          console.log('Dados antigos encontrados, iniciando migração para Supabase...');
          
          // Migrar tarefas
          if (parsedData.tasks && parsedData.tasks.length > 0) {
            for (const task of parsedData.tasks) {
              await supabase.from('tasks').insert({
                title: task.title,
                description: task.description,
                star_value: task.starValue,
                created_by: state.currentUser.id,
                assigned_to: task.assignedTo || state.currentUser.id,
                status: task.status || 'pending'
              });
            }
          }

          // Migrar recompensas
          if (parsedData.rewards && parsedData.rewards.length > 0) {
            for (const reward of parsedData.rewards) {
              await supabase.from('rewards').insert({
                title: reward.title,
                description: reward.description,
                star_cost: reward.starCost,
                created_by: state.currentUser.id
              });
            }
          }

          localStorage.setItem('supabaseMigrated', 'true');
          console.log('Migração concluída!');
          
          // Recarregar dados após migração
          await loadUserData(state.currentUser.id);
        } catch (error) {
          console.error('Erro na migração:', error);
        }
      }
    };

    if (state.currentUser?.id) {
      migrateLocalStorageData();
    }
  }, [state.currentUser?.id]);

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