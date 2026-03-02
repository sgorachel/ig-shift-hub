import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import {
  DIMENSIONS, TIER_SUMMARIES, TIER_STYLES, STRENGTH_NOTES, GROWTH_NOTES, getTierKey, getTierLabel,
} from './data';

function TierBadge({ tierKey, tierLabel }) {
  const s = TIER_STYLES[tierKey];
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {tierLabel}
    </span>
  );
}

function DimensionCard({ dim, pct }) {
  const key   = getTierKey(pct);
  const label = getTierLabel(pct);
  const s     = TIER_STYLES[key];
  return (
    <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-5 flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-bold text-ig-text text-sm mb-1">{dim.label}</h3>
        <TierBadge tierKey={key} tierLabel={label} />
        <p className="text-xs text-ig-text-muted mt-2 leading-relaxed">{dim.insights[key]}</p>
      </div>
      <div className={`text-3xl font-bold shrink-0 ${s.text}`}>{pct}%</div>
    </div>
  );
}

export default function ChangeResultsScreen({ scores, onRetake }) {
  const { overall, tierKey, tierLabel } = scores;

  const chartData = DIMENSIONS.map(d => ({ name: d.barLabel, score: scores[d.id] }));
  const sorted    = [...DIMENSIONS].sort((a, b) => scores[a.id] - scores[b.id]);
  const weakest   = sorted[0];
  const strongest = sorted[sorted.length - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      {/* Header */}
      <div className="mb-8">
        <TierBadge tierKey={tierKey} tierLabel={tierLabel} />
        <h1 className="text-3xl sm:text-4xl font-bold text-ig-text mt-3 mb-2">
          Your Change Readiness Profile
        </h1>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-bold text-ig-berry">{overall}%</span>
          <span className="text-sm text-ig-text-muted">Overall Score</span>
        </div>
        <div className="bg-white rounded-2xl border-l-4 border-ig-berry shadow-sm p-5 max-w-2xl">
          <p className="text-sm text-ig-text leading-relaxed">{TIER_SUMMARIES[tierKey]}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-6 mb-8">
        <h2 className="font-bold text-ig-text mb-5">Score by Dimension</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E8F5" />
            <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#666' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#1A1A2E', fontWeight: 600 }} width={72} />
            <Tooltip formatter={v => [`${v}%`, 'Score']} contentStyle={{ borderRadius: '12px', border: '1px solid #F0E8F5', fontSize: '12px' }} />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={22}>
              {chartData.map((_, i) => <Cell key={i} fill="#7B2D8B" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strength + Growth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-ig-teal" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ig-text-muted">Your Strongest Dimension</span>
          </div>
          <p className="font-bold text-ig-text mb-0.5">
            {strongest.label} <span className="text-ig-berry font-semibold">— {scores[strongest.id]}%</span>
          </p>
          <p className="text-xs text-ig-text-muted leading-relaxed mt-1">{STRENGTH_NOTES[strongest.id]}</p>
        </div>
        <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-ig-orange" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ig-text-muted">Biggest Growth Opportunity</span>
          </div>
          <p className="font-bold text-ig-text mb-0.5">
            {weakest.label} <span className="text-ig-berry font-semibold">— {scores[weakest.id]}%</span>
          </p>
          <p className="text-xs text-ig-text-muted leading-relaxed mt-1">{GROWTH_NOTES[weakest.id]}</p>
        </div>
      </div>

      {/* Dimension Cards */}
      <div className="space-y-4 mb-10">
        <h2 className="font-bold text-ig-text text-lg">Dimension Breakdown</h2>
        {DIMENSIONS.map(dim => <DimensionCard key={dim.id} dim={dim} pct={scores[dim.id]} />)}
      </div>

      {/* CTA */}
      <div className="bg-ig-berry rounded-2xl p-8 text-center text-white mb-6">
        <h2 className="text-2xl font-bold mb-3">Ready to go deeper?</h2>
        <p className="text-sm opacity-90 max-w-md mx-auto mb-6 leading-relaxed">
          Inclusion Geeks works with organizations to turn assessments like this into action — through facilitated conversations, change management workshops, and support that actually sticks.
        </p>
        <a
          href="https://inclusiongeeks.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-ig-berry px-8 py-3 rounded-full font-semibold hover:bg-ig-bg transition-colors shadow-sm"
        >
          Talk with us <ArrowRight size={16} />
        </a>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 border border-ig-berry text-ig-berry rounded-full font-medium hover:bg-ig-rose transition-colors text-sm">
          ← Back to Dashboard
        </Link>
        <button onClick={onRetake} className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-ig-text-muted rounded-full font-medium hover:bg-gray-50 transition-colors text-sm">
          <RotateCcw size={14} /> Retake Assessment
        </button>
      </div>
    </div>
  );
}
