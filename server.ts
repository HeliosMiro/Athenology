import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// Universal CORS Middleware for external domains (e.g., Squarespace, custom domains, localhost)
app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Max-Age", "86400"); // 24 hours preflight cache
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// System instructions strictly reflecting Athenology specifications
const ATHENOLOGY_SYSTEM_INSTRUCTION = `You are Athenology, a friendly, thoughtful educational AI focused on Social Psychology and Cognitive Psychology, especially how everyday people experience digital environments and social media.

PERSONA & TONE:
- Sound conversational, warm, and natural—like a smart psychology student or knowledgeable friend having a real conversation with a student or curious young adult.
- Use ordinary, relatable language whenever possible.
- Never sound like a textbook, academic paper, lecturer, doctor, or a clinical psychologist writing a diagnostic formulation.
- Be comfortable with human, measured phrasing: "It depends," "One reason this can happen is...", "In simple terms...", "There isn't necessarily anything wrong with you for feeling that way."

CRITICAL SPEAKING & SAFETY RULES:
1. NEVER DIAGNOSE OR PATHOLOGIZE: Never call someone's behavior an addiction, disorder, condition, or clinical problem. Avoid dramatic labels like "you are clinically addicted," "you are trapped," or "your brain is being hijacked." When discussing personal habits, be reassuring and normalizing without diagnosing.
2. NO EXAGGERATED NEUROSCIENCE OR DRAMATIC JARGON: Do not casually use phrases like "dopamine hit," "hijacking your brain," "rewiring your brain," "your brain is addicted," or "textbook example." Avoid hyperbolic words like "weaponized," "manipulated," "destroying," or "ruining." Explain reward systems, habits, and attention simply and accurately.
3. CAUTIOUS & ACCURATE PSYCHOLOGY: Use thoughtful, grounded phrasing ("can," "may," "is associated with," "research suggests"). Distinguish normal psychological mechanisms from clinical disorders. Never overstate findings or present simplified ideas as absolute facts. Never invent studies or fake citations.
4. ANSWER THE PERSON'S ACTUAL QUESTION FIRST: Give a direct, plain-language answer first before adding a short explanation. Do not repeat or paraphrase the user's question before answering.
5. INTRODUCE PSYCHOLOGY TERMS NATURALLY: Only introduce technical terms when they genuinely help explain the concept. Introduce them casually (e.g., "Psychologists sometimes call this..." or "In psychology, this connects to...").
6. ONLY DISCUSS ALGORITHMS WHEN RELEVANT: Do not automatically turn every question into a discussion of algorithmic feeds unless it directly relates to what was asked.
7. NO CANNED OPENERS OR CLOSERS: Never begin with generic AI fillers ("Certainly!", "Great question!", "That's an excellent question!", "Let's explore...", "It's important to understand that...", "In today's digital age...") and never end with canned boilerplate ("I hope this helps!", "Let me know if you have questions!").

LENGTH & STRUCTURE:
- Keep answers to TWO TO THREE (2-3) SENTENCES TOTAL in almost all cases.
- Sentence 1: Direct, conversational answer to the person's question in plain language.
- Sentence 2: Simple, clear explanation of the psychological reasoning or mechanism.
- Sentence 3 (optional): A relatable example, nuance, or practical connection.
- No bullet lists, headers, or multi-paragraph walls of text.

SCOPE & OUT-OF-SCOPE:
- Scope: Social psychology, cognitive psychology, and everyday digital media interactions.
- Out of scope: If asked about non-psychology topics, reply in one short, natural sentence: "That's outside my focus—I mainly explore social and cognitive psychology and how we interact with digital media."
- Educational only: Provide psychological understanding, never clinical therapy or medical advice.`;

// Professor-provided questions curated for coursework and study
const PROFESSOR_QUESTIONS = [
  {
    id: "q1",
    title: "Algorithmic Loops & Cognitive Biases",
    category: "Cognitive Psychology",
    question: "How do recommendation algorithms (like TikTok's 'For You' or Instagram's Reels) exploit cognitive biases such as confirmation bias and the availability heuristic?",
    hint: "Examines attention capture, cognitive ease, and selective exposure."
  },
  {
    id: "q2",
    title: "Active vs. Passive Media Consumption",
    category: "Social Psychology",
    question: "What is the psychological difference between 'active' and 'passive' social media consumption, and what does current research say about their impact on well-being?",
    hint: "Differentiates direct messaging/social capital from mindless downward scrolling."
  },
  {
    id: "q3",
    title: "Social Comparison & Curated Feeds",
    category: "Social Psychology",
    question: "How does Festinger's Social Comparison Theory explain the psychological impact of viewing curated highlight reels and filtered self-presentations?",
    hint: "Explores upward vs. downward social comparison and subjective well-being."
  },
  {
    id: "q4",
    title: "Variable Rewards & Doomscrolling",
    category: "Cognitive Psychology",
    question: "How do intermittent variable reinforcement schedules (the 'slot machine effect') explain endless scrolling, pull-to-refresh mechanics, and doomscrolling?",
    hint: "Connects operant conditioning, dopamine anticipation, and cognitive friction."
  },
  {
    id: "q5",
    title: "Digital Hyper-Connectivity & Loneliness",
    category: "Social Psychology",
    question: "Why can hyper-connected young adults report feeling more isolated? How do parasocial interactions and superficial digital ties interact with genuine belonging?",
    hint: "Analyzes Sherry Turkle's 'Alone Together' paradox and parasocial relationship dynamics."
  },
  {
    id: "q6",
    title: "Evidence-Based Digital Health Strategies",
    category: "Applied Psychology",
    question: "What evidence-informed cognitive and behavioral nudges can emerging adults realistically implement to foster psychological agency over algorithm-driven feeds?",
    hint: "Focuses on implementation intentions, environment redesign, and metacognitive friction."
  }
];

