import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gvspkkxuwimwrgvpkwxy.supabase.co/';
const SUPABASE_ANON_KEY = 'sb_publishable_r-NkuEN08MEXg-ZnJLAMtQ_HqtI0qsy';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);