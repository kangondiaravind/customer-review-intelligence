import Dashboard from "../dashboard/Dashboard";

export default function Intelligence({ data, executionMeta, onAnalyze, selectedProduct }) {
  if (!data) {
    return (
      <section className="emptyIntelligence">
        <div className="emptyIcon">✦</div>
        <div className="eyebrow">CUSTOMER REVIEW INTELLIGENCE</div>
        <h1>No analysis yet</h1>
        <p>Run an analysis to populate the existing Customer Review Intelligence dashboard.</p>
        <button type="button" className="analyzeButton" onClick={onAnalyze}>Analyze Customer Reviews <span>→</span></button>
      </section>
    );
  }

  return (
    <section className="intelligencePage">
      <div className="intelligenceIntro">
        <div>
          <div className="eyebrow">CUSTOMER REVIEW INTELLIGENCE</div>
          <h1>Customer Review Intelligence</h1>
          <p>Product intelligence generated from the completed AI review analysis.</p>
        </div>
        <button type="button" className="secondaryButton" onClick={onAnalyze}>New Analysis</button>
      </div>
      {executionMeta?.executionId && (
        <div className="resultStrip"><span>Analysis ready</span><b>{executionMeta.source}</b><code>{executionMeta.executionId}</code></div>
      )}
      <Dashboard payload={data} initialProduct={selectedProduct} />
    </section>
  );
}