// Lazy-initialized Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

// Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Athenology Educational AI",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

app.get("/api/professor-questions", (_req: Request, res: Response) => {
  res.json({ questions: PROFESSOR_QUESTIONS });
});

// Helper function to generate stream with automatic retry and model fallback
async function generateStreamWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>;
    systemInstruction: string;
  }
) {
  // Ordered models to try in case of temporary 503 service unavailability or high demand
  const modelsToTry = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    // Up to 2 attempts per model with exponential delay
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          // Wait 1 second before retry
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }

        const streamResponse = await ai.models.generateContentStream({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: 0.5,
            topP: 0.9
          }
        });

        return { streamResponse, modelUsed: model };
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const isTransient =
          errStr.includes("503") ||
          errStr.includes("429") ||
          errStr.includes("high demand") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("RESOURCE_EXHAUSTED");

        if (!isTransient) {
          // For non-transient errors, break attempt loop and try next model
          break;
        }
      }
    }
  }

  throw lastError || new Error("All AI models are temporarily unavailable. Please try again shortly.");
}

// Helper function to execute non-streaming generation with fallback
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>;
    systemInstruction: string;
  }
) {
  const modelsToTry = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
        }

        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: 0.5,
            topP: 0.9
          }
        });

        const replyText = response.text || "";
        if (replyText) {
          return { replyText, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errStr = String(err?.message || err);
        const isTransient =
          errStr.includes("503") ||
          errStr.includes("429") ||
          errStr.includes("high demand") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("RESOURCE_EXHAUSTED");

        if (!isTransient) {
          break;
        }
      }
    }
  }

  throw lastError || new Error("All AI models are temporarily unavailable. Please try again shortly.");
}

// API Metadata endpoint
app.get(["/api/v1/info", "/api/info"], (req: Request, res: Response) => {
  const host = req.get("host") || "localhost:3000";
  const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  res.json({
    name: "Athenology Public Web API",
    version: "1.0.0",
    description: "Educational AI API for Social Psychology & Cognitive Psychology in Digital Environments",
    cors: "Enabled (Access-Control-Allow-Origin: *)",
    endpoints: {
      chatJson: {
        method: "POST",
        url: `${baseUrl}/api/v1/chat`,
        aliasUrl: `${baseUrl}/api/chat`,
        contentType: "application/json",
        exampleBody: {
          message: "Why is it so hard to stop scrolling?",
          history: [
            { role: "user", content: "Hi Athenology!" },
            { role: "assistant", content: "Hey there! How can I help you explore social or cognitive psychology today?" }
          ]
        },
        exampleResponse: {
          status: "success",
          response: "That often happens because feeds give us unpredictable rewards, so we keep checking to see what comes next. In psychology, this is linked to reinforcement and habit cues that make stopping feel less automatic. Setting simple boundaries or taking short screen breaks can make it easier to step away.",
          reply: "That often happens because feeds give us unpredictable rewards...",
          conversationHistory: []
        }
      },
      chatStream: {
        method: "POST",
        url: `${baseUrl}/api/chat/stream`,
        contentType: "application/json",
        responseType: "text/event-stream"
      }
    }
  });
});

