import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star,
  Gift,
  ShoppingBag,
  X,
  Save,
  Heart
} from 'lucide-react';
import { Reward } from '../types';

export default function RewardManager() {
  const { user } = useAuth();
  const { state, dispatch } = useApp();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [ratingRedemption, setRatingRedemption] = useState<string | null>(null);
  const [redemptionRating, setRedemptionRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starCost: 1
  });

  const currentUser = state.users.find(u => u.id === user?.id);
  const spouseUser = currentUser?.partnerId ? state.users.find(u => u.id === currentUser.partnerId) : null;

  // Filter rewards
  const myRewards = state.rewards.filter(reward => reward.createdBy === user?.id);
  const availableRewards = state.rewards.filter(reward => {
    const isCreatedByPartner = spouseUser && reward.createdBy === spouseUser.id;
    const hasStarsToRedeem = (currentUser?.starBalance || 0) >= reward.starCost;
    const notAlreadyRedeemed = !state.redemptions.some(redemption => redemption.rewardId === reward.id);
    return isCreatedByPartner && hasStarsToRedeem && notAlreadyRedeemed;
  });
  const unavailableRewards = state.rewards.filter(reward => {
    const isCreatedByPartner = spouseUser && reward.createdBy === spouseUser.id;
    const notEnoughStars = (currentUser?.starBalance || 0) < reward.starCost;
    const alreadyRedeemed = state.redemptions.some(redemption => redemption.rewardId === reward.id);
    return isCreatedByPartner && (notEnoughStars || alreadyRedeemed);
  });

  // Get redemptions
  const myRedemptions = state.redemptions.filter(r => r.redeemedBy === user?.id);
  const spouseRedemptions = state.redemptions.filter(r => 
    state.rewards.find(reward => reward.id === r.rewardId)?.createdBy === user?.id
  );

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    dispatch({
      type: 'CREATE_REWARD',
      payload: {
        title: formData.title,
        description: formData.description,
        starCost: formData.starCost,
        createdBy: user!.id
      }
    });

    setFormData({ title: '', description: '', starCost: 1 });
    setShowCreateForm(false);
  };

  const handleEditReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReward || !formData.title.trim()) return;

    dispatch({
      type: 'UPDATE_REWARD',
      payload: {
        id: editingReward.id,
        updates: {
          title: formData.title,
          description: formData.description,
          starCost: formData.starCost
        }
      }
    });

    setEditingReward(null);
    setFormData({ title: '', description: '', starCost: 1 });
  };

  const handleDeleteReward = (rewardId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta recompensa?')) {
      dispatch({ type: 'DELETE_REWARD', payload: rewardId });
    }
  };

  const handleRedeemReward = (rewardId: string) => {
    const reward = state.rewards.find(r => r.id === rewardId);
    if (!reward || !currentUser) return;

    if (currentUser.starBalance < reward.starCost) {
      alert('Você não tem estrelas suficientes para resgatar esta recompensa!');
      return;
    }

    if (window.confirm(`Resgatar "${reward.title}" por ${reward.starCost} estrelas?`)) {
      dispatch({
        type: 'REDEEM_REWARD',
        payload: {
          rewardId: rewardId,
          userId: user!.id
        }
      });
    }
  };

  const handleRateRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingRedemption || redemptionRating === 0) return;

    dispatch({
      type: 'RATE_REDEMPTION',
      payload: {
        redemptionId: ratingRedemption,
        rating: redemptionRating
      }
    });

    setRatingRedemption(null);
    setRedemptionRating(0);
  };

  const startEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      starCost: reward.starCost
    });
  };

  const startRating = (redemptionId: string) => {
    setRatingRedemption(redemptionId);
    setRedemptionRating(0);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Recompensas
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Recompensa</span>
        </button>
      </div>

      {/* Star Balance */}
      <div className="card bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Seu Saldo de Estrelas</h2>
            <p className="text-yellow-100">
              Use suas estrelas para resgatar recompensas criadas pelo seu parceiro
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8" fill="currentColor" />
              <span className="text-3xl font-bold">{currentUser?.starBalance || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Reward Modal */}
      {(showCreateForm || editingReward) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingReward ? 'Editar Recompensa' : 'Nova Recompensa'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingReward(null);
                  setFormData({ title: '', description: '', starCost: 1 });
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingReward ? handleEditReward : handleCreateReward} className="space-y-4">
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
                  placeholder="Digite o título da recompensa"
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
                  placeholder="Descreva a recompensa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custo em Estrelas
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.starCost}
                  onChange={(e) => setFormData({ ...formData, starCost: parseInt(e.target.value) || 1 })}
                  className="input"
                  required
                />
              </div>

              {!editingReward && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Esta recompensa poderá ser resgatada pelo seu parceiro ({spouseUser?.role === 'marido' ? 'marido' : 'esposa'}).
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2 flex-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingReward ? 'Salvar' : 'Criar Recompensa'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingReward(null);
                    setFormData({ title: '', description: '', starCost: 1 });
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

      {/* Rating Modal */}
      {ratingRedemption && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Avaliar Recompensa
              </h2>
              <button
                onClick={() => {
                  setRatingRedemption(null);
                  setRedemptionRating(0);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRateRedemption} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Como você avalia esta recompensa? (1-5 estrelas)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRedemptionRating(star)}
                      className={`star text-2xl ${star <= redemptionRating ? 'filled' : ''}`}
                    >
                      <Star className="w-8 h-8" fill={star <= redemptionRating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={redemptionRating === 0}
                  className="btn-primary flex items-center space-x-2 flex-1 disabled:opacity-50"
                >
                  <Star className="w-4 h-4" />
                  <span>Avaliar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRatingRedemption(null);
                    setRedemptionRating(0);
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
        {/* Available Rewards */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Recompensas Disponíveis ({availableRewards.length})
            </h2>
            
            <div className="space-y-3">
              {availableRewards.map((reward) => (
                <div key={reward.id} className="border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{reward.title}</h3>
                    <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        {reward.starCost}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {reward.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Criada em {formatDate(reward.createdAt)}
                    </span>
                    <button
                      onClick={() => handleRedeemReward(reward.id)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Resgatar</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {availableRewards.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhuma recompensa disponível para resgate
                </p>
              )}
            </div>
          </div>

          {/* Unavailable Rewards */}
          {unavailableRewards.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-gray-400" />
                Recompensas Indisponíveis ({unavailableRewards.length})
              </h2>
              
              <div className="space-y-3">
                {unavailableRewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 opacity-60">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{reward.title}</h3>
                      <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-gray-500" fill="currentColor" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {reward.starCost}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {reward.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      {state.redemptions.some(redemption => redemption.rewardId === reward.id) ? (
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          Já resgatada
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Estrelas insuficientes
                        </span>
                      )}
                      {!state.redemptions.some(redemption => redemption.rewardId === reward.id) && (
                        <span className="text-sm text-red-600 dark:text-red-400">
                          Precisa de {reward.starCost - (currentUser?.starBalance || 0)} estrelas
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* My Rewards */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Minhas Recompensas ({myRewards.length})
          </h2>
          
          <div className="space-y-3">
            {myRewards.map((reward) => (
              <div key={reward.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{reward.title}</h3>
                  <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {reward.starCost}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {reward.description}
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Criada em {formatDate(reward.createdAt)}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEdit(reward)}
                    className="btn-secondary flex items-center space-x-2 flex-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="btn-danger flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
            
            {myRewards.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Você ainda não criou nenhuma recompensa
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Redemption History */}
      {(myRedemptions.length > 0 || spouseRedemptions.length > 0) && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Histórico de Resgates
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Redemptions */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Meus Resgates ({myRedemptions.length})
              </h3>
              <div className="space-y-3">
                {myRedemptions.map((redemption) => {
                  const reward = state.rewards.find(r => r.id === redemption.rewardId);
                  return (
                    <div key={redemption.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-medium text-gray-900 dark:text-white">{reward?.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Resgatado em {formatDate(redemption.redeemedAt)}
                      </p>
                      
                      {redemption.rating ? (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Sua avaliação:</span>
                          {[...Array(redemption.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          ))}
                        </div>
                      ) : (
                        <button
                          onClick={() => startRating(redemption.id)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Avaliar recompensa
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spouse Redemptions */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Resgates do Parceiro ({spouseRedemptions.length})
              </h3>
              <div className="space-y-3">
                {spouseRedemptions.map((redemption) => {
                  const reward = state.rewards.find(r => r.id === redemption.rewardId);
                  return (
                    <div key={redemption.id} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-medium text-gray-900 dark:text-white">{reward?.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Resgatado em {formatDate(redemption.redeemedAt)}
                      </p>
                      
                      {redemption.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Avaliação recebida:</span>
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
          </div>
        </div>
      )}
    </div>
  );
}