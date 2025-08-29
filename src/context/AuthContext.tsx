import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { supabase } from '../lib/supabase';
import { useApp } from './AppContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há uma sessão ativa ao carregar
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session check:', { session: !!session, error });
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Sessão encontrada, carregando perfil...');
          await loadUserProfile(session.user.id);
        } else {
          console.log('Nenhuma sessão ativa');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', { event, session: !!session });
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('Usuário fez login, carregando perfil...');
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('Usuário fez logout');
        setUser(null);
        dispatch({ type: 'LOGOUT' });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Carregar perfil do usuário do banco
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil do usuário:', userId);
      
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        // Se o perfil não existe, o usuário pode ter acabado de se cadastrar
        // Vamos aguardar um pouco e tentar novamente
        if (error.code === 'PGRST116') {
          console.log('Perfil não encontrado, aguardando...');
          setTimeout(() => loadUserProfile(userId), 2000);
        }
        return;
      }

      if (userProfile) {
        console.log('Perfil carregado com sucesso:', userProfile);
        
        const mappedUser: User = {
          id: userProfile.id,
          username: userProfile.username,
          name: userProfile.name,
          role: userProfile.role,
          starBalance: userProfile.star_balance || 0,
          coupleCode: userProfile.couple_code,
          partnerId: userProfile.partner_id,
          email: userProfile.email,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at
        };
        
        setUser(mappedUser);
        dispatch({ type: 'LOGIN', payload: mappedUser });
        console.log('Usuário logado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        
        // Verificar se é problema de email não confirmado
        if (error.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Email ou senha incorretos. Se você acabou de se cadastrar, verifique se confirmou seu email.' 
          };
        }
        
        if (error.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.' 
          };
        }
        
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login bem-sucedido, carregando perfil...');
        // Não precisamos chamar loadUserProfile aqui, o onAuthStateChange vai fazer isso
        return { success: true };
      }

      return { success: false, error: 'Falha no login' };
    } catch (error: any) {
      console.error('Erro durante login:', error);
      return { success: false, error: error.message || 'Erro inesperado' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    username: string, 
    role: 'marido' | 'esposa', 
    coupleCode?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      console.log('Iniciando cadastro...', { email, username, role, coupleCode });

      // Verificar se o username já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        console.log('Username já existe');
        return { success: false, error: 'Nome de usuário já existe' };
      }

      // Criar conta no Supabase Auth
      console.log('Criando conta no Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('Erro ao criar conta:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        console.error('Falha ao criar conta: usuário não retornado');
        return { success: false, error: 'Falha ao criar conta' };
      }

      console.log('Conta criada com sucesso:', authData.user.id);

      // Preparar dados do perfil
      let profileData: any = {
        id: authData.user.id,
        username,
        name: username,
        role,
        star_balance: 0,
        email
      };

      // Se tem código do casal, verificar e vincular
      if (coupleCode) {
        console.log('Verificando código do casal:', coupleCode);
        const { data: partnerUser } = await supabase
          .from('users')
          .select('*')
          .eq('couple_code', coupleCode)
          .single();

        if (!partnerUser) {
          console.log('Código do casal não encontrado');
          return { success: false, error: 'Código do casal não encontrado' };
        }

        profileData.couple_code = coupleCode;
        profileData.partner_id = partnerUser.id;
        console.log('Parceiro encontrado:', partnerUser.id);
      } else {
        // Gerar novo código do casal
        profileData.couple_code = 'CASAL' + Math.random().toString(36).substr(2, 6).toUpperCase();
        console.log('Novo código gerado:', profileData.couple_code);
      }

      // Criar perfil na tabela users
      console.log('Criando perfil na tabela users...', profileData);
      const { error: profileError } = await supabase
        .from('users')
        .insert([profileData]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        return { success: false, error: 'Erro ao criar perfil: ' + profileError.message };
      }

      console.log('Perfil criado com sucesso!');

      // Se tem parceiro, atualizar a vinculação
      if (coupleCode && profileData.partner_id) {
        console.log('Atualizando vinculação do parceiro...');
        await supabase
          .from('users')
          .update({ partner_id: authData.user.id })
          .eq('id', profileData.partner_id);
      }

      // Aguardar um pouco para o perfil ser inserido
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Cadastro concluído com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro durante cadastro:', error);
      return { success: false, error: error.message || 'Erro inesperado' };
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      console.log('Reenviando email de confirmação para:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('Erro ao reenviar email:', error);
        return { success: false, error: error.message };
      }

      console.log('Email de confirmação reenviado com sucesso!');
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error);
      return { success: false, error: error.message || 'Erro inesperado' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resendConfirmation }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}