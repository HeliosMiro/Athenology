import { X, ShieldAlert, HeartHandshake, BookOpen, AlertTriangle } from "lucide-react";

interface SafetyDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SafetyDisclaimerModal({ isOpen, onClose }: SafetyDisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        id="modal-safety-scope"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fdfcf9] border border-stone-300 rounded-xl shadow-xl p-6 text-stone-800"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-900">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Psychological Safety & Ethical Scope
              </h2>
              <p className="text-xs text-stone-600">
                Guiding principles and boundaries of the Athenology educational system
              </p>
            </div>
          </div>
          <button
            id="btn-close-safety-modal"
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-stone-700 font-sans">
          <div className="p-3.5 bg-stone-100/90 rounded-lg border border-stone-200">
            <h3 className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-stone-700" />
              Educational Purpose & Core Philosophy
            </h3>
            <p className="mt-1.5 text-stone-700">
              Athenology is designed to help college students, young people, and the public explore the scientific intersections of <strong>social psychology</strong> and <strong>cognitive psychology</strong> within algorithm-driven digital platforms. Athenology’s goal is to help users understand psychology, not tell users what they should believe.
            </p>
          </div>

          <div className="p-3.5 bg-red-50/80 rounded-lg border border-red-200/80 text-red-950">
            <h3 className="font-semibold text-red-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-700" />
              Not a Substitute for Clinical Care or Diagnosis
            </h3>
            <ul className="mt-1.5 list-disc list-inside space-y-1 text-red-900 text-xs">
              <li><strong>Athenology does NOT diagnose mental disorders.</strong></li>
              <li><strong>Athenology does NOT claim that any user has a psychological condition.</strong></li>
              <li><strong>Athenology never replaces a licensed psychologist, clinical counselor, psychiatrist, or physician.</strong></li>
              <li>Educational psychological discussions are never individualized medical or clinical advice.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-stone-900 text-xs uppercase tracking-wider mb-2">
              How Athenology Evaluates Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="font-semibold text-stone-900 block">1. Research Findings</span>
                <span className="text-stone-600">Empirical observations, sample sizes, and measured outcomes from scientific studies.</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="font-semibold text-stone-900 block">2. Psychological Concepts</span>
                <span className="text-stone-600">Theoretical frameworks (e.g., Social Comparison, Variable Reinforcement, Availability Heuristic).</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="font-semibold text-stone-900 block">3. Possible Interpretations</span>
                <span className="text-stone-600">Ongoing scientific debates, competing hypotheses, and boundaries of current evidence.</span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="font-semibold text-stone-900 block">4. Practical Suggestions</span>
                <span className="text-stone-600">Actionable cognitive nudges and behavioral adaptations for digital intentionality.</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-stone-100/90 rounded-lg border border-stone-200">
            <h3 className="font-semibold text-stone-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-stone-700" />
              Scientific Nuance & Non-Simplistic Causality
            </h3>
            <p className="mt-1.5 text-xs text-stone-700 leading-relaxed">
              Athenology avoids treating every negative experience as automatically or monolithically caused by social media alone. Empirical psychology recognizes critical interacting factors: individual baseline differences, context, content encountered, user motivations (active engagement vs. passive lurking), and algorithmic exposure.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-950">
            <h3 className="font-semibold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              Immediate Support & Crisis Resources
            </h3>
            <p className="mt-1 text-xs text-amber-900">
              If you or someone you know is experiencing severe distress, crisis, or mental health emergency:
            </p>
            <div className="mt-2 text-xs space-y-1 font-medium text-amber-900">
              <p>• <strong>Suicide & Crisis Lifeline:</strong> Call or text <strong>988</strong> (USA & Canada, free & 24/7 confidential)</p>
              <p>• <strong>Crisis Text Line:</strong> Text <strong>HOME</strong> to <strong>741741</strong></p>
              <p>• <strong>Campus Services:</strong> Reach out to your college counseling center or local emergency medical services.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            id="btn-confirm-safety"
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
