import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Star,
  Clock,
  User,
  X,
  Save
} from 'lucide-react';
import { Task } from '../types';

export default function TaskManager() {
  const { user } = useAuth();
  const { state, dispatch } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [evaluatingTask, setEvaluatingTask] = useState<Task | null>(null);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starValue: 1
  });

  const currentUser = state.users.find(u => u.id === user?.id);
  const spouseUser = currentUser?.partnerId ? state.users.find(u => u.id === currentUser.partnerId) : null;

  // Filter tasks
  const myTasks = state.tasks.filter(task => task.assignedTo === user?.id);
  const tasksCreatedByMe = state.tasks.filter(task => task.createdBy === user?.id);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !spouseUser) return;

    dispatch({
      type: 'CREATE_TASK',
      payload: {
        title: formData.title,
        description: formData.description,
        starValue: formData.starValue,
        createdBy: user!.id,
        assignedTo: spouseUser.id,
        status: 'pending'
      }
    });

    setFormData({ title: '', description: '', starValue: 1 });
    setShowCreateForm(false);
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !formData.title.trim()) return;

    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: editingTask.id,
        updates: {
          title: formData.title,
          description: formData.description,
          starValue: formData.starValue
        }
      }
    });

    setEditingTask(null);
    setFormData({ title: '', description: '', starValue: 1 });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    }
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

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      starValue: task.starValue
    });
  };

  const startEvaluation = (task: Task) => {
    setEvaluatingTask(task);
    setRating(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEditTask = (task: Task) => {
    return task.createdBy === user?.id && task.status === 'pending';
  };

  const canCompleteTask = (task: Task) => {
    return task.assignedTo === user?.id && task.status === 'pending';
  };

  const canEvaluateTask = (task: Task) => {
    return task.createdBy === user?.id && task.status === 'completed';
  };

  const getStarsEarned = (task: Task) => {
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Tarefas
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Create/Edit Task Modal */}
      {(showCreateForm || editingTask) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingTask(null);
                  setFormData({ title: '', description: '', starValue: 1 });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingTask ? handleEditTask : handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                  placeholder="Digite o título da tarefa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input h-24 resize-none"
                  placeholder="Descreva a tarefa em detalhes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor em Estrelas
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.starValue}
                  onChange={(e) => setFormData({ ...formData, starValue: parseInt(e.target.value) || 1 })}
                  className="input"
                  required
                  placeholder="Quantas estrelas vale esta tarefa?"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Conclusão: 5 estrelas automáticas + 1-5 pela avaliação
                </p>
              </div>

              {!editingTask && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Esta tarefa será automaticamente atribuída ao seu parceiro ({spouseUser?.role === 'marido' ? 'marido' : 'esposa'}).
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2 flex-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTask ? 'Salvar' : 'Criar Tarefa'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', starValue: 1 });
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

      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks (assigned to me) */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Minhas Tarefas ({myTasks.length})
          </h2>
          
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
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
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {task.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      Vale {task.starValue} estrelas
                    </span>
                  </div>
                  {task.status === 'evaluated' && task.rating && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                      +{getStarsEarned(task)} ⭐ ganhas
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>Criada em {formatDate(task.createdAt)}</span>
                  {task.status === 'evaluated' && task.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span>{task.rating}/5</span>
                    </div>
                  )}
                </div>
                
                {canCompleteTask(task) && (
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="btn-primary flex items-center space-x-2 w-full"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Marcar como Concluída</span>
                  </button>
                )}
              </div>
            ))}
            
            {myTasks.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nenhuma tarefa atribuída a você
              </p>
            )}
          </div>
        </div>

        {/* Tasks Created by Me */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Tarefas Criadas por Mim ({tasksCreatedByMe.length})
          </h2>
          
          <div className="space-y-3">
            {tasksCreatedByMe.map((task) => (
              <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
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
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {task.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      Vale {task.starValue} estrelas
                    </span>
                  </div>
                  {task.status === 'evaluated' && task.rating && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                      +{getStarsEarned(task)} ⭐ ganhas
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span>Criada em {formatDate(task.createdAt)}</span>
                  {task.status === 'evaluated' && task.rating && (
                    <div className="flex items-center space-x-1">
                      <span>Avaliada:</span>
                      {[...Array(task.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {canEvaluateTask(task) && (
                    <button
                      onClick={() => startEvaluation(task)}
                      className="btn-primary flex items-center space-x-2 flex-1"
                    >
                      <Star className="w-4 h-4" />
                      <span>Avaliar</span>
                    </button>
                  )}
                  
                  {canEditTask(task) && (
                    <button
                      onClick={() => startEdit(task)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  )}
                  
                  {canEditTask(task) && (
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn-danger flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {tasksCreatedByMe.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Você ainda não criou nenhuma tarefa
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}