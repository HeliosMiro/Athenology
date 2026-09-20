import { useState } from "react";
import { X, BookOpen, Search } from "lucide-react";
import { PSYCHOLOGY_GLOSSARY } from "../data/psychologyGlossary";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTerm?: (term: string) => void;
}

export function GlossaryModal({ isOpen, onClose, onSelectTerm }: GlossaryModalProps) {
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState<string>("All");

  if (!isOpen) return null;

  const filteredTerms = PSYCHOLOGY_GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase()) ||
      item.digitalExample.toLowerCase().includes(search.toLowerCase());
    const matchesField = activeField === "All" || item.field === activeField;
    return matchesSearch && matchesField;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        id="modal-glossary"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#fdfcf9] border border-stone-300 rounded-xl shadow-xl overflow-hidden text-stone-800"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-200/70 text-stone-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Psychological Terminology Reference
              </h2>
              <p className="text-xs text-stone-600">
                Core cognitive and social psychology concepts in digital contexts
              </p>
            </div>
          </div>
          <button
            id="btn-close-glossary-modal"
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-stone-100/70 border-b border-stone-200 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts or examples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-800"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {["All", "Cognitive Psychology", "Social Psychology", "Behavioral Science"].map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => setActiveField(field)}
                className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors ${
                  activeField === field
                    ? "bg-stone-900 text-white font-medium"
                    : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        {/* Term List */}
        <div className="p-5 overflow-y-auto space-y-4 max-h-[55vh]">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs">
              No matching psychological terms found. Try a different search query.
            </div>
          ) : (
            filteredTerms.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-stone-200 bg-white shadow-2xs hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    {item.term}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                    {item.field}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-stone-700 leading-relaxed">
                  {item.definition}
                </p>
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-start gap-1.5 text-xs text-stone-600 bg-stone-50/80 p-2 rounded">
                  <span className="font-semibold text-stone-800 shrink-0">Digital Context:</span>
                  <span className="italic">{item.digitalExample}</span>
                </div>

                {onSelectTerm && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTerm(item.term);
                        onClose();
                      }}
                      className="text-[11px] font-medium text-stone-800 hover:text-stone-950 underline underline-offset-2"
                    >
                      Ask Athenology to explore this concept →
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
