import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Heart, Copy, Link, Users, Check } from 'lucide-react';

export default function CoupleInvite() {
  const { user } = useAuth();
  const { state, dispatch } = useApp();
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = state.users.find(u => u.id === user?.id);
  const partner = currentUser?.partnerId ? state.users.find(u => u.id === currentUser.partnerId) : null;

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?invite=${currentUser?.coupleCode}`;
  };

  const copyInviteLink = async () => {
    const link = generateInviteLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  const handleJoinCouple = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inviteCode.trim()) {
      setError('Digite o código do casal');
      return;
    }

    const invitingUser = state.users.find(u => u.coupleCode === inviteCode.trim());
    
    if (!invitingUser) {
      setError('Código inválido');
      return;
    }

    if (invitingUser.id === user?.id) {
      setError('Você não pode se convidar!');
      return;
    }

    // Vincular os usuários
    dispatch({
      type: 'LINK_COUPLE',
      payload: {
        userId: user!.id,
        partnerId: invitingUser.id
      }
    });

    setSuccess('Casal vinculado com sucesso!');
    setInviteCode('');
  };

  if (partner) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Casal Conectado
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vocês já estão vinculados como casal!
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">{currentUser?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser?.role}</p>
            </div>
            
            <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">{partner.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{partner.role}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" fill="currentColor" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Conectar Casal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Convide seu parceiro(a) ou use um código de convite
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enviar Convite */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Convidar Parceiro(a)
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seu Código do Casal
              </label>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg font-mono text-center text-lg font-bold">
                {currentUser?.coupleCode}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link de Convite
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={generateInviteLink()}
                  readOnly
                  className="input flex-1 text-sm"
                />
                <button
                  onClick={copyInviteLink}
                  className="btn-primary flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Compartilhe o código <strong>{currentUser?.coupleCode}</strong> ou o link com seu parceiro(a) para que possam se conectar.
              </p>
            </div>
          </div>
        </div>

        {/* Aceitar Convite */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Usar Código de Convite
          </h2>
          
          <form onSubmit={handleJoinCouple} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código do Casal
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="input"
                placeholder="CASAL123ABC"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Conectar ao Casal</span>
            </button>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-md">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}