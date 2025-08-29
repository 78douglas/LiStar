import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Gift, 
  Star, 
  Clock, 
  Award,
  Heart,
  TrendingUp,
  Calendar,
  CheckCircle,
  X
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { state, dispatch } = useApp();
  const [evaluatingTask, setEvaluatingTask] = useState<any>(null);
  const [rating, setRating] = useState(0);

  const currentUser = state.users.find(u => u.id === user?.id);
  const spouseUser = currentUser?.partnerId ? state.users.find(u => u.id === currentUser.partnerId) : null;

  // Get tasks for current user
  const myTasks = state.tasks.filter(task => task.assignedTo === user?.id);
  const tasksCreatedByMe = state.tasks.filter(task => task.createdBy === user?.id);
  const pendingTasks = myTasks.filter(task => task.status === 'pending');
  const completedTasks = myTasks.filter(task => task.status === 'completed');
  const evaluatedTasks = myTasks.filter(task => task.status === 'evaluated');

  // Tasks created by me that need evaluation
  const tasksToEvaluate = tasksCreatedByMe.filter(task => task.status === 'completed');

  // Get rewards data
  const myRewards = state.rewards.filter(reward => reward.createdBy === user?.id);
  const availableRewards = state.rewards.filter(reward => {
    const isCreatedByPartner = spouseUser && reward.createdBy === spouseUser.id;
    const hasStarsToRedeem = (currentUser?.starBalance || 0) >= reward.starCost;
    const notAlreadyRedeemed = !state.redemptions.some(redemption => redemption.rewardId === reward.id);
    return isCreatedByPartner && hasStarsToRedeem && notAlreadyRedeemed;
  });

  // Get recent redemptions
  const recentRedemptions = state.redemptions
    .filter(redemption => 
      redemption.redeemedBy === user?.id || 
      state.rewards.find(r => r.id === redemption.rewardId)?.createdBy === user?.id
    )
    .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime())
    .slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCompleteTask = (taskId: string) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: taskId,
        updates: {
          status: 'completed',
          completedAt: new Date().toISOString()
        }
      }
    });
  };

  const handleEvaluateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingTask || rating === 0) return;

    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: evaluatingTask.id,
        updates: {
          status: 'evaluated',
          rating: rating,
          evaluatedAt: new Date().toISOString()
        }
      }
    });

    setEvaluatingTask(null);
    setRating(0);
  };

  const handleRedeemReward = (rewardId: string) => {
    if (!user) return;
    
    const reward = state.rewards.find(r => r.id === rewardId);
    if (!reward || (currentUser?.starBalance || 0) < reward.starCost) return;

    if (confirm(`Deseja resgatar "${reward.title}" por ${reward.starCost} estrelas?`)) {
      dispatch({
        type: 'REDEEM_REWARD',
        payload: {
          rewardId: rewardId,
          userId: user.id
        }
      });
    }
  };

  const getStarsEarned = (task: any) => {
    let totalStars = 0;
    
    // 5 estrelas automáticas por conclusão
    if (task.status === 'completed' || task.status === 'evaluated') {
      totalStars += 5;
    }
    
    // Estrelas adicionais pela avaliação (1-5)
    if (task.status === 'evaluated' && task.rating) {
      totalStars += task.rating;
    }
    
    return totalStars;
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {user?.role === 'marido' ? 'querido' : 'querida'}!
            </h1>
            <p className="text-pink-100">
              Você tem <strong>{pendingTasks.length}</strong> tarefa{pendingTasks.length !== 1 ? 's' : ''} pendente{pendingTasks.length !== 1 ? 's' : ''}
              {tasksToEvaluate.length > 0 && (
                <> e <strong>{tasksToEvaluate.length}</strong> para avaliar</>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-6 h-6" fill="currentColor" />
              <span className="text-2xl font-bold">{currentUser?.starBalance || 0}</span>
            </div>
            <p className="text-pink-100 text-sm">Estrelas disponíveis</p>
          </div>
        </div>
      </div>

      {/* Estatísticas resumidas */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Resumo de Atividades
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{pendingTasks.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Pendentes</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckSquare className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{evaluatedTasks.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Completadas</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Gift className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{myRewards.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recompensas Criadas</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {evaluatedTasks.length > 0 
                ? (evaluatedTasks.reduce((sum, task) => sum + (task.rating || 0), 0) / evaluatedTasks.length).toFixed(1)
                : '-'
              }
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Média de Avaliação</p>
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {evaluatingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Avaliar Tarefa
              </h2>
              <button
                onClick={() => {
                  setEvaluatingTask(null);
                  setRating(0);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {evaluatingTask.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {evaluatingTask.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  Vale {evaluatingTask.starValue} estrelas
                </span>
              </div>
            </div>

            <form onSubmit={handleEvaluateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avaliação (1-5 estrelas)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      <Star className="w-8 h-8" fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Estrelas adicionais pela avaliação: {rating} ⭐ (+ 5 automáticas = {5 + rating} total)
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={rating === 0}
                  className="btn-primary flex items-center space-x-2 flex-1 disabled:opacity-50"
                >
                  <Star className="w-4 h-4" />
                  <span>Avaliar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEvaluatingTask(null);
                    setRating(0);
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Minhas tarefas pendentes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Suas Tarefas Pendentes ({pendingTasks.length})
          </h2>
          <div className="space-y-3">
            {pendingTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {task.starValue}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {task.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Criada em {formatDate(task.createdAt)}
                  </span>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Concluir</span>
                  </button>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma tarefa pendente
              </p>
            )}
          </div>
        </div>

        {/* Tarefas para avaliar */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Tarefas para Avaliar ({tasksToEvaluate.length})
          </h2>
          <div className="space-y-3">
            {tasksToEvaluate.slice(0, 5).map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {task.starValue}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {task.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Concluída em {task.completedAt ? formatDate(task.completedAt) : '-'}
                  </span>
                  <button
                    onClick={() => setEvaluatingTask(task)}
                    className="btn-primary flex items-center space-x-2 text-sm"
                  >
                    <Star className="w-4 h-4" />
                    <span>Avaliar</span>
                  </button>
                </div>
              </div>
            ))}
            {tasksToEvaluate.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma tarefa para avaliar
              </p>
            )}
          </div>
        </div>

        {/* Recompensas disponíveis */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Recompensas Disponíveis ({availableRewards.length})
          </h2>
          <div className="space-y-3">
            {availableRewards.slice(0, 5).map((reward) => (
              <div key={reward.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{reward.title}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {reward.starCost}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {reward.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Criada em {formatDate(reward.createdAt)}
                  </span>
                  <button
                    onClick={() => handleRedeemReward(reward.id)}
                    disabled={(currentUser?.starBalance || 0) < reward.starCost}
                    className="btn-primary flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Resgatar</span>
                  </button>
                </div>
              </div>
            ))}
            {availableRewards.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma recompensa disponível
              </p>
            )}
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Estatísticas do Mês
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Tarefas executadas:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{evaluatedTasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Estrelas ganhas:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {evaluatedTasks.reduce((total, task) => total + getStarsEarned(task), 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Recompensas resgatadas:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {state.redemptions.filter(r => r.redeemedBy === user?.id).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Parceria com:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {spouseUser ? spouseUser.name : 'Nenhum parceiro conectado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}