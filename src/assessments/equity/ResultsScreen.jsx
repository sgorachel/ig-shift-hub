import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Users, Building2, MessageSquare, TrendingUp, Megaphone, ArrowRight, RotateCcw } from 'lucide-react';
import { sections, getScoreColor, getScoreLabel } from './data';

const iconMap = { Users, Building2, MessageSquare, TrendingUp, Megaphone };

function ScoreGauge({ score, size = 120 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F0E8F5" strokeWidth="8" />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference - progress}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score.toFixed(1)}</span>
        <span className="text-[10px] text-ig-text-muted">/10</span>
      </div>
    </div>
  );
}

export default function EquityResultsScreen({ scores, ratings, onRetake }) {
  const overall = scores.overall ?? 0;

  const sectionAverages = sections.map(s => ({
    ...s,
    average: scores[s.id] ?? 0,
  }));

  const chartData = sectionAverages.map(s => ({
    name: s.shortTitle,
    score: parseFloat(s.average.toFixed(1)),
  }));

  const sorted   = [...sectionAverages].sort((a, b) => a.average - b.average);
  const weakest  = sorted[0];
  const strongest = sorted[sorted.length - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      {/* Overall header */}
      <div className="bg-white rounded-2xl shadow-sm border border-ig-rose p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreGauge score={overall} size={140} />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-ig-text mb-1">Workplace Equity Score</h1>
            <p className="text-ig-text-muted mb-4">Based on {sections.length} sections</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {sectionAverages.map(s => (
                <span
                  key={s.id}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: getScoreColor(s.average) + '15',
                    color: getScoreColor(s.average),
                    border: `1px solid ${getScoreColor(s.average)}30`,
                  }}
                >
                  {s.shortTitle}: {s.average.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-6 mb-8">
        <h2 className="font-bold text-ig-text mb-5">Section Scores</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E8F5" />
            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
            <Tooltip formatter={v => [`${v}/10`, 'Score']} contentStyle={{ borderRadius: '12px', border: '1px solid #F0E8F5', fontSize: '12px' }} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getScoreColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strength + Growth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ig-text-muted mb-2">Strongest Section</p>
          <p className="font-bold text-ig-text">
            {strongest.title}{' '}
            <span className="font-semibold" style={{ color: getScoreColor(strongest.average) }}>
              — {strongest.average.toFixed(1)}/10
            </span>
          </p>
          <p className="text-xs text-ig-text-muted mt-1">{getScoreLabel(strongest.average)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ig-text-muted mb-2">Biggest Growth Opportunity</p>
          <p className="font-bold text-ig-text">
            {weakest.title}{' '}
            <span className="font-semibold" style={{ color: getScoreColor(weakest.average) }}>
              — {weakest.average.toFixed(1)}/10
            </span>
          </p>
          <p className="text-xs text-ig-text-muted mt-1">{getScoreLabel(weakest.average)}</p>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="space-y-3 mb-10">
        <h2 className="font-bold text-ig-text text-lg">Section Breakdown</h2>
        {sectionAverages.map(s => {
          const Icon = iconMap[s.icon] || Users;
          return (
            <div key={s.id} className="bg-white rounded-xl border border-ig-rose shadow-sm p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + '20' }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-ig-text text-sm">{s.title}</h3>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: getScoreColor(s.average) + '20', color: getScoreColor(s.average) }}
                  >
                    {getScoreLabel(s.average)}
                  </span>
                </div>
              </div>
              <span className="text-2xl font-bold shrink-0" style={{ color: getScoreColor(s.average) }}>
                {s.average.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-ig-berry rounded-2xl p-8 text-center text-white mb-6">
        <h2 className="text-2xl font-bold mb-3">Ready to act on your results?</h2>
        <p className="text-sm opacity-90 max-w-md mx-auto mb-6 leading-relaxed">
          Your scores reveal where your organization has room to grow — and where small shifts could create big change. Inclusion Geeks helps teams build equitable, future-ready workplaces.
        </p>
        <a
          href="https://inclusiongeeks.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-ig-berry px-8 py-3 rounded-full font-semibold hover:bg-ig-bg transition-colors shadow-sm"
        >
          Book a free conversation <ArrowRight size={16} />
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
