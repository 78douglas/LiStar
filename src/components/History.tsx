import React, { useState } from 'react';
import { History, Clock, Star, Gift, CheckCircle, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HistoryComponent() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'tasks' | 'rewards'>('tasks');

  // Filtrar tarefas concluídas e avaliadas
  const completedTasks = state.tasks.filter(task => 
    task.status === 'completed' || task.status === 'evaluated'
  ).sort((a, b) => new Date(b.completedAt || b.createdAt).getTime() - new Date(a.completedAt || a.createdAt).getTime());

  // Histórico de recompensas resgatadas
  const redeemedRewards = state.redemptions.map(redemption => {
    const reward = state.rewards.find(r => r.id === redemption.rewardId);
    const user = state.users.find(u => u.id === redemption.redeemedBy);
    return { ...redemption, reward, user };
  }).sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Histórico
        </h1>
      </div>

      {/* Abas */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold transition-all ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          Tarefas ({completedTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold transition-all ${
            activeTab === 'rewards'
              ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Gift className="w-5 h-5" />
          Recompensas ({redeemedRewards.length})
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhuma tarefa concluída ainda
              </p>
            </div>
          ) : (
            completedTasks.map((task) => {
              const assignee = state.users.find(u => u.id === task.assignedTo);
              const creator = state.users.find(u => u.id === task.createdBy);
              const starsEarned = getStarsEarned(task);

              return (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Criada por:</span>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {creator?.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Executada por:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {assignee?.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-500">Valor:</span>
                          <span className="font-semibold text-yellow-600">
                            {task.starValue} estrelas
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      {task.status === 'evaluated' ? (
                        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          Avaliada
                        </div>
                      ) : (
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          Concluída
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(task.completedAt || task.createdAt)}
                    </div>
                    <div className="flex items-center gap-4">
                      {task.rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < task.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {starsEarned > 0 && (
                        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-semibold">
                          +{starsEarned} ⭐
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="space-y-4">
          {redeemedRewards.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Nenhuma recompensa resgatada ainda
              </p>
            </div>
          ) : (
            redeemedRewards.map((redemption) => (
              <div
                key={redemption.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {redemption.reward?.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {redemption.reward?.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-500">Resgatada por:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {redemption.user?.username}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                      Resgatada
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                      <Star className="w-4 h-4" />
                      {redemption.reward?.starCost}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(redemption.redeemedAt)}
                  </div>
                  {redemption.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < redemption.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}