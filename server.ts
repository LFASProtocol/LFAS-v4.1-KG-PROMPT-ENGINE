import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

// JSON request body parser
app.use(express.json());

// Initialize Gemini Client Lazily (avoids crashing on boot if key is missing)
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Settings menu or environment configuration.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const REFLECTION_SYSTEM_INSTRUCTION = `
You are an expert cognitive deconstructor and AI prompt engineer.
Your task is to analyze raw, messy, emotional, frustrated, or exhausted user inputs directed at AI or other systems.

You must deconstruct the input into:
1. A clean, empathetic, yet highly technical and analytical reflection text (the Cognitive Monologue) detailing what the user is experiencing, what they actually need, and any missing context.
2. A structured Knowledge Graph representing this deconstruction.

Nodes in the Knowledge Graph MUST have unique IDs such as "RAW_INPUT", "EMOTIONAL_STATE", "CORE_INTENT", "IMPLICIT_CONSTRAINTS", and "TARGET_OUTCOME".
Values for nodes must be concise summaries of those aspects.
`;

const ACTION_SYSTEM_INSTRUCTION = `
You are a master-level Prompt Engineer, Dataset Synthesizer, and AI Translation layer.
Your goal is to convert messy, emotional, frustrated, or exhausted user queries into "AI-Friendly", high-fidelity, professional, drama-free prompts and structured formats.

You will output a JSON object containing:
1. sentiment: A granular analysis of the user's emotional state, including levels (1-10) of frustration and exhaustion, emotional triggers, and dominant tone.
2. deconstruction: A breakdown of the core intent, implicit constraints, technical context, and critical missing parameters.
3. optimized_prompt: A masterpiece-level, polished, professional prompt in clean Markdown that is fully structured (e.g. Role, Clear Instructions, Input Data/Code, Constraints, Desired Output Format). It must be completely drama-free, structured to get the absolute best response from any LLM, and contain zero emotional clutter.
4. json_payload: A structured JSON representation of the prompt so a system can feed it to an API. Includes system_role, instructions array, context_variables map, and format_specification.
5. jsonl_record: A single-line JSONL format string representing a fine-tuning or prompt-logs pair. This is crucial for building AI friendly dataset records. Format:
{"messages": [{"role": "system", "content": "System instructions..."}, {"role": "user", "content": "<The raw messy emotional user input>"}, {"role": "assistant", "content": "<The optimized prompt or a perfect, clean AI-friendly response to the user's underlying core request>"}]}
`;

const COMPARE_SYSTEM_INSTRUCTION = `
You are an advanced AI debugger, compiler auditor, and LLM behavior comparator.
Your task is to take a raw messy user query and its drama-free optimized counterpart, and simulate how a typical high-performance LLM responds to both.

You must return:
1. rawOutput: The simulated response to the raw, messy input. (Standard LLMs get distracted by the tone, spend excessive tokens on pleasantries and consolations, or give generic hand-waving explanations instead of solving the exact technical details).
2. optimizedOutput: The simulated response to the optimized, drama-free, structured prompt. (This should be highly structured, precise, contain perfect production-ready code snippets/exact solutions, and satisfy all implicit technical requirements with zero filler).
3. metrics: Comparative telemetry analyzing the two executions.
`;