// Primary Web API: POST /api/v1/chat (and /api/chat) for Websites (Squarespace, custom sites, scripts)
app.post(["/api/v1/chat", "/api/chat"], async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body || {};
    let incomingMessages: Array<{ role: string; content: string }> = [];

    // Support multiple request formats for maximum client compatibility (e.g. Squarespace fetch calls)
    if (Array.isArray(body.messages) && body.messages.length > 0) {
      // Format 1: { messages: [{ role: 'user', content: '...' }] }
      incomingMessages = body.messages;
    } else if (typeof body.message === "string" && body.message.trim().length > 0) {
      // Format 2: { message: '...', history?: [{ role: 'user', content: '...' }] }
      const history = Array.isArray(body.history) ? body.history : Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
      incomingMessages = [...history, { role: "user", content: body.message.trim() }];
    } else {
      res.status(400).json({
        status: "error",
        error: "Missing required 'message' string or 'messages' array in request body.",
        example: {
          message: "Why do recommendation algorithms make us doomscroll?",
          history: []
        }
      });
      return;
    }

    const ai = getGeminiClient();

    // Prepare system instruction with any user-provided research grounding notes
    let systemInstruction = ATHENOLOGY_SYSTEM_INSTRUCTION;
    if (body.researchNotes && typeof body.researchNotes === "string" && body.researchNotes.trim().length > 0) {
      systemInstruction += `\n\n--- PROFESSOR / USER-PROVIDED RESEARCH GROUNDING MATERIALS ---\nThe user has uploaded/provided the following academic source materials for grounding:\n"""\n${body.researchNotes.trim()}\n"""\nINSTRUCTION FOR RESEARCH MATERIALS: Ground your analysis primarily in these provided materials. Cite authors, sections, or concepts found within them. Do not invent details beyond what is supported.`;
    }

    // Clean and normalize messages (keep last 10 for conversational context)
    const normalizedMessages: Array<{ role: "user" | "assistant"; content: string }> = incomingMessages
      .map((m: any) => ({
        role: (m.role === "assistant" || m.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: String(m.content || m.text || "")
      }))
      .filter((m) => m.content.trim().length > 0);

    if (normalizedMessages.length === 0) {
      res.status(400).json({ status: "error", error: "Message content cannot be empty." });
      return;
    }

    const contents = normalizedMessages.slice(-10).map((msg) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: msg.content }]
    }));

    const { replyText, modelUsed } = await generateContentWithFallback(ai, {
      contents,
      systemInstruction
    });

    // Construct updated conversation history to return to client
    const updatedHistory = [
      ...normalizedMessages,
      { role: "assistant" as const, content: replyText }
    ];

    res.json({
      status: "success",
      response: replyText,
      reply: replyText,
      message: replyText,
      conversationHistory: updatedHistory,
      history: updatedHistory,
      model: modelUsed,
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error("Gemini API Error in /api/v1/chat:", error);
    res.status(500).json({
      status: "error",
      error: error?.message || "Internal server error connecting to Athenology AI engine."
    });
  }
});

// Chat completion with SSE streaming
app.post(["/api/v1/chat/stream", "/api/chat/stream"], async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, researchNotes } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing or invalid 'messages' array in request body." });
      return;
    }

    const ai = getGeminiClient();

    // Prepare system instruction with any user-provided research grounding notes
    let systemInstruction = ATHENOLOGY_SYSTEM_INSTRUCTION;
    if (researchNotes && typeof researchNotes === "string" && researchNotes.trim().length > 0) {
      systemInstruction += `\n\n--- PROFESSOR / USER-PROVIDED RESEARCH GROUNDING MATERIALS ---\nThe user has uploaded/provided the following academic source materials for grounding:\n"""\n${researchNotes.trim()}\n"""\nINSTRUCTION FOR RESEARCH MATERIALS: Ground your analysis primarily in these provided materials. Cite authors, sections, or concepts found within them. Do not invent details beyond what is supported.`;
    }

    // Transform messages for gemini contents
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    // Keep last 10 messages for context
    const recentMessages = messages.slice(-10);
    for (const msg of recentMessages) {
      const role = msg.role === "assistant" ? "model" : "user";
      contents.push({
        role,
        parts: [{ text: String(msg.content || "") }]
      });
    }

    // Setup SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { streamResponse } = await generateStreamWithFallback(ai, {
      contents,
      systemInstruction
    });

    for await (const chunk of streamResponse) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat/stream:", error);
    let errorMessage = "The AI service is temporarily experiencing high traffic. Please click Retry in a moment.";
    if (error?.message) {
      try {
        const parsed = JSON.parse(error.message);
        if (parsed?.error?.message) {
          errorMessage = parsed.error.message;
        }
      } catch {
        errorMessage = error.message;
      }
    }

    if (!res.headersSent) {
      res.status(500).json({ error: errorMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
});

// Non-streaming chat endpoint fallback
app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, researchNotes } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing or invalid 'messages' array in request body." });
      return;
    }

    const ai = getGeminiClient();

    let systemInstruction = ATHENOLOGY_SYSTEM_INSTRUCTION;
    if (researchNotes && typeof researchNotes === "string" && researchNotes.trim().length > 0) {
      systemInstruction += `\n\n--- PROFESSOR / USER-PROVIDED RESEARCH GROUNDING MATERIALS ---\nThe user has uploaded/provided the following academic source materials for grounding:\n"""\n${researchNotes.trim()}\n"""\nINSTRUCTION FOR RESEARCH MATERIALS: Ground your analysis primarily in these provided materials. Cite authors, sections, or concepts found within them. Do not invent details beyond what is supported.`;
    }

    const contents = messages.slice(-10).map((msg: any) => ({
      role: (msg.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: String(msg.content || "") }]
    }));

    const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let lastError = null;
    let replyText = "";

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        replyText = response.text || "";
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!replyText && lastError) {
      throw lastError;
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Athenology server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
