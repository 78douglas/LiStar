import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function useSupabaseSync() {
  const { dispatch } = useApp();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    // Configurar sincronização em tempo real para tarefas
    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `created_by=eq.${user.id},assigned_to=eq.${user.id}`
        }, 
        async (payload) => {
          console.log('Mudança em tarefas:', payload);
          // Recarregar todas as tarefas
          await loadTasks();
        }
      )
      .subscribe();

    // Configurar sincronização em tempo real para recompensas
    const rewardsSubscription = supabase
      .channel('rewards_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rewards',
          filter: `created_by=eq.${user.id}`
        },
        async (payload) => {
          console.log('Mudança em recompensas:', payload);
          await loadRewards();
        }
      )
      .subscribe();

    // Configurar sincronização em tempo real para usuários (saldo de estrelas)
    const usersSubscription = supabase
      .channel('users_changes')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Mudança no usuário:', payload);
          await loadUsers();
        }
      )
      .subscribe();

    // Configurar sincronização em tempo real para resgates
    const redemptionsSubscription = supabase
      .channel('redemptions_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reward_redemptions',
          filter: `redeemed_by=eq.${user.id}`
        },
        async (payload) => {
          console.log('Mudança em resgates:', payload);
          await loadRedemptions();
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
      rewardsSubscription.unsubscribe();
      usersSubscription.unsubscribe();
      redemptionsSubscription.unsubscribe();
    };
  }, [user?.id]);

  // Funções para recarregar dados específicos
  const loadTasks = async () => {
    if (!user?.id) return;

    try {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

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
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const loadRewards = async () => {
    if (!user?.id) return;

    try {
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*')
        .eq('created_by', user.id);

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
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error);
    }
  };

  const loadUsers = async () => {
    if (!user?.coupleCode) return;

    try {
      const { data: coupleUsers } = await supabase
        .from('users')
        .select('*')
        .eq('couple_code', user.coupleCode);

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
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const loadRedemptions = async () => {
    if (!user?.id) return;

    try {
      const { data: redemptions } = await supabase
        .from('reward_redemptions')
        .select('*')
        .eq('redeemed_by', user.id);

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
    } catch (error) {
      console.error('Erro ao carregar resgates:', error);
    }
  };

  return {
    loadTasks,
    loadRewards,
    loadUsers,
    loadRedemptions
  };
}