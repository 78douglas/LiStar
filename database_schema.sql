-- Schema para o banco de dados do App de Casais
-- Execute este SQL no Supabase SQL Editor

-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários (perfis)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('marido', 'esposa')),
    star_balance INTEGER DEFAULT 0,
    couple_code TEXT,
    partner_id UUID REFERENCES public.users(id),
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    star_value INTEGER NOT NULL DEFAULT 5,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'evaluated')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    evaluated_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de recompensas
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    star_cost INTEGER NOT NULL,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de resgates de recompensas
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    redeemed_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Função para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários - podem ver e editar apenas seus próprios dados e do parceiro
CREATE POLICY "Usuários podem ver seus próprios dados e do parceiro" ON public.users
    FOR SELECT USING (
        auth.uid()::text = id::text OR 
        auth.uid()::text = partner_id::text OR
        id::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text)
    );

CREATE POLICY "Usuários podem atualizar seus próprios dados" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Permitir inserção de novos usuários" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Políticas para tarefas - usuários podem ver tarefas do casal
CREATE POLICY "Ver tarefas do casal" ON public.tasks
    FOR SELECT USING (
        created_by::text = auth.uid()::text OR 
        assigned_to::text = auth.uid()::text OR
        created_by::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text) OR
        assigned_to::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text)
    );

CREATE POLICY "Inserir tarefas" ON public.tasks
    FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);

CREATE POLICY "Atualizar tarefas do casal" ON public.tasks
    FOR UPDATE USING (
        created_by::text = auth.uid()::text OR 
        assigned_to::text = auth.uid()::text OR
        created_by::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text) OR
        assigned_to::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text)
    );

CREATE POLICY "Deletar tarefas criadas por mim" ON public.tasks
    FOR DELETE USING (created_by::text = auth.uid()::text);

-- Políticas para recompensas - similares às tarefas
CREATE POLICY "Ver recompensas do casal" ON public.rewards
    FOR SELECT USING (
        created_by::text = auth.uid()::text OR
        created_by::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text)
    );

CREATE POLICY "Inserir recompensas" ON public.rewards
    FOR INSERT WITH CHECK (created_by::text = auth.uid()::text);

CREATE POLICY "Atualizar recompensas criadas por mim" ON public.rewards
    FOR UPDATE USING (created_by::text = auth.uid()::text);

CREATE POLICY "Deletar recompensas criadas por mim" ON public.rewards
    FOR DELETE USING (created_by::text = auth.uid()::text);

-- Políticas para resgates
CREATE POLICY "Ver resgates do casal" ON public.reward_redemptions
    FOR SELECT USING (
        redeemed_by::text = auth.uid()::text OR
        redeemed_by::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text)
    );

CREATE POLICY "Inserir resgates" ON public.reward_redemptions
    FOR INSERT WITH CHECK (redeemed_by::text = auth.uid()::text);

CREATE POLICY "Atualizar resgates do casal" ON public.reward_redemptions
    FOR UPDATE USING (
        redeemed_by::text = auth.uid()::text OR
        redeemed_by::text IN (SELECT partner_id::text FROM public.users WHERE id::text = auth.uid()::text)
    );

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_couple_code ON public.users(couple_code);
CREATE INDEX IF NOT EXISTS idx_users_partner_id ON public.users(partner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_rewards_created_by ON public.rewards(created_by);
CREATE INDEX IF NOT EXISTS idx_redemptions_redeemed_by ON public.reward_redemptions(redeemed_by);
CREATE INDEX IF NOT EXISTS idx_redemptions_reward_id ON public.reward_redemptions(reward_id);