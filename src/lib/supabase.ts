import { createClient } from '@supabase/supabase-js';

// Pastikan Anda sudah memasukkan variabel ini di .env.local frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);