import { useState, useEffect } from 'react';
import { Users, Building2, MessageSquare, TrendingUp, Megaphone } from 'lucide-react';
import { useAssessment } from '../../hooks/useAssessment';
import { sections, calcEquityScores } from './data';
import RatingSlider, { getScoreColor, getScoreLabel } from '../../shared/RatingSlider';
import EquityResultsScreen from './ResultsScreen';

const iconMap = { Users, Building2, MessageSquare, TrendingUp, Megaphone };

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="w-8 h-8 border-2 border-ig-berry/30 border-t-ig-berry rounded-full animate-spin" />
    </div>
  );
}

function SectionScreen({ section, sectionIndex, totalSections, ratings, onRatingChange, onNext, onBack }) {
  const Icon = iconMap[section.icon] || Users;
  const isFirst = sectionIndex === 0;
  const isLast  = sectionIndex === totalSections - 1;
  const completedCount = section.criteria.filter(c => ratings[c.id] !== undefined && ratings[c.id] !== null).length;
  const sectionAvg = completedCount > 0
    ? (section.criteria.reduce((s, c) => s + (ratings[c.id] ?? 0), 0) / section.criteria.length)
    : 0;
  const allCompleted = completedCount === section.criteria.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 slide-in">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-ig-text-muted font-medium">
            Section {sectionIndex + 1} of {totalSections}
          </span>
          <span className="text-xs text-ig-text-muted">
            {completedCount} of {section.criteria.length} rated
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((sectionIndex + completedCount / section.criteria.length) / totalSections) * 100}%`,
              backgroundColor: section.color,
            }}
          />
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: section.color + '20' }}
        >
          <Icon size={24} style={{ color: section.color }} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ig-text">{section.title}</h2>
          {section.framingLine && (
            <p className="text-sm text-ig-text-muted italic mt-1">{section.framingLine}</p>
          )}
          {allCompleted && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-ig-text-muted">Section Average:</span>
              <span className="text-sm font-bold" style={{ color: getScoreColor(sectionAvg) }}>
                {sectionAvg.toFixed(1)}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: getScoreColor(sectionAvg) + '20', color: getScoreColor(sectionAvg) }}
              >
                {getScoreLabel(sectionAvg)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Criteria */}
      <div className="space-y-1">
        {section.criteria.map(criterion => (
          <RatingSlider
            key={criterion.id}
            criterion={criterion}
            value={ratings[criterion.id]}
            onChange={val => onRatingChange(criterion.id, val)}
          />
        ))}
      </div>

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
          onClick={onNext}
          className="px-6 py-2.5 bg-ig-berry text-white rounded-full text-sm font-medium hover:bg-ig-berry-light transition-colors shadow-sm"
        >
          {isLast ? 'View Results →' : 'Next Section →'}
        </button>
      </div>
    </div>
  );
}

export default function EquityAssessment({ user }) {
  const { answers, setAnswers, scores, setScores, loaded } = useAssessment('equity_assessments', user?.id);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [view, setView] = useState('loading');

  useEffect(() => {
    if (loaded) setView(scores ? 'results' : 'assessment');
  }, [loaded]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleRatingChange = (criterionId, val) => {
    setAnswers({ ...answers, [criterionId]: val });
  };

  const handleNext = () => {
    if (sectionIndex < sections.length - 1) {
      setSectionIndex(i => i + 1);
      scrollTop();
    } else {
      const computed = calcEquityScores(answers);
      setScores(computed);
      setView('results');
      scrollTop();
    }
  };

  const handleBack = () => {
    if (sectionIndex > 0) { setSectionIndex(i => i - 1); scrollTop(); }
  };

  const handleRetake = () => {
    setAnswers({});
    setScores(null);
    setSectionIndex(0);
    setView('assessment');
    scrollTop();
  };

  if (view === 'loading') return <LoadingSpinner />;

  if (view === 'results') {
    return <EquityResultsScreen scores={scores} ratings={answers} onRetake={handleRetake} />;
  }

  return (
    <SectionScreen
      key={sectionIndex}
      section={sections[sectionIndex]}
      sectionIndex={sectionIndex}
      totalSections={sections.length}
      ratings={answers}
      onRatingChange={handleRatingChange}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
