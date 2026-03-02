import { useState } from 'react';

export function getScoreColor(score) {
  if (score <= 3)  return '#E74C3C';
  if (score <= 5)  return '#F39C12';
  if (score <= 7)  return '#F1C40F';
  if (score <= 8)  return '#2DBFB3';
  return '#2ECC71';
}

export function getScoreLabel(score) {
  if (score <= 3)  return 'Needs Attention';
  if (score <= 5)  return 'Progressing';
  if (score <= 7)  return 'Growing';
  if (score <= 8)  return 'Strong';
  return 'Leading';
}

export function getScoreLevel(score) {
  if (score <= 3)  return 'critical';
  if (score <= 5)  return 'developing';
  if (score <= 7)  return 'growing';
  return 'thriving';
}

export default function RatingSlider({ criterion, value, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const score = value ?? null;
  const hasRating = score !== null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-left w-full"
          >
            <h4 className="font-semibold text-ig-text text-sm flex items-center gap-2">
              {criterion.label}
              <svg
                className={`w-4 h-4 text-ig-text-muted transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h4>
          </button>
          {isExpanded && (
            <p className="text-xs text-ig-text-muted mt-2 leading-relaxed fade-in">
              {criterion.description}
            </p>
          )}
        </div>
        {hasRating && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold" style={{ color: getScoreColor(score) }}>
              {score}
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: getScoreColor(score) + '20', color: getScoreColor(score) }}
            >
              {getScoreLabel(score)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="0"
          max="10"
          value={score ?? 5}
          onChange={e => onChange(parseInt(e.target.value))}
          className="w-full"
          style={{
            background: hasRating
              ? `linear-gradient(to right, ${getScoreColor(score)} 0%, ${getScoreColor(score)} ${(score / 10) * 100}%, #e5e7eb ${(score / 10) * 100}%, #e5e7eb 100%)`
              : '#e5e7eb',
          }}
        />
        <div className="flex justify-between text-[10px] text-ig-text-muted mt-1 px-1">
          <span>0 — We don't do this</span>
          <span>5 — Somewhat</span>
          <span>10 — We do this well</span>
        </div>
      </div>
    </div>
  );
}
