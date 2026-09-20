import React, { useState } from "react";
import {
  X,
  Code,
  Globe,
  Copy,
  Check,
  Play,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface ApiIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiIntegrationModal({ isOpen, onClose }: ApiIntegrationModalProps) {
  const [activeTab, setActiveTab] = useState<"tester" | "squarespace" | "curl">("tester");

  // Tester state
  const [testMessage, setTestMessage] = useState("Why is it so hard to stop scrolling on Instagram or TikTok?");
  const [testHistory, setTestHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);

  // Copied flags
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  // Determine the live public URL
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const publicApiUrl = `${currentOrigin}/api/v1/chat`;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleRunTest = async () => {
    if (!testMessage.trim() || testLoading) return;
    setTestLoading(true);
    setTestResponse(null);
    setTestStatus(null);
    const startTime = performance.now();

    try {
      const payload = {
        message: testMessage.trim(),
        history: testHistory
      };

      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const elapsed = Math.round(performance.now() - startTime);
      setTestLatency(elapsed);
      setTestStatus(res.status);

      const json = await res.json();
      setTestResponse(json);

      if (json.conversationHistory) {
        setTestHistory(json.conversationHistory);
      }
    } catch (err: any) {
      setTestStatus(500);
      setTestResponse({ error: err.message || "Failed to execute API request" });
    } finally {
      setTestLoading(false);
    }
  };

  const handleResetTestHistory = () => {
    setTestHistory([]);
    setTestResponse(null);
    setTestLatency(null);
    setTestStatus(null);
  };

  // Ready-to-use Squarespace Embed Code
  const squarespaceEmbedCode = `<!-- Athenology AI Squarespace Chat Widget -->
<div id="athenology-widget-container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 20px auto; border: 1px solid #e7e5e4; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
  <!-- Header -->
  <div style="background: #1c1917; color: #f5f5f4; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 28px; height: 28px; border-radius: 6px; background: #fafaf9; color: #1c1917; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px;">A</div>
      <div>
        <div style="font-weight: 600; font-size: 15px; letter-spacing: -0.01em;">Athenology</div>
        <div style="font-size: 11px; opacity: 0.8;">Digital Psychology AI</div>
      </div>
    </div>
    <span style="font-size: 10px; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em;">AI Active</span>
  </div>

  <!-- Messages List -->
  <div id="athenology-messages" style="height: 320px; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; background: #fafaf9;">
    <div style="align-self: flex-start; background: #ffffff; color: #292524; padding: 10px 14px; border-radius: 10px; border: 1px solid #e7e5e4; font-size: 13.5px; line-height: 1.5; max-width: 90%;">
      Hello! I'm <strong>Athenology</strong>. Ask me anything about how social media, recommendation algorithms, and digital environments shape our cognitive and social psychology.
    </div>
  </div>

  <!-- Input Form -->
  <form id="athenology-form" style="display: flex; gap: 8px; padding: 12px; background: #ffffff; border-top: 1px solid #e7e5e4;">
    <input
      type="text"
      id="athenology-input"
      placeholder="Ask a question about digital psychology..."
      style="flex: 1; padding: 10px 14px; border: 1px solid #d6d3d1; border-radius: 8px; font-size: 13.5px; outline: none;"
      required
    />
    <button
      type="submit"
      id="athenology-send-btn"
      style="background: #1c1917; color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 500; font-size: 13.5px; cursor: pointer;"
    >
      Send
    </button>
  </form>
</div>

<script>
(function() {
  var API_ENDPOINT = "${publicApiUrl}";
  var history = [];
  var messagesContainer = document.getElementById("athenology-messages");
  var form = document.getElementById("athenology-form");
  var input = document.getElementById("athenology-input");
  var sendBtn = document.getElementById("athenology-send-btn");

  function appendMsg(role, text) {
    var div = document.createElement("div");
    div.style.maxWidth = "90%";
    div.style.padding = "10px 14px";
    div.style.borderRadius = "10px";
    div.style.fontSize = "13.5px";
    div.style.lineHeight = "1.5";
    div.style.wordBreak = "break-word";

    if (role === "user") {
      div.style.alignSelf = "flex-end";
      div.style.background = "#1c1917";
      div.style.color = "#fafaf9";
    } else {
      div.style.alignSelf = "flex-start";
      div.style.background = "#ffffff";
      div.style.color = "#292524";
      div.style.border = "1px solid #e7e5e4";
    }
    div.textContent = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div;
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var query = input.value.trim();
    if (!query) return;

    appendMsg("user", query);
    input.value = "";
    input.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = "...";

    var loadingBubble = appendMsg("assistant", "Thinking...");

    fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, history: history })
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data.response) {
        loadingBubble.textContent = data.response;
        if (data.conversationHistory) {
          history = data.conversationHistory;
        }
      } else {
        loadingBubble.textContent = "Error: " + (data.error || "Could not retrieve response.");
      }
    })
    .catch(function(err) {
      loadingBubble.textContent = "Connection error. Please try again.";
    })
    .finally(function() {
      input.disabled = false;
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
      input.focus();
    });
  });
})();
</script>`;

  // Javascript Fetch code snippet
  const fetchSnippet = `// Calling Athenology Web API from JavaScript / Squarespace
const API_URL = "${publicApiUrl}";

let conversationHistory = [];

async function askAthenology(userQuestion) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: userQuestion,
      history: conversationHistory // Keeps multi-turn context
    })
  });

  const data = await response.json();
  console.log("Athenology Reply:", data.response);

  // Update history for follow-up questions
  if (data.conversationHistory) {
    conversationHistory = data.conversationHistory;
  }
  return data.response;
}

// Example invocation:
askAthenology("Why do I compare myself to people on social media?");`;

  // cURL snippet
  const curlSnippet = `curl -X POST "${publicApiUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Why is it so hard to stop scrolling?",
    "history": []
  }'`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                Athenology Web API & Squarespace Integration
              </h2>
              <p className="text-xs text-stone-500 font-sans">
                Full-stack JSON API endpoint with CORS enabled for Squarespace websites
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/50 px-6 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab("tester")}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "tester"
                ? "border-stone-900 text-stone-900 font-semibold bg-white rounded-t-md"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive API Tester</span>
          </button>
          <button
            onClick={() => setActiveTab("squarespace")}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "squarespace"
                ? "border-stone-900 text-stone-900 font-semibold bg-white rounded-t-md"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Squarespace Embed Widget</span>
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "curl"
                ? "border-stone-900 text-stone-900 font-semibold bg-white rounded-t-md"
                : "border-transparent text-stone-600 hover:text-stone-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>cURL & Fetch Code</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-stone-800 text-sm">
          {/* Key Specs Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 border border-stone-200 rounded-lg p-3.5 text-xs">
            <div>
              <span className="text-stone-500 font-medium block">Endpoint:</span>
              <code className="text-stone-900 font-mono font-bold bg-stone-200/70 px-1.5 py-0.5 rounded">
                POST /api/v1/chat
              </code>
            </div>
            <div>
              <span className="text-stone-500 font-medium block">CORS Support:</span>
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enabled for Squarespace
              </span>
            </div>
            <div>
              <span className="text-stone-500 font-medium block">Gemini Key Security:</span>
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Server-Side Protected
              </span>
            </div>
          </div>

          {/* TAB 1: INTERACTIVE API TESTER */}
          {activeTab === "tester" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">Live Endpoint Verification</h3>
                  <p className="text-xs text-stone-500">
                    Send a test payload to <code>/api/v1/chat</code> to verify multi-turn JSON responses.
                  </p>
                </div>
                {testHistory.length > 0 && (
                  <button
                    onClick={handleResetTestHistory}
                    className="text-xs text-stone-500 hover:text-red-600 underline font-medium"
                  >
                    Clear History ({testHistory.length / 2} turns)
                  </button>
                )}
              </div>

              {/* Multi-turn history pill */}
              {testHistory.length > 0 && (
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 max-h-36 overflow-y-auto space-y-1.5 text-xs font-mono">
                  <div className="text-[10px] text-stone-500 font-sans font-semibold uppercase tracking-wider">
                    Accumulated Context ({testHistory.length} messages):
                  </div>
                  {testHistory.map((msg, i) => (
                    <div key={i} className="flex gap-2">
                      <span className={msg.role === "user" ? "text-amber-700 font-bold" : "text-emerald-700 font-bold"}>
                        [{msg.role}]:
                      </span>
                      <span className="text-stone-700 truncate">{msg.content}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Form */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-700 block">
                  Test Message (supports questions or follow-ups):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRunTest()}
                    placeholder="Enter question to test API..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                  />
                  <button
                    onClick={handleRunTest}
                    disabled={testLoading || !testMessage.trim()}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 transition-all"
                  >
                    {testLoading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Calling API...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Response Panel */}
              {testResponse && (
                <div className="border border-stone-200 rounded-lg overflow-hidden bg-stone-900 text-stone-100">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-stone-950 border-b border-stone-800 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${testStatus === 200 ? "bg-emerald-900 text-emerald-300" : "bg-red-900 text-red-300"}`}>
                        HTTP {testStatus}
                      </span>
                      {testLatency && (
                        <span className="text-stone-400 text-[11px]">
                          {testLatency} ms
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(testResponse, null, 2), "testJson")}
                      className="text-stone-400 hover:text-white inline-flex items-center gap-1 text-[11px]"
                    >
                      {copiedSection === "testJson" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy JSON</span>
                    </button>
                  </div>
                  <div className="p-3.5 max-h-56 overflow-y-auto font-mono text-xs text-stone-200">
                    <pre>{JSON.stringify(testResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SQUARESPACE EMBED */}
          {activeTab === "squarespace" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Squarespace 3-Step Setup</h3>
                <p className="text-xs text-stone-600">
                  You can embed Athenology on any Squarespace page in under 60 seconds without installing plugins.
                </p>
              </div>

              {/* Instructions steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Edit Squarespace Page</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Open your Squarespace editor on the page where you want Athenology to appear and click <strong>Add Block</strong>.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Choose "Code" Block</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Select the <strong>Code</strong> block from the Squarespace block picker and set the display mode to <strong>HTML</strong>.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Paste & Save</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Paste the snippet below and click <strong>Save & Publish</strong>. The chat widget connects instantly to your live API.
                  </p>
                </div>
              </div>

              {/* Code snippet */}
              <div className="relative border border-stone-200 rounded-lg overflow-hidden bg-stone-900 text-stone-100">
                <div className="flex items-center justify-between px-4 py-2 bg-stone-950 border-b border-stone-800 text-xs">
                  <span className="font-mono text-stone-400">squarespace-athenology-embed.html</span>
                  <button
                    onClick={() => copyToClipboard(squarespaceEmbedCode, "squarespaceCode")}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded font-medium inline-flex items-center gap-1 text-xs transition-colors"
                  >
                    {copiedSection === "squarespaceCode" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Embed Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 max-h-60 overflow-y-auto font-mono text-xs text-stone-300">
                  <pre>{squarespaceEmbedCode}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CURL & JAVASCRIPT FETCH */}
          {activeTab === "curl" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">Developer Code Snippets</h3>
                <p className="text-xs text-stone-600">
                  Standard HTTP requests for calling Athenology from any frontend, backend, or script.
                </p>
              </div>

              {/* JavaScript Fetch */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">JavaScript / Fetch (Browser & Node)</label>
                  <button
                    onClick={() => copyToClipboard(fetchSnippet, "fetchSnippet")}
                    className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 font-medium"
                  >
                    {copiedSection === "fetchSnippet" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JavaScript</span>
                  </button>
                </div>
                <div className="p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{fetchSnippet}</pre>
                </div>
              </div>

              {/* cURL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">cURL Terminal Command</label>
                  <button
                    onClick={() => copyToClipboard(curlSnippet, "curlSnippet")}
                    className="text-xs text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 font-medium"
                  >
                    {copiedSection === "curlSnippet" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy cURL</span>
                  </button>
                </div>
                <div className="p-3 bg-stone-900 text-stone-200 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{curlSnippet}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
          <div>
            Public Endpoint: <code className="text-stone-800 font-mono font-semibold">{publicApiUrl}</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
