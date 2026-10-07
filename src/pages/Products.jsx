import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const SENTIMENT_COLORS = { Positive: "#20a866", Neutral: "#a9b1c2", Negative: "#e5534b" };

function topByMentions(products, path, labelKey) {
  const totals = new Map();

  products.forEach((item) => {
    const list = Array.isArray(item?.[path]) ? item[path] : [];
    list.forEach((entry) => {
      const label = entry?.[labelKey] || "Unnamed";
      const mentions = Number(entry?.mentions ?? 0);
      totals.set(label, (totals.get(label) || 0) + mentions);
    });
  });

  return Array.from(totals.entries())
    .map(([label, mentions]) => ({ label, mentions }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 5);
}

function OverallDashboard({ products }) {
  const totalProducts = products.length;

  const totalReviews = products.reduce(
    (sum, item) => sum + Number(item?.overview?.totalReviews ?? 0),
    0
  );

  const weightedRating =
    totalReviews > 0
      ? products.reduce(
          (sum, item) =>
            sum +
            Number(item?.overview?.averageRating ?? 0) *
              Number(item?.overview?.totalReviews ?? 0),
          0
        ) / totalReviews
      : 0;

  const sentimentTotals = products.reduce(
    (acc, item) => {
      const reviews = Number(item?.overview?.totalReviews ?? 0);
      const overview = item?.overview || {};
      acc.positive += (Number(overview.positivePercentage ?? 0) / 100) * reviews;
      acc.neutral += (Number(overview.neutralPercentage ?? 0) / 100) * reviews;
      acc.negative += (Number(overview.negativePercentage ?? 0) / 100) * reviews;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const sentimentData = [
    { name: "Positive", value: Math.round(sentimentTotals.positive) },
    { name: "Neutral", value: Math.round(sentimentTotals.neutral) },
    { name: "Negative", value: Math.round(sentimentTotals.negative) }
  ].filter((entry) => entry.value > 0);

  const ratingData = [
    ["1 Star", "oneStar"],
    ["2 Star", "twoStar"],
    ["3 Star", "threeStar"],
    ["4 Star", "fourStar"],
    ["5 Star", "fiveStar"]
  ].map(([name, key]) => ({
    name,
    value: products.reduce(
      (sum, item) => sum + Number(item?.ratingDistribution?.[key] ?? 0),
      0
    )
  }));

  const topStrengths = topByMentions(products, "customerStrengths", "topic");
  const topPainPoints = topByMentions(products, "customerPainPoints", "issue");

  return (
    <div className="overallDashboard">
      <div className="sectionHead">
        <div>
          <div className="eyebrow">OVERALL PRODUCT INTELLIGENCE</div>
          <h3>Analysis Across All Products</h3>
          <p>Aggregated insights generated from every product in this analysis.</p>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <small>Total Products</small>
          <strong>{totalProducts}<em /></strong>
        </div>
        <div className="kpi">
          <small>Total Reviews</small>
          <strong>{totalReviews.toLocaleString()}<em /></strong>
        </div>
        <div className="kpi">
          <small>Weighted Avg Rating</small>
          <strong>{weightedRating ? weightedRating.toFixed(2) : "—"}<em>{weightedRating ? " / 5" : ""}</em></strong>
        </div>
        <div className="kpi positive">
          <small>Positive Reviews</small>
          <strong>{Math.round(sentimentTotals.positive).toLocaleString()}<em /></strong>
        </div>
        <div className="kpi negative">
          <small>Negative Reviews</small>
          <strong>{Math.round(sentimentTotals.negative).toLocaleString()}<em /></strong>
        </div>
      </div>

      <div className="dashCols">
        <div className="card">
          <div className="sectionHead"><div><div className="eyebrow">RATING DISTRIBUTION</div><h3>Combined Review Ratings</h3></div></div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ratingData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#5968ed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="sectionHead"><div><div className="eyebrow">SENTIMENT MIX</div><h3>Overall Sentiment</h3></div></div>
          {sentimentData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {sentimentData.map((entry) => (
                    <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name] || "#8490a5"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty">No sentiment data available.</div>
          )}
        </div>
      </div>

      <div className="dashCols">
        <div className="card">
          <div className="sectionHead"><div><div className="eyebrow">WHAT CUSTOMERS LOVE</div><h3>Top Strengths Across Products</h3></div></div>
          {topStrengths.length ? (
            <div className="items">
              {topStrengths.map((entry) => (
                <div className="item" key={entry.label}>
                  <div><b>{entry.label}</b></div>
                  <small>{entry.mentions.toLocaleString()} mentions</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No customer strengths available.</div>
          )}
        </div>

        <div className="card">
          <div className="sectionHead"><div><div className="eyebrow">WHAT CUSTOMERS DISLIKE</div><h3>Top Pain Points Across Products</h3></div></div>
          {topPainPoints.length ? (
            <div className="items">
              {topPainPoints.map((entry) => (
                <div className="item" key={entry.label}>
                  <div><b>{entry.label}</b></div>
                  <small>{entry.mentions.toLocaleString()} mentions</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No customer pain points available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Products({ data, onSelectProduct, onAnalyze }) {
  const products = Array.isArray(data?.products) ? data.products : [];

  if (!products.length) {
    return (
      <section className="emptyIntelligence">
        <div className="emptyIcon">✦</div>
        <div className="eyebrow">PRODUCTS</div>
        <h1>No analysis yet</h1>
        <p>Run an analysis to populate the products list.</p>
        <button type="button" className="analyzeButton" onClick={onAnalyze}>Analyze Customer Reviews <span>→</span></button>
      </section>
    );
  }

  return (
    <section className="intelligencePage">
      <div className="intelligenceIntro">
        <div>
          <div className="eyebrow">PRODUCTS</div>
          <h1>All Products</h1>
          <p>Select a product to view its Customer Review Intelligence dashboard.</p>
        </div>
      </div>

      <OverallDashboard products={products} />

      <div className="sectionHead">
        <div>
          <div className="eyebrow">PRODUCT CATALOG</div>
          <h3>Browse Products</h3>
        </div>
      </div>

      <div className="productsGrid">
        {products.map((item, index) => {
          const info = item?.product || {};
          const overview = item?.overview || {};
          const name = info.productName || "Unnamed product";

          return (
            <button
              type="button"
              key={`${name}-${index}`}
              className="productCard"
              onClick={() => onSelectProduct(name)}
            >
              <div className="eyebrow">{info.category || "Category unavailable"}</div>
              <h3>{name}</h3>
              <span className="productBrand">{info.brand || "Brand unavailable"}</span>
              <div className="productCardStats">
                <div>
                  <small>Reviews</small>
                  <b>{overview.totalReviews ?? "—"}</b>
                </div>
                <div>
                  <small>Avg Rating</small>
                  <b>{overview.averageRating ?? "—"}</b>
                </div>
                <div>
                  <small>Health</small>
                  <b>{overview.productHealth ?? "—"}</b>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
