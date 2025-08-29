import { supabase } from './supabase';
import { Task, Reward, RewardRedemption } from '../types';

// Operações para Tarefas
export const supabaseTasks = {
  async create(task: Omit<Task, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        star_value: task.starValue,
        created_by: task.createdBy,
        assigned_to: task.assignedTo,
        status: task.status || 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Task>) {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.starValue !== undefined) updateData.star_value = updates.starValue;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.completedAt !== undefined) updateData.completed_at = updates.completedAt;
    if (updates.evaluatedAt !== undefined) updateData.evaluated_at = updates.evaluatedAt;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Se a tarefa foi concluída, dar estrelas automáticas
    if (updates.status === 'completed') {
      await supabaseUsers.updateStarBalance(updates.assignedTo!, 5);
    }

    // Se a tarefa foi avaliada, dar estrelas adicionais baseadas na avaliação
    if (updates.rating && updates.status === 'evaluated') {
      await supabaseUsers.updateStarBalance(updates.assignedTo!, updates.rating);
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Operações para Recompensas
export const supabaseRewards = {
  async create(reward: Omit<Reward, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        title: reward.title,
        description: reward.description,
        star_cost: reward.starCost,
        created_by: reward.createdBy
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Reward>) {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.starCost !== undefined) updateData.star_cost = updates.starCost;

    const { data, error } = await supabase
      .from('rewards')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Operações para Resgates
export const supabaseRedemptions = {
  async create(redemption: { rewardId: string; redeemedBy: string }) {
    // Primeiro, verificar se o usuário tem estrelas suficientes
    const { data: reward } = await supabase
      .from('rewards')
      .select('star_cost')
      .eq('id', redemption.rewardId)
      .single();

    if (!reward) throw new Error('Recompensa não encontrada');

    const { data: user } = await supabase
      .from('users')
      .select('star_balance')
      .eq('id', redemption.redeemedBy)
      .single();

    if (!user) throw new Error('Usuário não encontrado');
    if (user.star_balance < reward.star_cost) {
      throw new Error('Estrelas insuficientes');
    }

    // Criar o resgate
    const { data, error } = await supabase
      .from('reward_redemptions')
      .insert({
        reward_id: redemption.rewardId,
        redeemed_by: redemption.redeemedBy
      })
      .select()
      .single();

    if (error) throw error;

    // Debitar as estrelas
    await supabaseUsers.updateStarBalance(redemption.redeemedBy, -reward.star_cost);

    return data;
  },

  async rate(redemptionId: string, rating: number) {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .update({ rating })
      .eq('id', redemptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Operações para Usuários
export const supabaseUsers = {
  async updateStarBalance(userId: string, amount: number) {
    // Buscar saldo atual
    const { data: currentUser } = await supabase
      .from('users')
      .select('star_balance')
      .eq('id', userId)
      .single();

    if (!currentUser) throw new Error('Usuário não encontrado');

    const newBalance = (currentUser.star_balance || 0) + amount;

    const { data, error } = await supabase
      .from('users')
      .update({ star_balance: newBalance })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};