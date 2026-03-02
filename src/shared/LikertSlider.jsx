import { useState } from 'react';

const COLORS = {
  1: '#E74C3C',
  2: '#F39C12',
  3: '#F1C40F',
  4: '#2DBFB3',
  5: '#2ECC71',
};

const LABELS = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
};

export function getLikertColor(value) {
  return COLORS[value] ?? '#e5e7eb';
}

export function getLikertLabel(value) {
  return LABELS[value] ?? '';
}

export default function LikertSlider({ questionNum, text, value, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasValue = value !== undefined && value !== null;
  const color = hasValue ? getLikertColor(value) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <button
            onClick={() => setIsExpanded(e => !e)}
            className="text-left w-full"
          >
            <h4 className="font-semibold text-ig-text text-sm flex items-center gap-2">
              {questionNum}. {text}
              <svg
                className={`w-4 h-4 text-ig-text-muted shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
              Rate from 1 (Strongly Disagree) to 5 (Strongly Agree).
            </p>
          )}
        </div>

        {hasValue && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold" style={{ color }}>
              {value}
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ backgroundColor: color + '20', color }}
            >
              {getLikertLabel(value)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value ?? 3}
          onChange={e => onChange(parseInt(e.target.value))}
          className="w-full"
          style={{
            background: hasValue
              ? `linear-gradient(to right, ${color} 0%, ${color} ${((value - 1) / 4) * 100}%, #e5e7eb ${((value - 1) / 4) * 100}%, #e5e7eb 100%)`
              : '#e5e7eb',
          }}
        />
        <div className="flex justify-between text-[10px] text-ig-text-muted mt-1 px-1">
          <span>Strongly Disagree</span>
          <span>Neutral</span>
          <span>Strongly Agree</span>
        </div>
      </div>
    </div>
  );
}
