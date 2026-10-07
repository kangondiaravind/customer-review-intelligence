import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import ReactMarkdown from "react-markdown";

function sentimentClass(value) {
  const s = String(value || "").toLowerCase();
  if (s === "positive") return "positive";
  if (s === "negative") return "negative";
  if (s === "mixed") return "mixed";
  return "neutral";
}

function Sentiment({ value }) {
  return (
    <span className={`sentiment ${sentimentClass(value)}`}>
      <i />
      {value || "Unknown"}
    </span>
  );
}

function Priority({ value }) {
  const s = String(value || "").toLowerCase();
  const c =
    s.includes("high") || s.includes("critical")
      ? "high"
      : s.includes("medium") || s.includes("moderate")
      ? "medium"
      : "low";

  return (
    <span className={`priority ${c}`}>
      <i />
      {value || "Not specified"}
    </span>
  );
}

function Empty({ children }) {
  return <div className="empty">{children}</div>;
}

function SectionHead({ eyebrow, title, description }) {
  return (
    <div className="sectionHead">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

function Kpi({ label, value, suffix, tone }) {
  return (
    <div className={`kpi ${tone || ""}`}>
      <small>{label}</small>
      <strong>
        {value ?? "—"}
        <em>{suffix || ""}</em>
      </strong>
    </div>
  );
}

export default function Dashboard({ payload, initialProduct }) {
  const products = Array.isArray(payload?.products) ? payload.products : [];
  const [selectedName, setSelectedName] = useState(
    initialProduct || products[0]?.product?.productName || ""
  );

  // Sync selection when a product is chosen from an external page (e.g. Products grid).
  useEffect(() => {
    if (initialProduct) setSelectedName(initialProduct);
  }, [initialProduct]);

  const product =
    products.find(
      (item) => item?.product?.productName === selectedName
    ) || products[0] || {};

  const productInfo = product.product || {};
  const overview = product.overview || {};
  const ratings = product.ratingDistribution || {};

  const categories = Array.isArray(product.reviewCategories)
    ? product.reviewCategories
    : [];

  const strengths = Array.isArray(product.customerStrengths)
    ? product.customerStrengths
    : [];

  const painPoints = Array.isArray(product.customerPainPoints)
    ? product.customerPainPoints
    : [];

  const actions = Array.isArray(product.recommendedActions)
    ? product.recommendedActions
    : [];

  const chartData = [
    ["1 Star", "oneStar"],
    ["2 Star", "twoStar"],
    ["3 Star", "threeStar"],
    ["4 Star", "fourStar"],
    ["5 Star", "fiveStar"]
  ].map(([name, key]) => ({
    name,
    value: Number(ratings[key] ?? 0)
  }));

  return (
    <section className="dashboard">
      <div className="dashTop">
        <div>
          <div className="eyebrow">AI-GENERATED REVIEW INTELLIGENCE</div>
          <h2>Customer Review Intelligence</h2>
          <p className="muted">
            Dashboard generated directly from Agent Output.
          </p>
        </div>

        <div className="productSelect">
          <label>PRODUCT</label>
          <select
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
          >
            {products.map((item, index) => (
              <option
                key={`${item?.product?.productName || "product"}-${index}`}
                value={item?.product?.productName || ""}
              >
                {item?.product?.productName || "Unnamed product"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="selectedProduct">
        <div>
          <div className="eyebrow">SELECTED PRODUCT</div>
          <h2>{productInfo.productName || "Unnamed Product"}</h2>
          <span>
            {productInfo.brand || "Brand unavailable"} ·{" "}
            {productInfo.category || "Category unavailable"}
          </span>
        </div>

        <div className="health">
          <small>PRODUCT HEALTH</small>
          <b>{overview.productHealth ?? "—"}</b>
        </div>
      </div>

      <div className="kpis">
        <Kpi label="Total Reviews" value={overview.totalReviews} />
        <Kpi
          label="Average Rating"
          value={overview.averageRating}
          suffix={overview.averageRating !== undefined ? "/ 5" : ""}
        />
        <Kpi
          label="Positive %"
          value={overview.positivePercentage}
          suffix={overview.positivePercentage !== undefined ? "%" : ""}
          tone="positive"
        />
        <Kpi
          label="Neutral %"
          value={overview.neutralPercentage}
          suffix={overview.neutralPercentage !== undefined ? "%" : ""}
          tone="neutral"
        />
        <Kpi
          label="Negative %"
          value={overview.negativePercentage}
          suffix={overview.negativePercentage !== undefined ? "%" : ""}
          tone="negative"
        />
      </div>

      <div className="dashCols">
        <div className="card">
          <SectionHead eyebrow="RATING DISTRIBUTION" title="Review Ratings" />
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#5968ed"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card healthPanel">
          <SectionHead eyebrow="PRODUCT HEALTH" title="Current Assessment" />
          <div className="healthBig">
            {overview.productHealth ?? "—"}
          </div>
          <p>Value supplied by the selected product analysis.</p>
        </div>
      </div>

      <div className="card">
        <SectionHead
          eyebrow="REVIEW INTELLIGENCE"
          title="Review Categories"
          description="Dynamically rendered from reviewCategories[]."
        />

        {categories.length ? (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Reviews</th>
                  <th>Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <b>{item?.category ?? "Unnamed"}</b>
                    </td>
                    <td>
                      {Number(item?.reviewCount ?? 0).toLocaleString()}
                    </td>
                    <td>
                      <Sentiment value={item?.sentiment} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No review categories available.</Empty>
        )}
      </div>

      <div className="dashCols">
        <div className="card">
          <SectionHead eyebrow="WHAT CUSTOMERS LOVE" title="Customer Strengths" />

          {strengths.length ? (
            <div className="items">
              {strengths.map((item, index) => (
                <div className="item" key={index}>
                  <div>
                    <b>{item?.topic ?? "Unnamed topic"}</b>
                    <Sentiment value={item?.sentiment} />
                  </div>
                  <small>
                    {Number(item?.mentions ?? 0).toLocaleString()} mentions
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <Empty>No customer strengths available.</Empty>
          )}
        </div>

        <div className="card">
          <SectionHead
            eyebrow="WHAT CUSTOMERS DISLIKE"
            title="Customer Pain Points"
          />

          {painPoints.length ? (
            <div className="items">
              {painPoints.map((item, index) => (
                <div className="item" key={index}>
                  <div>
                    <b>{item?.issue ?? "Unnamed issue"}</b>
                    <Priority value={item?.priority} />
                  </div>
                  <small>
                    {Number(item?.mentions ?? 0).toLocaleString()} mentions ·{" "}
                    {item?.impact ?? "Impact not specified"}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <Empty>No customer pain points available.</Empty>
          )}
        </div>
      </div>

      <div className="insight">
        <div className="spark">✦</div>
        <div>
          <div className="eyebrow">AI EXECUTIVE INSIGHT</div>
          <h3>What the reviews are telling us</h3>
          <div className="markdown">
            <ReactMarkdown>
              {String(
                product.aiExecutiveInsight ||
                  "No executive insight available."
              )}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="card">
        <SectionHead
          eyebrow="NEXT STEPS"
          title="Recommended Actions"
          description="Dynamically rendered from recommendedActions[]."
        />

        {actions.length ? (
          <div className="actions">
            {actions.map((item, index) => (
              <div className="action" key={index}>
                <Priority value={item?.priority} />
                <div>
                  <small>{item?.area ?? "Area not specified"}</small>
                  <b>{item?.action ?? "Action not specified"}</b>
                  <p>{item?.reason ?? "Reason not specified"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty>No recommended actions available.</Empty>
        )}
      </div>
    </section>
  );
}
