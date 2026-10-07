export function parseAgentOutput(output) {
  if (output === undefined || output === null) {
    return { ok: false, error: "The History API returned no Agent Output." };
  }

  let value = output;

  if (typeof value === "string") {
    let text = value.trim();

    if (!text) {
      return { ok: false, error: "The Agent Output is empty." };
    }

    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      value = JSON.parse(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");

      if (start >= 0 && end > start) {
        try {
          value = JSON.parse(text.slice(start, end + 1));
        } catch {
          return {
            ok: false,
            error: "Agent Output was received, but it is not valid JSON."
          };
        }
      } else {
        return {
          ok: false,
          error: "Agent Output was received, but it is not valid JSON."
        };
      }
    }
  }

  if (!value || typeof value !== "object" || !Array.isArray(value.products)) {
    return {
      ok: false,
      error: "Agent Output was received, but the expected products[] structure was not found."
    };
  }

  return { ok: true, data: value };
}
