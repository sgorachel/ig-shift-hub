import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mumohnifkvolizqrisrw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bW9obmlma3ZvbGl6cXJpc3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDMyMjAsImV4cCI6MjA4NjQ3OTIyMH0.UEBDCVc1jFAqMDROYxsw_4VWDvjUUrWDZhEMtKhn6_c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
