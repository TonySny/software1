import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgmyadnozbmorwtpzenx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbXlhZG5vemJtb3J3dHB6ZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDc0MTcsImV4cCI6MjA5MjI4MzQxN30.8ndhs45C-l6VJdeHfLaD4AFSPzfcWUZXhaCpQavaWRgsb_publishable_XFLyFTai9gAgJ5HK30T3mw_vJrMHMis';

const supabase = createClient(supabaseUrl, supabaseKey);

if (supabase) {
  console.log('Supabase client created successfully');
} else {
  console.error('Failed to create Supabase client');
}

