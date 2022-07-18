import { createClient } from '@supabase/supabase-js';
//  SUPABASE myContacts
// БЫЛО
// Delete: (role() = 'authenticated'::text)
// INSERT: (role() = 'authenticated'::text)
// SELECT: true
// UPDATE: (role() = 'authenticated'::text)
// СТАЛО:
// DELETE: (email() = email)
// INSERT: (role() = 'authenticated'::text)
// SELECT: (email() = email)
// UPDATE: (email() = email)
//  SUPABASE deals
// БЫЛО
// Delete: (role() = 'authenticated'::text)
// INSERT: (role() = 'authenticated'::text)
// SELECT: true
// UPDATE: (role() = 'authenticated'::text)
// СТАЛО:
// DELETE: (email() = email)
// INSERT: (role() = 'authenticated'::text)
// SELECT: (email() = email)
// UPDATE: (email() = email)
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);