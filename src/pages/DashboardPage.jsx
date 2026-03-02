import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getTierKey as aiTierKey, getTierLabel as aiTierLabel, TIER_STYLES as AI_STYLES } from '../assessments/ai/data';
import { getTierKey as changeTierKey, getTierLabel as changeTierLabel, TIER_STYLES as CHANGE_STYLES } from '../assessments/change/data';
import { getScoreColor, getScoreLabel } from '../assessments/equity/data';

const ASSESSMENTS = [
  {
    id: 'ai',
    table: 'ai_assessments',
    title: 'Ethical AI Adoption',
    description: 'Evaluate whether your organization is adopting AI ethically — not just compliantly.',
    to: '/ai',
    scoreKey: 'overall',
    scoreType: 'percent',
    getTierKey: aiTierKey,
    getTierLabel: aiTierLabel,
    TIER_STYLES: AI_STYLES,
  },
  {
    id: 'change',
    table: 'change_assessments',
    title: 'Change Readiness',
    description: 'Assess your organizational capacity to lead and sustain meaningful change.',
    to: '/change',
    scoreKey: 'overall',
    scoreType: 'percent',
    getTierKey: changeTierKey,
    getTierLabel: changeTierLabel,
    TIER_STYLES: CHANGE_STYLES,
  },
  {
    id: 'equity',
    table: 'equity_assessments',
    title: 'Workplace Equity',
    description: 'Measure how equitable your workplace practices, policies, and culture really are.',
    to: '/equity',
    scoreKey: 'overall',
    scoreType: 'out_of_10',
  },
];

function AssessmentCard({ assessment, scores, loading }) {
  const score = scores?.[assessment.scoreKey];
  const hasScore = score !== undefined && score !== null;

  const renderScore = () => {
    if (!hasScore) return null;
    if (assessment.scoreType === 'percent') {
      const tk = assessment.getTierKey(score);
      const tl = assessment.getTierLabel(score);
      const s  = assessment.TIER_STYLES[tk];
      return (
        <div className="mt-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-ig-berry">{score}%</span>
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
            {tl}
          </span>
        </div>
      );
    }
    // out_of_10 (equity)
    return (
      <div className="mt-3">
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>{score.toFixed(1)}</span>
          <span className="text-sm text-ig-text-muted">/10</span>
        </div>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: getScoreColor(score) + '20', color: getScoreColor(score) }}
        >
          {getScoreLabel(score)}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-ig-text text-base">{assessment.title}</h3>
          <p className="text-xs text-ig-text-muted mt-1 leading-relaxed">{assessment.description}</p>
        </div>
        {hasScore && <CheckCircle2 size={20} className="text-ig-teal shrink-0 mt-0.5" />}
      </div>

      {loading ? (
        <div className="mt-3 h-12 bg-ig-rose rounded-xl animate-pulse" />
      ) : (
        renderScore()
      )}

      <div className="mt-auto pt-4">
        <Link
          to={assessment.to}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ig-berry hover:text-ig-berry-light transition-colors"
        >
          {hasScore ? 'View Results' : loading ? 'Loading…' : 'Start Assessment'}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage({ user }) {
  const [scoresByTable, setScoresByTable] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      const results = await Promise.all(
        ASSESSMENTS.map(a =>
          supabase
            .from(a.table)
            .select('scores')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .single()
            .then(({ data }) => ({ table: a.table, scores: data?.scores ?? null }))
        )
      );
      const map = {};
      results.forEach(r => { map[r.table] = r.scores; });
      setScoresByTable(map);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  const completedCount = ASSESSMENTS.filter(a => scoresByTable[a.table] !== null && scoresByTable[a.table] !== undefined).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ig-text mb-2">Your SHIFT Readiness Dashboard</h1>
        <p className="text-ig-text-muted">
          {loading
            ? 'Loading your results…'
            : completedCount === 0
            ? 'Start any assessment below to build your organizational readiness picture.'
            : completedCount === ASSESSMENTS.length
            ? `All ${ASSESSMENTS.length} assessments complete. You can retake any of them from the results page.`
            : `${completedCount} of ${ASSESSMENTS.length} assessments complete.`
          }
        </p>
      </div>

      {/* Progress bar */}
      {!loading && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-ig-text-muted font-medium">Suite Progress</span>
            <span className="text-xs text-ig-text-muted">{completedCount}/{ASSESSMENTS.length} complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-ig-berry rounded-full transition-all duration-700"
              style={{ width: `${(completedCount / ASSESSMENTS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Assessment cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {ASSESSMENTS.map(a => (
          <AssessmentCard
            key={a.id}
            assessment={a}
            scores={scoresByTable[a.table]}
            loading={loading}
          />
        ))}
      </div>

      {/* What is SHIFT */}
      <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-6">
        <h2 className="font-bold text-ig-text mb-2">About the SHIFT Readiness Suite</h2>
        <p className="text-sm text-ig-text-muted leading-relaxed mb-4">
          These three assessments are designed to work together. Each one surfaces a different dimension of your organization's readiness — for ethical technology, for change, and for equity. Together, they give you a comprehensive picture.
        </p>
        <a
          href="https://inclusiongeeks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ig-berry hover:underline"
        >
          Learn about Inclusion Geeks <ArrowRight size={12} />
        </a>
      </div>
    </div>
  );
}
