import API_CONFIG from "../config/apiConfig";

function requireToken() {
  const token = API_CONFIG.jwtToken;
  if (!token) {
    throw new Error(
      "JWT token is not configured. Add VITE_JWT_TOKEN to .env.local and restart the Vite server."
    );
  }
  return token;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return text; }
}

function headers() {
  return {
    Authorization: `Bearer ${requireToken()}`,
    Accept: "application/json, text/plain, */*",
  };
}

async function get(path) {
  const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    method: "GET",
    headers: headers(),
  });
  return {
    ok: response.ok,
    status: response.status,
    data: await parseResponse(response),
  };
}

export const getUserDetails = () => get(API_CONFIG.endpoints.userDetails);
export const getStudioInfo = () => get(API_CONFIG.endpoints.studioInfo);

export async function executeAgent(agentId, inputValue, file) {
  if (!String(agentId || "").trim()) throw new Error("Agent ID is required.");
  if (!file) throw new Error("Review file is required.");

  const formData = new FormData();
  formData.append("agentId", String(agentId).trim());
  formData.append(
    "userInputs",
    JSON.stringify({ "{{input_string_true}}": inputValue ?? "" })
  );
  formData.append("files", file);

  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.agentExecution}`,
    {
      method: "POST",
      headers: headers(),
      body: formData,
    }
  );

  return {
    ok: response.ok,
    status: response.status,
    data: await parseResponse(response),
  };
}

export function getExecutionHistory(executionId) {
  const id = String(executionId || "").trim();
  if (!id) throw new Error("Execution ID is required.");

  return get(
    `${API_CONFIG.endpoints.executionHistory}?execution_id=${encodeURIComponent(id)}`
  );
}
