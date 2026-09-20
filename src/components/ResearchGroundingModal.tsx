import React, { useState } from "react";
import { X, FileText, Check, Trash2, BookOpen } from "lucide-react";
import { SAMPLE_READINGS } from "../data/curatedQuestions";

interface ResearchGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchNotes: string;
  onSaveNotes: (notes: string) => void;
}

export function ResearchGroundingModal({
  isOpen,
  onClose,
  researchNotes,
  onSaveNotes
}: ResearchGroundingModalProps) {
  const [localNotes, setLocalNotes] = useState(researchNotes);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveNotes(localNotes);
    onClose();
  };

  const handleClear = () => {
    setLocalNotes("");
    onSaveNotes("");
  };

  const handleLoadSample = (sampleText: string) => {
    setLocalNotes(sampleText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        id="modal-research-grounding"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fdfcf9] border border-stone-300 rounded-xl shadow-xl p-6 text-stone-800"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-200/70 text-stone-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Research Grounding & Course Materials
              </h2>
              <p className="text-xs text-stone-600">
                Supply syllabus readings, empirical study excerpts, or lecture notes
              </p>
            </div>
          </div>
          <button
            id="btn-close-grounding-modal"
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 rounded-lg bg-stone-100/90 border border-stone-200 text-xs text-stone-700 leading-relaxed">
          <p className="font-semibold text-stone-900 mb-1">
            Grounding Instruction Mandate:
          </p>
          <p>
            When research materials are entered below, Athenology treats them as the <strong>primary source of truth</strong>, directly cites specific authors or findings, and refrains from inventing unverified claims.
          </p>
        </div>

        {/* Sample reading presets */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1.5">
            Quick Load Course Reading Samples:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_READINGS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.content)}
                className="text-left p-2.5 rounded-lg border border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50 transition-colors text-xs group"
              >
                <div className="flex items-center gap-1.5 font-medium text-stone-900 group-hover:text-amber-900">
                  <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                  <span>{sample.title}</span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                  Click to populate editor with this excerpt
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="input-research-notes" className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
              Paste Academic Materials / Notes:
            </label>
            {localNotes.trim().length > 0 && (
              <span className="text-[11px] text-stone-500">
                {localNotes.trim().split(/\s+/).length} words
              </span>
            )}
          </div>
          <textarea
            id="input-research-notes"
            rows={7}
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Paste your professor's lecture summary, assigned paper abstract (e.g., Festinger, Skinner, Twenge, Kahneman), or course reading excerpts here..."
            className="w-full text-xs font-mono p-3 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 text-stone-800 leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Materials
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Save Grounding Context
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
