import { useState } from 'react';
import LikertSlider from './LikertSlider';

/**
 * Reusable one-dimension-at-a-time Likert (1–5) assessment screen.
 * Used by both AI and Change Readiness assessments.
 */
export default function AssessmentScreen({
  dim,
  dimIndex,
  totalDims,
  answers,
  onAnswer,
  onNext,
  onBack,
}) {
  const [showError, setShowError] = useState(false);
  const isFirst = dimIndex === 0;
  const isLast  = dimIndex === totalDims - 1;

  const dimAnswered = dim.questions.filter((_, i) => answers[`${dim.id}_${i}`] !== undefined).length;

  const handleAnswer = (key, val) => {
    onAnswer(key, val);
    if (showError) setShowError(false);
  };

  const handleNext = () => {
    const allAnswered = dim.questions.every((_, i) => answers[`${dim.id}_${i}`] !== undefined);
    if (!allAnswered) {
      setShowError(true);
      const firstUnanswered = dim.questions.findIndex((_, i) => answers[`${dim.id}_${i}`] === undefined);
      document.getElementById(`q-${dim.id}-${firstUnanswered}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setShowError(false);
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 slide-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-ig-text-muted font-medium">
            Section {dimIndex + 1} of {totalDims}
          </span>
          <span className="text-xs text-ig-text-muted">
            {dimAnswered} of {dim.questions.length} rated
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-ig-berry"
            style={{ width: `${((dimIndex + dimAnswered / dim.questions.length) / totalDims) * 100}%` }}
          />
        </div>
      </div>

      {/* Dimension header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-ig-berry/10">
          <span className="text-ig-berry font-bold text-sm">{dimIndex + 1}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ig-text">{dim.label ?? dim.name}</h2>
          {(dim.subhead ?? dim.desc) && (
            <p className="text-sm text-ig-text-muted italic mt-1">{dim.subhead ?? dim.desc}</p>
          )}
          {dimAnswered === dim.questions.length && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-ig-text-muted">Section complete</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-1">
        {dim.questions.map((q, qi) => {
          const key = `${dim.id}_${qi}`;
          return (
            <div key={key} id={`q-${dim.id}-${qi}`}>
              <LikertSlider
                questionNum={qi + 1}
                text={q}
                value={answers[key]}
                onChange={val => handleAnswer(key, val)}
              />
            </div>
          );
        })}
      </div>

      {/* Error */}
      {showError && (
        <p className="text-sm text-red-600 font-medium mt-2 mb-4 text-center fade-in">
          Please rate all {dim.questions.length} questions before continuing.
        </p>
      )}

      {/* Navigation */}
      <div className={`flex items-center ${isFirst ? 'justify-end' : 'justify-between'} mt-8 pt-6 border-t border-gray-100`}>
        {!isFirst && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-ig-text-muted hover:text-ig-text hover:bg-ig-rose transition-colors"
          >
            ← Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-ig-berry text-white rounded-full text-sm font-medium hover:bg-ig-berry-light transition-colors shadow-sm"
        >
          {isLast ? 'View Results →' : 'Next Section →'}
        </button>
      </div>
    </div>
  );
}
