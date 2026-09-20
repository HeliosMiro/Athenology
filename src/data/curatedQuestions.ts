import { ProfessorQuestion } from "../types";

export const PROFESSOR_QUESTIONS: ProfessorQuestion[] = [
  {
    id: "q1",
    title: "Algorithmic Loops & Cognitive Biases",
    category: "Cognitive Psychology",
    question: "How do recommendation algorithms (like TikTok's 'For You' or Instagram's Reels) exploit cognitive biases such as confirmation bias and the availability heuristic?",
    hint: "Examines attention capture, cognitive ease, and selective exposure.",
    coreConcepts: ["Confirmation Bias", "Availability Heuristic", "Cognitive Ease", "Filter Bubbles"]
  },
  {
    id: "q2",
    title: "Active vs. Passive Media Consumption",
    category: "Social Psychology",
    question: "What is the psychological difference between 'active' and 'passive' social media consumption, and what does current research say about their impact on well-being?",
    hint: "Differentiates direct messaging/social capital from mindless downward scrolling.",
    coreConcepts: ["Social Comparison", "Social Capital", "Passive Lurking", "Subjective Well-Being"]
  },
  {
    id: "q3",
    title: "Social Comparison Theory & Curated Feeds",
    category: "Social Psychology",
    question: "How does Leon Festinger's Social Comparison Theory explain the psychological impact of viewing curated highlight reels and filtered self-presentations?",
    hint: "Explores upward vs. downward social comparison and subjective self-worth.",
    coreConcepts: ["Upward Social Comparison", "Impression Management", "Self-Discrepancy", "FOMO"]
  },
  {
    id: "q4",
    title: "Variable Rewards & Doomscrolling",
    category: "Cognitive Psychology",
    question: "How do intermittent variable reinforcement schedules (the 'slot machine effect') explain endless scrolling, pull-to-refresh mechanics, and doomscrolling?",
    hint: "Connects operant conditioning, dopamine anticipation, and cognitive friction.",
    coreConcepts: ["Intermittent Reinforcement", "Operant Conditioning", "Attentional Hijacking", "Doomscrolling"]
  },
  {
    id: "q5",
    title: "Digital Hyper-Connectivity & Loneliness",
    category: "Social Psychology",
    question: "Why can hyper-connected emerging adults report feeling increasingly isolated? How do parasocial interactions and superficial digital ties interact with genuine belonging?",
    hint: "Analyzes Sherry Turkle's 'Alone Together' paradox and parasocial relationship dynamics.",
    coreConcepts: ["Parasocial Interaction", "The Belonging Hypothesis", "Weak Ties", "Alone Together Paradox"]
  },
  {
    id: "q6",
    title: "Evidence-Based Digital Health Strategies",
    category: "Applied Psychology",
    question: "What evidence-informed cognitive and behavioral nudges can emerging adults realistically implement to foster psychological agency over algorithm-driven feeds?",
    hint: "Focuses on implementation intentions, environment redesign, and metacognitive friction.",
    coreConcepts: ["Implementation Intentions", "Choice Architecture", "Metacognitive Friction", "Digital Autonomy"]
  }
];

export const SAMPLE_READINGS = [
  {
    title: "Cognitive Architecture & Social Media Algorithms (Course Note)",
    content: `Course Excerpt - Cognitive Psychology of Digital Media (Unit 4):
Social media platforms optimize for user retention by leveraging variable interval/ratio reinforcement schedules (B.F. Skinner). Unlike fixed rewards, unpredictable rewards trigger dopamine surges associated with anticipation rather than consummation.
Furthermore, recommendation engines exploit the 'Availability Heuristic' (Tversky & Kahneman, 1973): content that is emotionally provocative or viral is mentally retrieved more easily, distorting users' perceptions of social norms and base-rate frequencies in the physical world.`
  },
  {
    title: "Social Comparison Theory & Curated Feeds (Lecture Summary)",
    content: `Social Psychology Seminar Excerpt - Social Comparison in Digital Spaces:
Leon Festinger (1954) posited that humans possess an innate drive to evaluate their opinions and abilities by comparing themselves to others. In offline life, comparison targets are proximate peers.
Online, algorithmic feeds curate an extreme sample of upward comparison targets (e.g., peak physical aesthetics, lavish travels, curated milestones). Research by Verduyn et al. (2017) suggests passive browsing intensifies upward social comparison, leading to envy and diminished subjective well-being, whereas active communicative engagement (direct messaging) shows neutral to mildly positive social capital effects.`
  }
];
