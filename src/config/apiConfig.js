const DEFAULT_JWT_TOKEN = "[REDACTED_JSON_WEB_TOKEN_1]";
const TOKEN_STORAGE_KEY = "ctrlai.jwtToken";
const MODE_STORAGE_KEY = "ctrlai.analysisMode";
const DEFAULT_EXECUTION_ID = "2f3027fe-a5bf-4b28-a6b0-5e4c9b33f08a";

const API_CONFIG = {
  baseUrl: "https://int-ai.aava.ai",

  endpoints: {
    userDetails: "/api/auth/user/details/v2",
    studioInfo: "/api/auth/studioInfo",
    agentExecution: "/agents/execute/agent-executions",
    executionHistory: "/agents/execute/history/execution",
  },

  defaults: {
    jwtToken: DEFAULT_JWT_TOKEN,
    analysisMode: "executionId",
    executionId: DEFAULT_EXECUTION_ID,
  },

  storageKeys: {
    jwtToken: TOKEN_STORAGE_KEY,
    analysisMode: MODE_STORAGE_KEY,
  },

  get jwtToken() {
    const saved = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (saved !== null) return saved.trim();
    return String(import.meta.env.VITE_JWT_TOKEN || DEFAULT_JWT_TOKEN).trim();
  },

  get analysisMode() {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return saved === "agentId" || saved === "executionId" ? saved : "executionId";
  },
};

export default API_CONFIG;
