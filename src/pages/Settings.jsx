import { useState } from "react";
import API_CONFIG from "../config/apiConfig";
import StatusBanner from "../components/StatusBanner";

export default function Settings({ onSaved }) {
  const [token, setToken] = useState(API_CONFIG.jwtToken);
  const [mode, setMode] = useState(API_CONFIG.analysisMode);
  const [saved, setSaved] = useState(false);

  function saveToken() {
    localStorage.setItem(API_CONFIG.storageKeys.jwtToken, token.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
    onSaved?.();
  }

  function selectMode(nextMode) {
    setMode(nextMode);
    localStorage.setItem(API_CONFIG.storageKeys.analysisMode, nextMode);
    onSaved?.();
  }

  return (
    <section className="settingsPage">
      <div className="pageIntro">
        <span className="heroPill">WORKSPACE SETTINGS</span>
        <h1>Settings</h1>
        <p>Configure authentication and choose how review analysis should be run.</p>
      </div>

      <div className="settingsGrid">
        <section className="settingsCard">
          <div className="settingsIcon">⌁</div>
          <div className="eyebrow">AUTHENTICATION</div>
          <h2>JWT Token Configuration</h2>
          <p className="settingsDescription">
            This token is used for authenticated AAVA API requests. It is stored locally in this browser and is not displayed elsewhere in the application.
          </p>

          <label htmlFor="jwtToken">JWT Token</label>
          <textarea
            id="jwtToken"
            className="tokenInput"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={7}
            spellCheck="false"
            autoComplete="off"
          />
          <small className="helper">Use the token value only. The application adds <b>Bearer</b> automatically.</small>

          {saved && <StatusBanner type="success" title="Saved" message="JWT token configuration updated." />}

          <button type="button" className="analyzeButton settingsButton" disabled={!token.trim()} onClick={saveToken}>
            Save / Apply <span>→</span>
          </button>
        </section>

        <section className="settingsCard">
          <div className="settingsIcon">◈</div>
          <div className="eyebrow">ANALYSIS CONFIGURATION</div>
          <h2>Analysis Mode</h2>
          <p className="settingsDescription">Choose one analysis mode. The Analyze Customer Reviews page updates automatically.</p>

          <div className="modeOptions">
            <button
              type="button"
              className={`modeOption ${mode === "agentId" ? "selected" : ""}`}
              onClick={() => selectMode("agentId")}
            >
              <span className="radioMark" />
              <span><b>Analysis using Agent ID</b><small>Run a new review analysis with an Agent ID, input value and review file.</small></span>
            </button>

            <button
              type="button"
              className={`modeOption ${mode === "executionId" ? "selected" : ""}`}
              onClick={() => selectMode("executionId")}
            >
              <span className="radioMark" />
              <span><b>Analysis using Execution ID</b><small>Retrieve results from an existing execution without starting a new analysis.</small></span>
            </button>
          </div>

          <div className="modeState">
            <small>ACTIVE MODE</small>
            <b>{mode === "agentId" ? "Analysis using Agent ID" : "Analysis using Execution ID"}</b>
          </div>
        </section>
      </div>
    </section>
  );
}
