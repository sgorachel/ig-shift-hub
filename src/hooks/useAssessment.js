import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Load and auto-save assessment answers + scores to a Supabase table.
 *
 * @param {string} tableName  e.g. 'ai_assessments', 'change_assessments', 'assessments'
 * @param {string|null} userId
 * @returns {{ answers, scores, setAnswers, setScores, saving, loaded }}
 */
export function useAssessment(tableName, userId) {
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  // Load existing data on mount
  useEffect(() => {
    if (!userId) {
      setLoaded(true);
      return;
    }

    supabase
      .from(tableName)
      .select('answers, scores')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setAnswers(data.answers || {});
          setScores(data.scores || null);
        }
        setLoaded(true);
      });
  }, [tableName, userId]);

  // Debounced save
  const save = useCallback((newAnswers, newScores) => {
    if (!userId) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      await supabase.from(tableName).upsert(
        {
          user_id: userId,
          answers: newAnswers,
          scores: newScores,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      setSaving(false);
    }, 1000);
  }, [tableName, userId]);

  const updateAnswers = useCallback((newAnswers) => {
    setAnswers(newAnswers);
    save(newAnswers, scores);
  }, [save, scores]);

  const updateScores = useCallback((newScores) => {
    setScores(newScores);
    save(answers, newScores);
  }, [save, answers]);

  return { answers, scores, setAnswers: updateAnswers, setScores: updateScores, saving, loaded };
}