// API route: Compare
app.post("/api/compare", async (req, res) => {
  try {
    const { rawInput, optimizedPrompt } = req.body;
    if (!rawInput || !optimizedPrompt) {
      return res.status(400).send("Both rawInput and optimizedPrompt are required");
    }

    const ai = getGeminiClient();
    const prompt = `
      Compare these two versions of input:
      
      [VERSION A: RAW MESSY INPUT]
      "${rawInput}"
      
      [VERSION B: OPTIMIZED DRAMA-FREE PROMPT]
      "${optimizedPrompt}"
      
      Simulate the execution responses and perform behavioral comparison telemetry.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: COMPARE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rawOutput: { type: Type.STRING },
            optimizedOutput: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                rawTokensEstimated: { type: Type.INTEGER },
                optimizedTokensEstimated: { type: Type.INTEGER },
                noiseReductionPct: { type: Type.INTEGER },
                accuracyBoostPct: { type: Type.INTEGER },
                cognitiveOverheadAvoided: { type: Type.STRING },
                productivityInsight: { type: Type.STRING }
              },
              required: [
                "rawTokensEstimated", 
                "optimizedTokensEstimated", 
                "noiseReductionPct", 
                "accuracyBoostPct", 
                "cognitiveOverheadAvoided", 
                "productivityInsight"
              ]
            }
          },
          required: ["rawOutput", "optimizedOutput", "metrics"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error in /api/compare:", error);
    res.status(500).send(error.message || "An error occurred during prompt execution comparison.");
  }
});

// API route: Reflect
app.post("/api/reflect", async (req, res) => {
  try {
    const { rawInput } = req.body;
    if (!rawInput || typeof rawInput !== "string") {
      return res.status(400).send("rawInput is required and must be a string");
    }

    const ai = getGeminiClient();
    const prompt = `
      Analyze this raw user input:
      "${rawInput}"
      
      Deconstruct this input.
      Generate:
      1. An empathetic, detailed reflection text (Cognitive Monologue) highlighting:
         - What the user is feeling (exhaustion, frustration, panic, etc.)
         - What they are literally saying vs what they actually need (the underlying technical/logical goal)
         - The implicit parameters or technologies involved (e.g. specific frameworks, cost constraints)
         - What was omitted due to emotional state but is crucial to solve the problem.
         
      2. A Knowledge Graph with 5-7 nodes mapping this translation.
      
      You must output a JSON object with:
      - reflectionText (string, Markdown formatted, nice and neat)
      - dynamicKG (KnowledgeGraph object containing 'nodes' and 'edges')
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: REFLECTION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reflectionText: { type: Type.STRING },
            dynamicKG: {
              type: Type.OBJECT,
              properties: {
                nodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      val: { type: Type.STRING }
                    },
                    required: ["id", "val"]
                  }
                },
                edges: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      from: { type: Type.STRING },
                      to: { type: Type.STRING },
                      type: { type: Type.STRING }
                    },
                    required: ["from", "to"]
                  }
                }
              },
              required: ["nodes", "edges"]
            }
          },
          required: ["reflectionText", "dynamicKG"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error in /api/reflect:", error);
    res.status(500).send(error.message || "An error occurred during reflection.");
  }
});

// API route: Act / Synthesize
app.post("/api/act", async (req, res) => {
  try {
    const { rawInput, kg } = req.body;
    if (!rawInput || typeof rawInput !== "string") {
      return res.status(400).send("rawInput is required and must be a string");
    }

    const ai = getGeminiClient();
    const prompt = `
      Execute the [ACT] phase.
      Transform the raw messy emotional input:
      "${rawInput}"
      
      Using the Knowledge Graph context:
      ${JSON.stringify(kg || {})}
      
      Generate the structured PromptOptimizationResult. Make sure:
      - optimized_prompt is extremely professional, clear, direct, and structured with clear markdown headings (e.g. ## Role, ## Objective, ## Constraints).
      - jsonl_record is a single line of valid JSONL that models can use to learn how to translate this emotional query to a professional response.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: ACTION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.OBJECT,
              properties: {
                frustration_level: { type: Type.INTEGER },
                exhaustion_level: { type: Type.INTEGER },
                emotional_signals: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                dominant_tone: { type: Type.STRING }
              },
              required: ["frustration_level", "exhaustion_level", "emotional_signals", "dominant_tone"]
            },
            deconstruction: {
              type: Type.OBJECT,
              properties: {
                core_intent: { type: Type.STRING },
                implicit_constraints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                technical_context: { type: Type.STRING },
                missing_parameters: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["core_intent", "implicit_constraints", "technical_context", "missing_parameters"]
            },
            optimized_prompt: { type: Type.STRING },
            json_payload: {
              type: Type.OBJECT,
              properties: {
                system_role: { type: Type.STRING },
                instructions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                context_variables: {
                  type: Type.OBJECT,
                  additionalProperties: { type: Type.STRING }
                },
                format_specification: { type: Type.STRING }
              },
              required: ["system_role", "instructions", "format_specification"]
            },
            jsonl_record: { type: Type.STRING }
          },
          required: ["sentiment", "deconstruction", "optimized_prompt", "json_payload", "jsonl_record"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error in /api/act:", error);
    res.status(500).send(error.message || "An error occurred during synthesis.");
  }
});

// Configure static rendering & Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files serving enabled.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} under environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
