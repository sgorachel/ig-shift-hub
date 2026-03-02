export const DIMENSIONS = [
  {
    id: 'systems',
    label: 'Systems Awareness',
    barLabel: 'Systems',
    subhead: 'Do you understand the full organizational impact of AI adoption?',
    questions: [
      'We have mapped which roles, teams, and workflows are directly affected by the AI tools we\'ve adopted or are considering.',
      'We understand how our AI vendors make decisions about their products — including updates, pricing, and data use.',
      'We have considered the environmental impact (energy, water, carbon) of the AI tools we use.',
      'We know which external regulations or legal frameworks apply to our AI use.',
      'When we adopt a new AI tool, we assess second-order effects — not just the immediate benefit.',
    ],
    insights: {
      leading:  'Your organization has strong situational awareness. You\'re tracking impacts, regulations, and second-order effects — which is the foundation for everything else.',
      momentum: 'You have some awareness of AI\'s systemic impacts but gaps remain, particularly around vendor accountability and environmental footprint.',
      growth:   'Systems awareness is a critical blind spot. Without mapping how AI affects your full ecosystem, you\'re making adoption decisions without the full picture.',
      act:      'Your organization may be adopting AI without clarity on who and what is affected. This is the place to start.',
    },
  },
  {
    id: 'people',
    label: 'People & Voice',
    barLabel: 'People',
    subhead: 'Are your people centered in how AI decisions get made?',
    questions: [
      'Employees were consulted before we adopted AI tools that affect their work — not just informed after the fact.',
      'We have a clear, accessible process for people to raise concerns about AI tools without fear of retaliation.',
      'We know which groups in our organization are most affected by AI adoption — and they have meaningful input into decisions.',
      'Leadership can articulate why we are adopting AI in terms of organizational values, not just efficiency gains.',
      'We actively monitor how AI tools are affecting employee experience, workload, and trust.',
    ],
    insights: {
      leading:  'You\'re doing the hard work of actually involving people — not just informing them. This is what separates ethical AI adoption from performative AI adoption.',
      momentum: 'There are meaningful efforts to include people, but gaps remain — particularly for those most affected. Deepening engagement will build trust and reduce risk.',
      growth:   'AI decisions appear to be happening without sufficient input from the people most affected. This creates both ethical and practical risk.',
      act:      'Centering people in AI adoption isn\'t just an ethical imperative — it\'s a change management one. Starting with genuine consultation will make everything else easier.',
    },
  },
  {
    id: 'capacity',
    label: 'Organizational Capacity',
    barLabel: 'Capacity',
    subhead: 'Do you have the infrastructure, skills, and accountability to adopt AI responsibly?',
    questions: [
      'We have a designated person or team accountable for ethical AI adoption — not just IT security or compliance.',
      'Employees have received training not just on how to use AI tools, but on when not to use them.',
      'We have a documented process for evaluating AI tools before adoption that includes ethical criteria.',
      'We have the internal capacity to audit or review AI outputs for bias, error, or inequitable impact.',
      'Our AI policies are written in plain language that non-technical staff can understand and act on.',
    ],
    insights: {
      leading:  'You have the infrastructure, accountability, and training to back up your AI commitments. This operational foundation is what makes ethical intent actually stick.',
      momentum: 'Your capacity is developing, but accountability structures and practical training still have gaps. Investing here will bridge intention and practice.',
      growth:   'Good intentions without organizational infrastructure tend not to hold. Building capacity — clear ownership, practical training, accessible policy — is the bridge.',
      act:      'The foundational infrastructure for ethical AI adoption needs to be built. Clear accountability and plain-language policy are the right starting points.',
    },
  },
  {
    id: 'foresight',
    label: 'Future Orientation',
    barLabel: 'Foresight',
    subhead: 'Are you thinking beyond today\'s AI use cases?',
    questions: [
      'We have discussed what AI adoption might mean for our workforce in 3–5 years, not just right now.',
      'We have considered how AI might shift power dynamics within our organization over time.',
      'We actively track developments in AI ethics, regulation, and emerging risks relevant to our sector.',
      'We have explored scenarios where our current AI use could cause unintended harm — and made plans accordingly.',
      'Our AI strategy is revisited and updated regularly, not treated as a one-time decision.',
    ],
    insights: {
      leading:  'You\'re thinking in scenarios, not just plans. This futures-oriented approach means you\'re less likely to be caught off guard — and more likely to shape what comes next.',
      momentum: 'Some futures thinking is happening, but it tends toward optimization rather than genuine scenario exploration. Asking harder "what if" questions will sharpen your strategy.',
      growth:   'AI strategy without futures thinking is fragile. The decisions you make today will shape your organization for years — they deserve more than a short-term lens.',
      act:      'Your AI adoption may be reactive rather than strategic. Even basic foresight practices — scenario conversations, signal scanning — will change how you make decisions.',
    },
  },
  {
    id: 'equity',
    label: 'Equity Integration',
    barLabel: 'Equity',
    subhead: 'Is equity baked into how you\'re adopting AI — not just what you\'re building?',
    questions: [
      'We have asked: who benefits from this AI tool, and who bears the risk if it fails or causes harm?',
      'We have examined whether AI tools we use could produce biased or discriminatory outcomes for any group.',
      'Our AI adoption process includes voices from people with lived experience of marginalization — not just senior leaders and technical staff.',
      'We are transparent with employees about how AI is or may be used to monitor, evaluate, or make decisions about them.',
      'We hold our AI vendors accountable to equity standards — not just performance and price.',
    ],
    insights: {
      leading:  'You\'re asking the questions most organizations avoid: who benefits, who bears risk, who has power? This is what ethical AI actually looks like in practice.',
      momentum: 'Equity is on your radar but isn\'t yet consistently embedded in how AI decisions get made. Closing this gap — especially around vendor accountability and employee transparency — will make your commitment real.',
      growth:   'Equity integration is where the gap between responsible AI and ethical AI lives. Technical compliance doesn\'t ask these questions. You need to.',
      act:      'This is the most urgent dimension. Without an equity lens, AI adoption tends to replicate and amplify existing inequities — often invisibly.',
    },
  },
];

