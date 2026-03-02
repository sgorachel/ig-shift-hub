export const DIMENSIONS = [
  {
    id: 'systems',
    label: 'Systems Awareness',
    barLabel: 'Systems',
    subhead: 'How well does your organization understand the forces shaping it?',
    questions: [
      'Our leadership regularly scans external trends (political, economic, social, technological) that could affect our work.',
      'We understand how our organization is positioned relative to what\'s changing in our sector.',
      'We can name at least two forces currently disrupting organizations like ours.',
      'We have a process for monitoring policy or regulatory changes relevant to our mission.',
      'When external conditions shift, we adjust our strategy within a reasonable timeframe.',
    ],
    insights: {
      ready:      'Your organization has strong external awareness. You\'re well-positioned to anticipate disruption before it arrives.',
      emerging:   'You have some awareness of external forces, but it may not be systematic. Building a regular signal-scanning practice could sharpen your strategic positioning.',
      developing: 'Your organization may be reacting to change more than anticipating it. Developing shared language around external forces is a powerful first step.',
      early:      'External trends may be largely invisible in your strategic planning. This is a high-leverage area — small investments in awareness create outsized impact.',
    },
  },
  {
    id: 'people',
    label: 'People & Culture',
    barLabel: 'People',
    subhead: 'Are your people supported, included, and empowered through change?',
    questions: [
      'Employees at all levels understand why change initiatives are happening — not just what.',
      'We actively create space for dissenting voices before finalizing major decisions.',
      'Our change efforts account for how different groups in the organization may be differently affected.',
      'Leaders model the behaviors they\'re asking others to adopt.',
      'People who raise concerns about change are heard — not sidelined.',
    ],
    insights: {
      ready:      'Your people are informed, included, and heard through change. That\'s a real competitive advantage.',
      emerging:   'You\'re doing some things well with people, but there may be gaps in how change is communicated or who gets a voice. Closing those gaps builds trust fast.',
      developing: 'Change may feel like something that happens to your people rather than with them. Deepening inclusion in your change process can reduce resistance significantly.',
      early:      'People may feel disconnected from change decisions. Bringing more voices into the process earlier is one of the highest-ROI moves an organization can make.',
    },
  },
  {
    id: 'capacity',
    label: 'Organizational Capacity',
    barLabel: 'Capacity',
    subhead: 'Does your org have the resources, infrastructure, and bandwidth?',
    questions: [
      'We have dedicated time and resources (not just intention) for change initiatives.',
      'Our team has the skills needed to navigate the changes we\'re currently facing.',
      'We have clear accountability structures for who owns change efforts.',
      'We can absorb new initiatives without burning out existing staff.',
      'We measure and track progress on change initiatives over time.',
    ],
    insights: {
      ready:      'You have the infrastructure, skills, and accountability structures to execute change effectively. Build on this foundation.',
      emerging:   'Your capacity is developing — there\'s some infrastructure but also some real constraints. Identifying and protecting change-focused bandwidth will help.',
      developing: 'Capacity gaps may be creating bottlenecks. Without dedicated time and clear ownership, even great strategies stall.',
      early:      'Your organization may be stretched too thin to absorb significant change right now. Building internal capacity is foundational work worth prioritizing.',
    },
  },
  {
    id: 'foresight',
    label: 'Future Orientation',
    barLabel: 'Foresight',
    subhead: 'Is your org scanning signals and thinking ahead?',
    questions: [
      'We regularly ask "what might be true in 3–5 years that we should be preparing for now?"',
      'We have explored multiple possible futures for our organization — not just one plan.',
      'Our strategic planning process includes scenario thinking or futures exercises.',
      'We make decisions today with an eye toward long-term, not just immediate, outcomes.',
      'We\'re comfortable acting on incomplete information when the situation demands it.',
    ],
    insights: {
      ready:      'You\'re thinking ahead, exploring multiple futures, and making decisions with foresight. That\'s genuinely rare — and valuable.',
      emerging:   'You have some future-orientation, but strategic planning may still be primarily backward-looking. Introducing structured foresight practices can shift this quickly.',
      developing: 'Your planning may be focused on the near-term. Carving out even small amounts of time for longer-horizon thinking can meaningfully improve strategic resilience.',
      early:      'Future thinking may be largely absent from your planning process. This is a high-opportunity area — futures tools don\'t require large investments to get started.',
    },
  },
  {
    id: 'equity',
    label: 'Equity Integration',
    barLabel: 'Equity',
    subhead: 'Is equity baked into how change happens — not just what?',
    questions: [
      'The people most affected by a change are involved in designing it.',
      'We examine who benefits — and who bears the burden — of our change initiatives.',
      'Our change processes are accessible to people with different communication styles, languages, and abilities.',
      'We have named equity as an explicit goal in our organizational strategy.',
      'When something isn\'t working equitably, we have the courage to change course.',
    ],
    insights: {
      ready:      'Equity isn\'t an add-on for you — it\'s woven into how you operate. That\'s the hardest and most important thing to get right.',
      emerging:   'You\'ve named equity as important, but it may not yet be fully integrated into your change processes. Moving from intention to practice is the next frontier.',
      developing: 'Equity may show up in values statements but not yet in decision-making. Examining who\'s in the room — and who bears the costs — is a powerful starting point.',
      early:      'Equity integration is an early-stage area for your organization. This is core to sustainable change — and it\'s exactly where Inclusion Geeks can help most.',
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
  scores.overall   = Math.round(total / DIMENSIONS.length);
  scores.tierKey   = getTierKey(scores.overall);
  scores.tierLabel = getTierLabel(scores.overall);
  return scores;
}

export function getTierKey(pct) {
  if (pct >= 80) return 'ready';
  if (pct >= 60) return 'emerging';
  if (pct >= 40) return 'developing';
  return 'early';
}

export function getTierLabel(pct) {
  if (pct >= 80) return 'Change Ready';
  if (pct >= 60) return 'Emerging Readiness';
  if (pct >= 40) return 'Developing';
  return 'Early Stage';
}

export const TIER_SUMMARIES = {
  ready:      'Your organization has strong external awareness. You\'re well-positioned to lead change rather than simply respond to it. Build on this foundation by deepening equity integration and sustaining the conditions that got you here.',
  emerging:   'You\'re building change readiness with real intention. There are meaningful foundations to work from — the opportunity is to systematize what\'s working and close the gaps before the next wave of change arrives.',
  developing: 'You\'re in the middle of the journey — which is exactly where growth happens. The work now is building dedicated capacity, deepening people\'s sense of inclusion, and developing a more forward-looking planning practice.',
  early:      'Your organization is in early stages of change readiness. The assessment has surfaced clear priorities. Starting with leadership communication and people-centered design will create momentum across all dimensions.',
};

export const TIER_STYLES = {
  ready:      { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200' },
  emerging:   { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200' },
  developing: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  early:      { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-200' },
};

export const STRENGTH_NOTES = {
  systems:  'Situational awareness is the foundation. Organizations that can name the forces shaping them can navigate far more effectively.',
  people:   'When people feel included in change — not just informed — resistance drops and trust builds. This is a genuine asset.',
  capacity: 'Having the infrastructure, skills, and accountability in place means your intentions have a real chance of becoming actions.',
  foresight:'Thinking ahead — not just planning — is what separates organizations that shape the future from those who react to it.',
  equity:   'Change that centers those most affected is both more just and more durable. This is your deepest strength.',
};

export const GROWTH_NOTES = {
  systems:  'Without external awareness, change feels sudden and reactive. Building a regular scan practice is a high-leverage starting point.',
  people:   'When people aren\'t included in change, even well-designed initiatives face unnecessary friction. This is worth investing in.',
  capacity: 'Without dedicated capacity, change initiatives compete with everything else — and often lose. Clear ownership changes this.',
  foresight:'Near-term planning creates near-term resilience. For durable change readiness, carving out time for longer-horizon thinking matters.',
  equity:   'Change that doesn\'t ask who benefits — and who bears the cost — tends to replicate existing inequities. This is a critical growth area.',
};
