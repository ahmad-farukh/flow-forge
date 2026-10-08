import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setLoading } from "../../store/slices/aiSlice";
import { askAI, clearGeminiConfig, getGeminiApiKey, getGeminiModel, saveGeminiConfig } from "../../services/api/ai";
import Button from "../common/Button";
import { formatDateTime } from "../../utils/date";

export default function AIAssistant() {
  const [prompt, setPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => getGeminiApiKey());
  const [model, setModel] = useState(() => getGeminiModel());
  const [settingsMessage, setSettingsMessage] = useState("");
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.ai);

  const send = async () => {
    if (!prompt.trim() || loading) return;
    const value = prompt.trim();
    dispatch(addMessage({ role: "user", content: value, $createdAt: new Date().toISOString() }));
    setPrompt("");
    dispatch(setLoading(true));
    try {
      const answer = await askAI(value, messages);
      dispatch(addMessage({ role: "assistant", content: answer, $createdAt: new Date().toISOString() }));
    } catch (error) {
      dispatch(addMessage({ role: "assistant", content: error?.message || "AI request failed. Please try again.", $createdAt: new Date().toISOString() }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const saveSettings = () => {
    try {
      saveGeminiConfig(apiKey, model);
      setSettingsMessage("Gemini configuration saved. You can use AI now.");
    } catch (error) {
      setSettingsMessage(error.message);
    }
  };

  const clearSettings = () => {
    clearGeminiConfig();
    setApiKey("");
    setSettingsMessage("Local Gemini key cleared.");
  };

  return (
    <div className="ai-workspace">
      <div className="ai-chat panel">
        <div className="panel-head">
          <div><h2>AI Assistant</h2><small>Your AI-powered productivity partner.</small></div>
          <Button variant="ghost" onClick={() => setShowSettings((value) => !value)}>⚙ AI Settings</Button>
        </div>

        {showSettings && (
          <div className="ai-settings-card">
            <div>
              <h3>Connect Gemini</h3>
              <p className="muted">For local development you can save the key here. For production, use a server-side Appwrite Function instead of exposing a key in the browser.</p>
            </div>
            <label className="field"><span>Gemini API key</span><input className="input" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="AIza..." autoComplete="off" /></label>
            <label className="field"><span>Model</span><select className="input" value={model} onChange={(event) => setModel(event.target.value)}><option value="gemini-2.5-flash">gemini-2.5-flash</option><option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option></select></label>
            <div className="row-actions"><Button onClick={saveSettings}>Save Gemini</Button><Button variant="ghost" onClick={clearSettings}>Clear</Button></div>
            {settingsMessage && <small className="muted">{settingsMessage}</small>}
          </div>
        )}

        <div className="chat-body">
          {messages.length ? messages.map((message, index) => (
            <div className={`chat-msg ${message.role}`} key={`${message.$createdAt || "message"}-${index}`}>
              <span>{message.role === "user" ? "You" : "AI"}</span>
              <p>{message.content}</p>
              <small>{formatDateTime(message.$createdAt)}</small>
            </div>
          )) : (
            <div className="ai-empty"><div className="ai-orb">✦</div><h3>Ask FlowForge AI anything about your work.</h3><p>Try: “Create a marketing campaign plan.”</p></div>
          )}
        </div>
        <div className="chat-input">
          <textarea className="input textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Ask FlowForge AI…" />
          <Button onClick={send} disabled={loading}>{loading ? "Thinking…" : "Generate"}</Button>
        </div>
      </div>
      <aside className="panel recent-prompts"><h3>Recent Prompts</h3><button onClick={() => setPrompt("Break down a user authentication feature.")}>Break down a user auth project</button><button onClick={() => setPrompt("Create a marketing campaign plan.")}>Create marketing campaign plan</button><button onClick={() => setPrompt("Generate a project summary.")}>Generate project summary</button></aside>
    </div>
  );
}
