-- Fix RLS for projects table (ERROR 5-8)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" ON public.projects
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
FOR DELETE
USING (auth.uid() = user_id);

-- Fix function search paths (WARN 1-4)
CREATE OR REPLACE FUNCTION public.set_user_id_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id = auth.uid();
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_api_key_usage(key_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    key_record RECORD;
    current_month_usage INTEGER;
BEGIN
    SELECT * INTO key_record FROM api_keys WHERE id = key_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    IF key_record.expires_at IS NOT NULL AND key_record.expires_at < NOW() THEN
        RETURN FALSE;
    END IF;
    
    IF key_record.usage_limit IS NOT NULL THEN
        SELECT COALESCE(SUM(usage_amount), 0) INTO current_month_usage
        FROM api_key_usage_logs 
        WHERE api_key_id = key_id 
        AND used_at >= date_trunc('month', NOW());
        
        IF current_month_usage >= key_record.usage_limit THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_sculpting_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;