import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../../hooks/useAssessment';
import { DIMENSIONS, calcScores } from './data';
import AssessmentScreen from '../../shared/AssessmentScreen';
import AiResultsScreen from './ResultsScreen';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="w-8 h-8 border-2 border-ig-berry/30 border-t-ig-berry rounded-full animate-spin" />
    </div>
  );
}

export default function AiAssessment({ user }) {
  const { answers, setAnswers, scores, setScores, loaded } = useAssessment('ai_assessments', user?.id);
  const [dimIndex, setDimIndex] = useState(0);
  const [view, setView]     = useState('loading');

  useEffect(() => {
    if (loaded) setView(scores ? 'results' : 'assessment');
  }, [loaded]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleAnswer = (key, val) => {
    setAnswers({ ...answers, [key]: val });
  };

  const handleNext = () => {
    if (dimIndex < DIMENSIONS.length - 1) {
      setDimIndex(d => d + 1);
      scrollTop();
    } else {
      const computed = calcScores(answers);
      setScores(computed);
      setView('results');
      scrollTop();
    }
  };

  const handleBack = () => {
    if (dimIndex > 0) { setDimIndex(d => d - 1); scrollTop(); }
  };

  const handleRetake = () => {
    setAnswers({});
    setScores(null);
    setDimIndex(0);
    setView('assessment');
    scrollTop();
  };

  if (view === 'loading') return <LoadingSpinner />;

  if (view === 'results') {
    return <AiResultsScreen scores={scores} onRetake={handleRetake} />;
  }

  return (
    <AssessmentScreen
      key={dimIndex}
      dim={DIMENSIONS[dimIndex]}
      dimIndex={dimIndex}
      totalDims={DIMENSIONS.length}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onBack={handleBack}
    />
  );
}
