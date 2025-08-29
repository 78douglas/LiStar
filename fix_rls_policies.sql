-- Script de Correção para RLS - Execute no Supabase SQL Editor
-- Corrige o problema de "new row violates row-level security policy"

-- Remover as políticas antigas para usuários
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados e do parceiro" ON public.users;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários" ON public.users;

-- Criar políticas corretas para usuários

-- 1. Política para SELECT - ver dados próprios e do parceiro
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT USING (
        -- Ver próprio perfil
        auth.uid()::text = id::text 
        OR 
        -- Ver perfil do parceiro
        (partner_id IS NOT NULL AND auth.uid()::text = partner_id::text)
        OR
        -- Ver usuários com mesmo couple_code
        (couple_code IS NOT NULL AND couple_code IN (
            SELECT couple_code FROM public.users WHERE id::text = auth.uid()::text
        ))
    );

-- 2. Política para INSERT - permitir criar perfil
CREATE POLICY "users_insert_policy" ON public.users
    FOR INSERT WITH CHECK (
        -- Permitir inserção quando o ID corresponde ao usuário autenticado
        auth.uid()::text = id::text
    );

-- 3. Política para UPDATE - atualizar próprio perfil
CREATE POLICY "users_update_policy" ON public.users
    FOR UPDATE USING (
        auth.uid()::text = id::text
    ) WITH CHECK (
        auth.uid()::text = id::text
    );

-- 4. Política para DELETE - deletar próprio perfil (opcional)
CREATE POLICY "users_delete_policy" ON public.users
    FOR DELETE USING (
        auth.uid()::text = id::text
    );

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Testar se a inserção funciona
-- (Execute apenas após fazer o registro no app)
-- SELECT auth.uid(); -- Para ver o ID do usuário atual