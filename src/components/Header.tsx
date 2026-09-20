import { BookOpen, ShieldAlert, FileText, Sparkles, Globe } from "lucide-react";

interface HeaderProps {
  onOpenSafetyModal: () => void;
  onOpenGroundingModal: () => void;
  onOpenGlossaryModal: () => void;
  onOpenApiModal: () => void;
  hasGroundingContent: boolean;
  onSelectCentralQuestion: () => void;
}

export function Header({
  onOpenSafetyModal,
  onOpenGroundingModal,
  onOpenGlossaryModal,
  onOpenApiModal,
  hasGroundingContent,
  onSelectCentralQuestion
}: HeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-[#fdfcf9] sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Central Inscription */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-xl font-bold tracking-tight shadow-xs">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">Athenology</h1>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                Educational AI
              </span>
            </div>
            <p className="text-xs text-stone-600 font-sans">
              Social Psychology & Cognitive Psychology in Digital Environments
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* API & Squarespace Integration Button */}
          <button
            id="btn-api-squarespace"
            type="button"
            onClick={onOpenApiModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-300 bg-stone-900 text-white hover:bg-stone-800 shadow-2xs transition-colors"
            title="Access public Web API and Squarespace embed widget"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>API & Squarespace</span>
          </button>

          {/* Research Grounding Button */}
          <button
            id="btn-research-grounding"
            type="button"
            onClick={onOpenGroundingModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              hasGroundingContent
                ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold"
                : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"
            }`}
            title="Attach or inspect course readings & professor lecture materials"
          >
            <FileText className={`w-3.5 h-3.5 ${hasGroundingContent ? "text-amber-700" : "text-stone-500"}`} />
            <span>Research Grounding</span>
            {hasGroundingContent && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          {/* Psychology Glossary Button */}
          <button
            id="btn-psychology-glossary"
            type="button"
            onClick={onOpenGlossaryModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-500" />
            <span>Key Terms</span>
          </button>

          {/* Safety & Educational Ethics Button */}
          <button
            id="btn-safety-ethics"
            type="button"
            onClick={onOpenSafetyModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
            <span>Safety & Scope</span>
          </button>
        </div>
      </div>

      {/* Central Question Inquiry Bar */}
      <div className="bg-stone-100/80 border-t border-stone-200/80 px-4 py-1.5 sm:px-6 text-xs text-stone-700 flex items-center justify-between gap-2">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 uppercase tracking-wider text-[10px] bg-stone-200/70 px-1.5 py-0.5 rounded">
              Central Question
            </span>
            <span className="font-serif italic text-stone-800">
              "What are the psychological consequences of living in a digital, algorithm-driven social media environment?"
            </span>
          </div>

          <button
            id="btn-explore-central-question"
            type="button"
            onClick={onSelectCentralQuestion}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-800 hover:text-stone-950 underline underline-offset-2 ml-auto"
          >
            <Sparkles className="w-3 h-3 text-amber-700" />
            Ask Athenology This Question
          </button>
        </div>
      </div>
    </header>
  );
}
