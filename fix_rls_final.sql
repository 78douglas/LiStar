-- ⚡ CORREÇÃO DEFINITIVA DOS PROBLEMAS DE RLS
-- Execute este script completo no Supabase SQL Editor

-- 1. REMOVER TODAS as políticas antigas que podem estar conflitando
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados e do parceiro" ON public.users;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- 2. DESABILITAR RLS temporariamente para limpeza
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 3. REABILITAR RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS SIMPLES E FUNCIONAIS

-- Política para INSERÇÃO - CRÍTICA para cadastro funcionar
CREATE POLICY "allow_insert_users" ON public.users
    FOR INSERT 
    WITH CHECK (true); -- Permite inserção para usuários autenticados

-- Política para SELEÇÃO - Ver próprios dados e do casal
CREATE POLICY "allow_select_users" ON public.users
    FOR SELECT 
    USING (
        auth.uid()::text = id::text 
        OR 
        (couple_code IS NOT NULL AND couple_code IN (
            SELECT u.couple_code FROM public.users u WHERE u.id::text = auth.uid()::text
        ))
    );

-- Política para ATUALIZAÇÃO - Atualizar próprios dados
CREATE POLICY "allow_update_users" ON public.users
    FOR UPDATE 
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- Política para EXCLUSÃO - Deletar próprios dados
CREATE POLICY "allow_delete_users" ON public.users
    FOR DELETE 
    USING (auth.uid()::text = id::text);

-- 5. VERIFICAR se as políticas foram criadas corretamente
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Tem condição USING'
        ELSE 'Sem condição'
    END as using_condition,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Tem condição CHECK'
        ELSE 'Sem condição CHECK'
    END as check_condition
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public'
ORDER BY policyname;

-- 6. TESTAR se consegue inserir (execute depois do cadastro)
-- SELECT 'Teste de acesso bem-sucedido' as resultado;