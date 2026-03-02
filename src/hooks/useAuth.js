import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Returns { user, loading }
 * user === null  → not logged in
 * user === undefined → still loading
 * user === object → authenticated
 */
export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading: user === undefined };
}
