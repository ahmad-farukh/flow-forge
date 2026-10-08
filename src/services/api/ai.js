import { APPWRITE } from "../appwrite/config";

const GEMINI_KEY_STORAGE = "flowforge-gemini-api-key";
const GEMINI_MODEL_STORAGE = "flowforge-gemini-model";

export function getGeminiApiKey() {
  try {
    return String(localStorage.getItem(GEMINI_KEY_STORAGE) || APPWRITE.geminiApiKey || "").trim();
  } catch {
    return APPWRITE.geminiApiKey || "";
  }
}

export function getGeminiModel() {
  try {
    return String(localStorage.getItem(GEMINI_MODEL_STORAGE) || APPWRITE.geminiModel || "gemini-2.5-flash").trim();
  } catch {
    return APPWRITE.geminiModel || "gemini-2.5-flash";
  }
}

export function saveGeminiConfig(apiKey, model = "gemini-2.5-flash") {
  const key = String(apiKey || "").trim();
  const selectedModel = String(model || "gemini-2.5-flash").trim();
  if (!key) throw new Error("Please enter your Gemini API key.");
  localStorage.setItem(GEMINI_KEY_STORAGE, key);
  localStorage.setItem(GEMINI_MODEL_STORAGE, selectedModel);
}

export function clearGeminiConfig() {
  localStorage.removeItem(GEMINI_KEY_STORAGE);
  localStorage.removeItem(GEMINI_MODEL_STORAGE);
}

function extractText(data) {
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || data?.response || data?.output || data?.result || "";
}

function normalizeHistory(history = []) {
  return history
    .filter((item) => item?.content?.trim())
    .slice(-12)
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: String(item.content) }],
    }));
}

export async function askAI(prompt, history = []) {
  const text = String(prompt || "").trim();
  if (!text) return "";

  if (APPWRITE.aiFunctionId) {
    const response = await fetch(`${APPWRITE.endpoint}/functions/${APPWRITE.aiFunctionId}/executions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Appwrite-Project": APPWRITE.projectId },
      body: JSON.stringify({ prompt: text, history: normalizeHistory(history) }),
    });
    const functionData = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(functionData?.message || `AI service failed (${response.status}).`);
    return extractText(functionData) || "The AI service returned an empty response. Please try again.";
  }

  const apiKey = getGeminiApiKey();
  const model = getGeminiModel();
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Open AI Assistant → AI Settings and paste your Gemini API key, or add VITE_GEMINI_API_KEY to .env and restart Vite.");
  }

  const contents = [...normalizeHistory(history), { role: "user", parts: [{ text }] }];
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: "You are FlowForge AI, a professional project-management assistant. Give useful, direct answers. When asked about projects, tasks, teams, calendars, files, analytics, or productivity, provide practical structured guidance. Do not claim to have performed an action unless the application actually performed it." }],
      },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 1600 },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `Gemini request failed (${response.status}).`;
    throw new Error(message);
  }
  const answer = extractText(data);
  if (!answer) throw new Error("Gemini returned an empty response. Please try again.");
  return answer;
}
