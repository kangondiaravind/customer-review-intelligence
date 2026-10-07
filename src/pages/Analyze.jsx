import { useState } from "react";
import { executeAgent, getExecutionHistory } from "../services/apiService";
import { parseAgentOutput } from "../parser";
import API_CONFIG from "../config/apiConfig";
import StatusBanner from "../components/StatusBanner";

export default function Analyze({ onComplete, onViewResults }) {
  const [agentId, setAgentId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);
  const [manualId, setManualId] = useState(API_CONFIG.defaults.executionId);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [executionId, setExecutionId] = useState("");
  const [source, setSource] = useState("");
  const [mode, setMode] = useState(API_CONFIG.analysisMode);

  // Re-read settings whenever this page becomes visible again.
  const currentMode = (() => {
    const saved = localStorage.getItem(API_CONFIG.storageKeys.analysisMode);
    return saved === "agentId" || saved === "executionId" ? saved : mode;
  })();

  async function getResults(id, resultSource) {
    setExecutionId(id);
    setSource(resultSource);
    setStage("Fetching Results");
    const history = await getExecutionHistory(id);

    if (!history.ok) {
      throw new Error(currentMode === "executionId" ? "Invalid or unavailable Execution ID." : "Unable to retrieve the analysis results. Please try again.");
    }

    const parsed = parseAgentOutput(history.data?.output);
    if (!parsed.ok) throw new Error(parsed.error);
    onComplete(parsed.data, { executionId: id, source: resultSource });
  }

  async function submit() {
    setError("");

    if (currentMode === "executionId") {
      if (!manualId.trim()) {
        setError("Please enter an Execution ID.");
        return;
      }
    } else {
      if (!agentId.trim()) {
        setError("Please enter an Agent ID.");
        return;
      }
      if (!file) {
        setError("Please upload a customer review file.");
        return;
      }
    }

    setBusy(true);
    try {
      if (currentMode === "executionId") {
        await getResults(manualId.trim(), "Existing Execution");
        setStage("Completed");
        return;
      }

      setStage("Uploading");
      const execution = await executeAgent(agentId, inputValue, file);

      if (!execution.ok || execution.data?.status !== "SUCCESS") {
        throw new Error("Unable to complete the review analysis. Please try again.");
      }

      const id = execution.data?.data?.agentExecutionId;
      if (!id) throw new Error("Unable to complete the review analysis. Please try again.");

      setStage("Processing");
      await getResults(id, "New Analysis");
      setStage("Completed");
    } catch (err) {
      const message = err?.message || "Unable to complete the review analysis. Please try again.";
      setError(message.includes("JWT token") ? message : message);
      setStage("");
    } finally {
      setBusy(false);
    }
  }

  const stageText = {
    Uploading: "Uploading customer review data...",
    Processing: "Analyzing customer reviews...",
    "Fetching Results": "Preparing your review insights...",
    Completed: "Review analysis completed successfully."
  }[stage];

  return (
    <section className="analyzePage">
      <div className="pageIntro">
        <span className="heroPill">REVIEW ANALYSIS</span>
        <h1>Analyze Customer Reviews</h1>
        <p>{currentMode === "agentId" ? "Upload your customer review data and generate product intelligence with AI." : "Retrieve product intelligence from an existing review analysis execution."}</p>
      </div>

      <div className="analysisGrid">
        <section className="analysisCard primaryAnalysisCard">
          <div className="cardTitleRow">
            <div><span className="stepNumber">01</span><div><h2>{currentMode === "agentId" ? "Review Analysis Configuration" : "Get Existing Analysis"}</h2><p>{currentMode === "agentId" ? "Provide the values needed by the review-analysis agent." : "Enter an existing execution ID to retrieve its review intelligence."}</p></div></div>
          </div>

          {currentMode === "agentId" ? (
            <>
              <label>Agent ID</label>
              <input className="formInput" value={agentId} onChange={(e) => setAgentId(e.target.value)} placeholder="Enter Agent ID" inputMode="numeric" autoComplete="off" />
              <small className="helper">Enter the Agent ID for the review-analysis agent.</small>

              <label>Input Value <span className="optional">Optional</span></label>
              <input className="formInput" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter a value for the analysis" />
              <small className="helper">Your value is converted to the required API JSON automatically.</small>

              <label>Customer Review File</label>
              <label className={`dropzone ${file ? "hasFile" : ""}`}>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <span className="uploadIcon">↑</span>
                <b>{file ? file.name : "Upload or drag & drop your review file"}</b>
                <small>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected` : "Select the input file for AI analysis"}</small>
              </label>
            </>
          ) : (
            <>
              <label>Execution ID</label>
              <input className="formInput" value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder="Enter execution ID" autoComplete="off" />
              <small className="helper">This ID is pre-filled from the workspace defaults and can be edited.</small>
            </>
          )}

          {error && <StatusBanner type="error" title="Unable to continue" message={error} />}
          {stageText && <StatusBanner type={stage === "Completed" ? "success" : "info"} title={stage} message={stageText} />}

          <button type="button" className="analyzeButton" disabled={busy} onClick={submit}>
            {busy ? stageText || "Working..." : currentMode === "executionId" ? "Get Results" : "Analyze Customer Reviews"}
            {!busy && <span>→</span>}
          </button>
        </section>

        <aside className="processCard">
          <div className="eyebrow">ACTIVE ANALYSIS MODE</div>
          <h2>{currentMode === "agentId" ? "New review analysis." : "Existing execution."}</h2>
          {currentMode === "agentId" ? (
            <>
              <div className="processStep"><span>01</span><div><b>Configure</b><p>Enter the Agent ID and optional input value.</p></div></div><div className="processLine" />
              <div className="processStep"><span>02</span><div><b>Upload</b><p>Your customer review file enters the workflow.</p></div></div><div className="processLine" />
              <div className="processStep"><span>03</span><div><b>Analyze</b><p>AI identifies product review intelligence.</p></div></div><div className="processLine" />
              <div className="processStep"><span>04</span><div><b>Understand</b><p>The existing intelligence dashboard presents the result.</p></div></div>
            </>
          ) : (
            <>
              <div className="processStep"><span>01</span><div><b>Enter ID</b><p>Use an existing execution ID.</p></div></div><div className="processLine" />
              <div className="processStep"><span>02</span><div><b>Retrieve</b><p>The Execution History API is called directly.</p></div></div><div className="processLine" />
              <div className="processStep"><span>03</span><div><b>Process</b><p>Agent Output is parsed into dashboard data.</p></div></div><div className="processLine" />
              <div className="processStep"><span>04</span><div><b>Understand</b><p>The existing intelligence dashboard presents the result.</p></div></div>
            </>
          )}
          {executionId && <div className="executionMeta"><small>LAST RESULT</small><b>{source}</b><code>{executionId}</code>{onViewResults && <button type="button" onClick={onViewResults}>Open Intelligence →</button>}</div>}
        </aside>
      </div>
    </section>
  );
}
