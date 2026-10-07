export default function Home({ onAnalyze }) {
  return (
    <section className="homePage">
      <div className="heroPanel">
        <div className="heroGlow" />
        <div className="heroContent">
          <span className="heroPill">AI HACKATHON · CTRL+AI</span>
          <h1>Turn Customer Reviews<br /><span>into Product Intelligence.</span></h1>
          <p>
            Transform large volumes of customer feedback into clear product insights,
            sentiment signals, pain points, strengths, and recommended actions.
          </p>
          <button className="heroButton" type="button" onClick={onAnalyze}>
            Analyze Customer Reviews <span>→</span>
          </button>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="orbit orbitOne" />
          <div className="orbit orbitTwo" />
          <div className="aiCore"><span>✦</span></div>
          <div className="floatCard cardOne"><small>SENTIMENT</small><b>+ Positive</b><span>AI detected</span></div>
          <div className="floatCard cardTwo"><small>PRODUCT SIGNAL</small><b>Strong</b><span>Review intelligence</span></div>
          <div className="floatCard cardThree"><small>INSIGHT</small><b>Action ready</b><span>AI recommendation</span></div>
        </div>
      </div>

      <div className="valueGrid">
        <article><span>01</span><h3>Upload Reviews</h3><p>Bring your customer review dataset into the analysis workflow.</p></article>
        <article><span>02</span><h3>AI Analysis</h3><p>Convert unstructured feedback into product-level intelligence.</p></article>
        <article><span>03</span><h3>Make Decisions</h3><p>See what customers love, what hurts, and what to improve next.</p></article>
      </div>
    </section>
  );
}
