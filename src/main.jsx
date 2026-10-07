import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import AppShell from "./components/AppShell";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Products from "./pages/Products";
import Intelligence from "./pages/Intelligence";
import Settings from "./pages/Settings";
import "./styles.css";

function getPage() {
  const value = window.location.hash.replace(/^#\/?/, "");
  return ["home", "analyze", "products", "intelligence", "settings"].includes(value) ? value : "home";
}

function App() {
  const [page, setPage] = useState(getPage);
  const [dashboardData, setDashboardData] = useState(null);
  const [executionMeta, setExecutionMeta] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    const handler = () => setPage(getPage());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  function navigate(nextPage) {
    window.location.hash = nextPage;
    setPage(nextPage);
  }

  function complete(data, meta) {
    setDashboardData(data);
    setExecutionMeta(meta);
    setSelectedProduct("");
    window.location.hash = "products";
    setPage("products");
  }

  function newAnalysis() {
    window.location.hash = "analyze";
    setPage("analyze");
  }

  function selectProduct(name) {
    setSelectedProduct(name);
    window.location.hash = "intelligence";
    setPage("intelligence");
  }

  return (
    <AppShell page={page} onNavigate={navigate} hasResults={Boolean(dashboardData)}>
      {page === "home" && <Home onAnalyze={newAnalysis} />}
      {page === "analyze" && <Analyze onComplete={complete} onViewResults={() => navigate("products")} />}
      {page === "products" && <Products data={dashboardData} onSelectProduct={selectProduct} onAnalyze={newAnalysis} />}
      {page === "intelligence" && <Intelligence data={dashboardData} executionMeta={executionMeta} onAnalyze={newAnalysis} selectedProduct={selectedProduct} />}
      {page === "settings" && <Settings />}
    </AppShell>
  );
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

