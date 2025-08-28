import React from 'react';
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
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { state } = useApp();

  const currentUser = state.users.find(u => u.id === user?.id);
  const spouseUser = state.users.find(u => u.id !== user?.id);

  // Get tasks for current user
  const myTasks = state.tasks.filter(task => task.assignedTo === user?.id);
  const tasksCreatedByMe = state.tasks.filter(task => task.createdBy === user?.id);
  const pendingTasks = myTasks.filter(task => task.status === 'pending');
  const completedTasks = myTasks.filter(task => task.status === 'completed');
  const evaluatedTasks = myTasks.filter(task => task.status === 'evaluated');

  // Get rewards data
  const myRewards = state.rewards.filter(reward => reward.createdBy === user?.id);
  const availableRewards = state.rewards.filter(reward => 
    reward.createdBy !== user?.id && 
    (currentUser?.starBalance || 0) >= reward.starCost
  );

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

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {user?.role === 'husband' ? 'querido' : 'querida'}!
            </h1>
            <p className="text-pink-100">
              Você tem <strong>{pendingTasks.length}</strong> tarefa{pendingTasks.length !== 1 ? 's' : ''} pendente{pendingTasks.length !== 1 ? 's' : ''}
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

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Pendentes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingTasks.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Completadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{evaluatedTasks.length}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recompensas Criadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{myRewards.length}</p>
            </div>
            <Gift className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média de Avaliação</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {evaluatedTasks.length > 0 
                  ? (evaluatedTasks.reduce((sum, task) => sum + (task.rating || 0), 0) / evaluatedTasks.length).toFixed(1)
                  : '-'
                }
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent tasks */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Suas Tarefas Recentes
          </h2>
          <div className="space-y-3">
            {myTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Criada em {formatDate(task.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status === 'evaluated' && task.rating && (
                    <div className="flex items-center">
                      {[...Array(task.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'pending' 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : task.status === 'completed'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.status === 'pending' ? 'Pendente' : 
                     task.status === 'completed' ? 'Aguardando Avaliação' : 'Avaliada'}
                  </span>
                </div>
              </div>
            ))}
            {myTasks.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma tarefa atribuída ainda
              </p>
            )}
          </div>
        </div>

        {/* Available rewards */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Recompensas Disponíveis
          </h2>
          <div className="space-y-3">
            {availableRewards.slice(0, 5).map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{reward.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reward.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="font-medium text-gray-900 dark:text-white">{reward.starCost}</span>
                </div>
              </div>
            ))}
            {availableRewards.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma recompensa disponível no momento
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent redemptions */}
      {recentRedemptions.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Resgates Recentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRedemptions.map((redemption) => {
              const reward = state.rewards.find(r => r.id === redemption.rewardId);
              const isMyRedemption = redemption.redeemedBy === user?.id;
              
              return (
                <div key={redemption.id} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{reward?.title}</h3>
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      {isMyRedemption ? 'Você resgatou' : 'Resgatado pelo seu parceiro'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {formatDate(redemption.redeemedAt)}
                  </p>
                  {redemption.rating && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Avaliação:</span>
                      {[...Array(redemption.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}