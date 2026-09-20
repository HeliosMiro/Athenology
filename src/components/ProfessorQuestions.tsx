import { Sparkles, Brain, Users, Compass, ChevronRight } from "lucide-react";
import { ProfessorQuestion } from "../types";
import { PROFESSOR_QUESTIONS } from "../data/curatedQuestions";

interface ProfessorQuestionsProps {
  onSelectQuestion: (questionText: string) => void;
  isGenerating: boolean;
}

export function ProfessorQuestions({ onSelectQuestion, isGenerating }: ProfessorQuestionsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cognitive Psychology":
        return <Brain className="w-3.5 h-3.5 text-indigo-700" />;
      case "Social Psychology":
        return <Users className="w-3.5 h-3.5 text-amber-700" />;
      case "Applied Psychology":
        return <Compass className="w-3.5 h-3.5 text-emerald-700" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  const getBadgeClass = (category: string) => {
    switch (category) {
      case "Cognitive Psychology":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Social Psychology":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Applied Psychology":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Professor-Provided Inquiry Prompts
          </span>
          <span className="text-[10px] text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded-full font-medium">
            Core Curated Topics
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PROFESSOR_QUESTIONS.map((item: ProfessorQuestion) => (
          <button
            key={item.id}
            id={`btn-question-${item.id}`}
            type="button"
            disabled={isGenerating}
            onClick={() => onSelectQuestion(item.question)}
            className="group text-left p-3 rounded-lg border border-stone-200/90 bg-[#fdfcf9] hover:border-stone-400 hover:bg-white transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeClass(
                    item.category
                  )}`}
                >
                  {getCategoryIcon(item.category)}
                  {item.category}
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xs line-clamp-1 group-hover:text-stone-950">
                {item.title}
              </h3>
              <p className="text-[11px] text-stone-700 mt-1 leading-relaxed line-clamp-2">
                {item.question}
              </p>
            </div>

            <div className="mt-2.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-700">
              <span className="line-clamp-1">{item.hint}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
