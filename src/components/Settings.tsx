import React, { useState } from 'react';
import { Settings, Palette, Info, RotateCcw, Heart, Copy, Users, Check, Link } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const themes = [
  { id: 'dark', name: 'Escuro', color: 'bg-gray-800' },
  { id: 'light', name: 'Claro', color: 'bg-gray-100' },
  { id: 'blue', name: 'Azul', color: 'bg-blue-600' },
  { id: 'green', name: 'Verde', color: 'bg-green-600' },
  { id: 'purple', name: 'Roxo', color: 'bg-purple-600' }
];

export default function SettingsComponent() {
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

  const handleThemeChange = (theme: string) => {
    dispatch({ type: 'SET_THEME', payload: theme as any });
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'RESET_APP' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
      </div>

      {/* Temas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Tema
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                state.theme === theme.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className={`w-full h-16 rounded-lg ${theme.color} mb-2`} />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {theme.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Conexão do Casal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Conexão do Casal
          </h2>
        </div>

        {partner ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{currentUser?.name}</p>
              </div>
              
              <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
              
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-pink-600" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{partner.name}</p>
              </div>
            </div>
            <p className="text-center text-green-700 dark:text-green-300 mt-4 font-medium">
              Vocês estão conectados como casal! 💕
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enviar Convite */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Convidar Parceiro(a)
              </h3>
              
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
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Usar Código de Convite
              </h3>
              
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
        )}
      </div>

      {/* Informações do App */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sobre o LiStar
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Versão:</span>
            <span className="font-semibold text-gray-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Desenvolvido por:</span>
            <span className="font-semibold text-gray-900 dark:text-white">78douglas</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Última atualização:</span>
            <span className="font-semibold text-gray-900 dark:text-white">Agosto 2025</span>
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <RotateCcw className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Reset de Dados
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Apaga todas as tarefas, recompensas e estatísticas. Esta ação não pode ser desfeita.
        </p>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Resetar Todos os Dados
        </button>
      </div>
    </div>
  );
}