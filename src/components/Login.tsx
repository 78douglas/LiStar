import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Lock, Mail, UserPlus, Loader2 } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'marido' as 'marido' | 'esposa',
    coupleCode: '' // Campo opcional para vincular ao casal
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [emailForResend, setEmailForResend] = useState('');
  const { login, register, loading, resendConfirmation } = useAuth();

  // Verificar se há código de convite na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode) {
      setSuccess(`Código de convite detectado: ${inviteCode}. Registre-se para se conectar!`);
      setFormData(prev => ({ ...prev, coupleCode: inviteCode }));
      setIsLogin(false); // Mudar para modo de registro
    }
  }, []);

  const handleResendEmail = async () => {
    if (!emailForResend) {
      setError('Digite o email para reenviar a confirmação');
      return;
    }
    
    const result = await resendConfirmation(emailForResend);
    
    if (result.success) {
      setSuccess('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      setShowResendEmail(false);
      setEmailForResend('');
    } else {
      setError(result.error || 'Erro ao reenviar email');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResendEmail(false);
    
    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios');
      return;
    }
    
    console.log('Tentando fazer login...');
    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      console.error('Falha no login:', result.error);
      setError(result.error || 'Erro ao fazer login');
      
      // Se der erro de credenciais, mostrar opção de reenvio
      if (result.error?.includes('Email ou senha incorretos') || result.error?.includes('confirme seu email')) {
        setShowResendEmail(true);
        setEmailForResend(formData.email);
      }
    } else {
      console.log('Login bem-sucedido!');
      // O usuário será redirecionado automaticamente pelo AuthContext
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.email || !formData.username || !formData.password) {
      setError('Email, nome de usuário e senha são obrigatórios');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    console.log('Tentando fazer cadastro...');
    const result = await register(
      formData.email, 
      formData.password, 
      formData.username, 
      formData.role, 
      formData.coupleCode || undefined
    );
    
    if (result.success) {
      console.log('Cadastro bem-sucedido!');
      if (formData.coupleCode) {
        setSuccess('Usuário registrado e vinculado ao casal com sucesso! Verifique seu email para confirmar a conta.');
      } else {
        setSuccess('Usuário registrado com sucesso! Verifique seu email para confirmar a conta.');
      }
      setFormData({ email: '', username: '', password: '', role: 'marido', coupleCode: '' });
      setTimeout(() => setIsLogin(true), 3000);
    } else {
      console.error('Falha no cadastro:', result.error);
      setError(result.error || 'Erro ao registrar usuário');
    }
  };

  const resetForm = () => {
    setFormData({ email: '', username: '', password: '', role: 'marido', coupleCode: '' });
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            LiStar
          </h1>
          <p className="text-white/80">
            Transforme tarefas domésticas em diversão!
          </p>
        </div>

        <div className="card bg-white/90 backdrop-blur">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                isLogin 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
                !isLogin 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Registrar
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="seu@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10"
                    placeholder="Digite sua senha"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="register-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="seu@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="register-username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input pl-10"
                    placeholder="Escolha um nome de usuário"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="register-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10"
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função no Casal
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="marido"
                      checked={formData.role === 'marido'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'marido' | 'esposa' })}
                      className="mr-2"
                      disabled={loading}
                    />
                    Marido
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="esposa"
                      checked={formData.role === 'esposa'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'marido' | 'esposa' })}
                      className="mr-2"
                      disabled={loading}
                    />
                    Esposa
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="couple-code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código do Casal (opcional)
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="couple-code"
                    type="text"
                    value={formData.coupleCode}
                    onChange={(e) => setFormData({ ...formData, coupleCode: e.target.value.toUpperCase() })}
                    className="input pl-10"
                    placeholder="CASAL123ABC (deixe em branco para gerar novo)"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Se você tem o código do seu parceiro, digite aqui para se conectar automaticamente
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Registrando...
                  </>
                ) : (
                  'Registrar'
                )}
              </button>
            </form>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mt-4">
              {error}
              {showResendEmail && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-sm mb-2">Não recebeu o email de confirmação?</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailForResend}
                      onChange={(e) => setEmailForResend(e.target.value)}
                      placeholder="Digite seu email"
                      className="flex-1 px-3 py-1 text-sm border border-red-300 rounded focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={handleResendEmail}
                      disabled={loading}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Reenviar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mt-4">
              {success}
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={switchMode}
              disabled={loading}
              className="text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50"
            >
              {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}