import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  FileText,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Message } from "./types";
import { Header } from "./components/Header";
import { ChatMessage } from "./components/ChatMessage";
import { ProfessorQuestions } from "./components/ProfessorQuestions";
import { SafetyDisclaimerModal } from "./components/SafetyDisclaimerModal";
import { ResearchGroundingModal } from "./components/ResearchGroundingModal";
import { GlossaryModal } from "./components/GlossaryModal";
import { ApiIntegrationModal } from "./components/ApiIntegrationModal";

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "welcome-1",
  role: "assistant",
  content: `### Welcome to Athenology

I am **Athenology**, an educational AI dedicated to **Social Psychology and Cognitive Psychology**, with a specific focus on the psychological consequences of living in a digital, algorithm-driven social media environment.

Our central question is:
> *"What are the psychological consequences of living in a digital, algorithm-driven social media environment?"*

---

#### Core Areas We Explore:
1. **Psychological Effects of Social Media**: How algorithms shape human *thoughts, attention, memory, perception, decision-making, emotions, self-evaluation, social comparison, habits, and relationships*.
2. **Healthier Relationships with Social Media**: Evidence-supported practical strategies and behavioral nudges designed to help students and emerging adults develop digital agency.
3. **Integration of Psychology**: Connecting cognitive psychology (e.g., *intermittent variable rewards*, *availability heuristic*, *working memory*) and social psychology (e.g., *Festinger's social comparison*, *parasocial ties*, *belonging hypothesis*) to explain our digital experiences.

---

Feel free to choose one of the **Professor-Provided Inquiry Prompts** below, or ask any question about digital psychology! You can also attach course reading notes via **Research Grounding** above.`,
  timestamp: Date.now()
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchNotes, setResearchNotes] = useState<string>("");

  // Modals state
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isGenerating) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: Date.now(),
      groundedInResearch: Boolean(researchNotes.trim())
    };

    const assistantPlaceholderId = `asst-${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      groundedInResearch: Boolean(researchNotes.trim())
    };

    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, assistantPlaceholder]);
    setInputText("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          researchNotes: researchNotes.trim()
        })
      });

      if (!response.ok || !response.body) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const rawChunk = decoder.decode(value, { stream: true });
        const lines = rawChunk.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              if (data.text) {
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholderId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              } else if (data.error) {
                accumulatedText += `\n\n*[Notice: ${data.error}]*`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholderId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              }
            } catch {
              // ignore partial lines
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to query Athenology:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                content: `**Athenology encountered a connection issue:** ${
                  err?.message || "Could not retrieve psychological analysis."
                }\n\nPlease verify that your Gemini API key is configured or retry your inquiry.`
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetryLastMessage = () => {
    if (isGenerating) return;
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove last assistant message if it exists
      const cleaned = messages.filter((_, idx) => idx !== messages.length - 1 || messages[messages.length - 1].role !== "assistant");
      setMessages(cleaned);
      handleSendMessage(lastUserMessage.content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetConversation = () => {
    if (confirm("Reset conversation to welcome state?")) {
      setMessages([INITIAL_WELCOME_MESSAGE]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f6f2] text-stone-800 font-sans">
      {/* Primary Header */}
      <Header
        onOpenSafetyModal={() => setIsSafetyOpen(true)}
        onOpenGroundingModal={() => setIsGroundingOpen(true)}
        onOpenGlossaryModal={() => setIsGlossaryOpen(true)}
        onOpenApiModal={() => setIsApiOpen(true)}
        hasGroundingContent={Boolean(researchNotes.trim())}
        onSelectCentralQuestion={() =>
          handleSendMessage(
            "What are the primary psychological consequences of living in a digital, algorithm-driven social media environment? Please synthesize key cognitive mechanisms, social dynamics, and evidence-informed health strategies."
          )
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 sm:px-6 flex flex-col gap-4">
        {/* Active Grounding Pill */}
        {researchNotes.trim() && (
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-lg flex items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-semibold text-amber-900">
                  Course Grounding Active:
                </span>{" "}
                <span className="text-amber-800">
                  Athenology is prioritizing your attached reading materials (
                  {researchNotes.trim().split(/\s+/).length} words).
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsGroundingOpen(true)}
                className="text-[11px] font-medium text-amber-900 hover:underline"
              >
                Inspect / Edit
              </button>
              <button
                type="button"
                onClick={() => setResearchNotes("")}
                className="text-[11px] text-stone-500 hover:text-red-700"
              >
                Detach
              </button>
            </div>
          </div>
        )}

        {/* Professor-Provided Questions Carousel (Collapsible or always ready) */}
        {messages.length <= 2 && (
          <div className="bg-white/80 border border-stone-200/90 rounded-xl p-4 shadow-2xs">
            <ProfessorQuestions
              onSelectQuestion={(q) => handleSendMessage(q)}
              isGenerating={isGenerating}
            />
          </div>
        )}

        {/* Conversation Message List */}
        <div className="flex-1 space-y-3 min-h-[360px]">
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isLastAssistantMessage={index === messages.length - 1 && msg.role === "assistant"}
              onRetry={handleRetryLastMessage}
              isGenerating={isGenerating}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Follow-up Inquiries (if conversation is ongoing) */}
        {messages.length > 1 && !isGenerating && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            <span className="text-stone-500 font-medium text-[11px] whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Suggested Inquiries:
            </span>
            {[
              "Explain Festinger's Social Comparison Theory with Instagram examples",
              "What is the slot machine effect in infinite scroll feeds?",
              "What are 3 practical cognitive nudges to reduce doomscrolling?",
              "How does the availability heuristic distort worldviews online?"
            ].map((suggested, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(suggested)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full border border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50 text-[11px] transition-colors flex items-center gap-1"
              >
                <span>{suggested}</span>
                <ArrowUpRight className="w-2.5 h-2.5 text-stone-400" />
              </button>
            ))}
          </div>
        )}

        {/* Input Dock */}
        <div className="sticky bottom-3 z-20 bg-white/95 backdrop-blur-md rounded-xl border border-stone-300 shadow-md p-3">
          <div className="relative">
            <textarea
              id="input-prompt"
              ref={textareaRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Ask Athenology about social psychology, cognitive biases, algorithmic effects, or study questions..."
              className="w-full text-xs sm:text-sm p-2.5 pr-24 rounded-lg border border-stone-200 bg-[#fbfaf8] focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 text-stone-900 placeholder:text-stone-600 resize-none leading-relaxed"
            />

            <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
              {messages.length > 2 && (
                <button
                  id="btn-reset-chat"
                  type="button"
                  onClick={handleResetConversation}
                  disabled={isGenerating}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-50"
                  title="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              <button
                id="btn-send-message"
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isGenerating}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                title="Send inquiry (Enter)"
              >
                {isGenerating ? (
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-600 gap-1.5 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-stone-600">
                <Info className="w-3 h-3 text-stone-600" />
                Press <strong>Enter</strong> to send • <strong>Shift + Enter</strong> for newline
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsGroundingOpen(true)}
                className="text-stone-700 hover:text-stone-900 underline underline-offset-2 flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-stone-600" />
                {researchNotes.trim() ? "Course Grounding Active" : "Add Course Reading Notes"}
              </button>
              <button
                type="button"
                onClick={() => setIsSafetyOpen(true)}
                className="text-stone-700 hover:text-stone-900 underline underline-offset-2 flex items-center gap-1"
              >
                <ShieldAlert className="w-3 h-3 text-stone-600" />
                Educational Safety Notice
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Educational Footer */}
        <footer className="text-center py-2 text-[11px] text-stone-600 border-t border-stone-200/80">
          <p>
            Athenology is an educational generative AI exploring social and cognitive psychology. Not clinical advice. In mental health crisis, dial or text <strong>988</strong> (USA & Canada).
          </p>
        </footer>
      </main>

      {/* Modals */}
      <SafetyDisclaimerModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      <ResearchGroundingModal
        isOpen={isGroundingOpen}
        onClose={() => setIsGroundingOpen(false)}
        researchNotes={researchNotes}
        onSaveNotes={(notes) => setResearchNotes(notes)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        onSelectTerm={(term) =>
          handleSendMessage(
            `Could you explain the psychological concept of "${term}", how it manifests in algorithm-driven social media environments, and what cognitive or social research says about it?`
          )
        }
      />

      <ApiIntegrationModal
        isOpen={isApiOpen}
        onClose={() => setIsApiOpen(false)}
      />
    </div>
  );
}