export function getDimScore(dimId, answers) {
  let sum = 0;
  for (let i = 0; i < 5; i++) sum += answers[`${dimId}_${i}`] || 0;
  return Math.round((sum / 25) * 100);
}

export function calcScores(answers) {
  const scores = {};
  let total = 0;
  DIMENSIONS.forEach(d => {
    scores[d.id] = getDimScore(d.id, answers);
    total += scores[d.id];
  });
  scores.overall = Math.round(total / DIMENSIONS.length);
  scores.tierKey   = getTierKey(scores.overall);
  scores.tierLabel = getTierLabel(scores.overall);
  return scores;
}

export function getTierKey(pct) {
  if (pct >= 80) return 'leading';
  if (pct >= 60) return 'momentum';
  if (pct >= 40) return 'growth';
  return 'act';
}

export function getTierLabel(pct) {
  if (pct >= 80) return 'Leading the Way';
  if (pct >= 60) return 'Building Momentum';
  if (pct >= 40) return 'Opportunity for Growth';
  return 'Time to Act';
}

export const TIER_SUMMARIES = {
  leading:  'Your organization is doing something rare: approaching AI adoption with intention, equity, and accountability. The questions you\'re asking — about power, voice, and long-term impact — are the right ones.',
  momentum: 'You have real foundations here. Your organization is thinking beyond compliance, and there are clear areas of strength to build from. The work now is about closing the gaps.',
  growth:   'You\'re in the middle of the pack — which is where most organizations are right now. The challenge is that adopting AI without an ethical framework creates risk over time.',
  act:      'AI is moving fast, and the gaps this assessment surfaced are worth taking seriously. The good news: you now have a clear picture of where to focus.',
};

export const TIER_STYLES = {
  leading:  { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200' },
  momentum: { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200' },
  growth:   { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  act:      { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
};

export const STRENGTH_NOTES = {
  systems:  'This situational clarity is the foundation that makes all other ethical work possible.',
  people:   'Authentic inclusion in AI decisions is rare — and it\'s your competitive advantage.',
  capacity: 'Operational infrastructure is what turns good intentions into accountable practice.',
  foresight:'Thinking in time horizons protects your organization from decisions you\'ll regret.',
  equity:   'An equity lens isn\'t just ethics — it\'s the difference between AI that builds trust and AI that erodes it.',
};

export const GROWTH_NOTES = {
  systems:  'Without systems awareness, you\'re making adoption decisions without the full picture of who and what is at stake.',
  people:   'AI adoption that bypasses people creates both ethical and change-management risk that compounds over time.',
  capacity: 'Gaps in infrastructure mean that your AI commitments are hard to act on — and even harder to hold.',
  foresight:'Short-term thinking about AI creates long-term exposure. The decisions you make now will echo for years.',
  equity:   'Without an equity lens, AI adoption tends to replicate and amplify existing inequities — often invisibly.',
};
