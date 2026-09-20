export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  groundedInResearch?: boolean;
  categoryTag?: "Cognitive Psychology" | "Social Psychology" | "Applied Psychology" | "General Inquiry";
}

export interface ProfessorQuestion {
  id: string;
  title: string;
  category: "Cognitive Psychology" | "Social Psychology" | "Applied Psychology";
  question: string;
  hint: string;
  coreConcepts: string[];
}

export interface GlossaryTerm {
  term: string;
  field: "Cognitive Psychology" | "Social Psychology" | "Behavioral Science" | "Applied Psychology";
  definition: string;
  digitalExample: string;
}

export interface GroundingSource {
  title: string;
  content: string;
  dateAdded: number;
}
