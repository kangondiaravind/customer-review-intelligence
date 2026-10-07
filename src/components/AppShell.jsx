export default function AppShell({ page, onNavigate, children, hasResults }) {
  const items = [
    { id: "home", label: "Home", icon: "⌂" },
    { id: "analyze", label: "Analyze Customer Reviews", icon: "✦" },
    { id: "products", label: "All Products", icon: "▦", disabled: !hasResults },
    { id: "intelligence", label: "Customer Review Intelligence", icon: "◫", disabled: !hasResults },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <button className="sidebarBrand" type="button" onClick={() => onNavigate("home")}>
          <span className="ctrlLogo">C+</span>
          <span><strong>Ctrl+AI</strong><small>REVIEW INTELLIGENCE</small></span>
        </button>

        <nav className="nav" aria-label="Main navigation">
          {items.map((item) => (
            <button type="button" key={item.id} className={`navItem ${page === item.id ? "active" : ""}`} disabled={item.disabled} onClick={() => onNavigate(item.id)} title={item.disabled ? "Run an analysis first" : item.label}>
              <span className="navIcon">{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebarBottom">
          <div className="hackathonBadge"><span>AI HACKATHON</span><b>Turn Customer Reviews into Product Intelligence</b></div>
        </div>
      </aside>

      <div className="mainShell">
        <header className="appHeader">
          <div><div className="headerKicker">CTRL+AI · CUSTOMER REVIEW INTELLIGENCE PLATFORM</div><div className="headerTitle">Turn Customer Reviews into Product Intelligence</div></div>
          <div className="secureBadge"><span /> AI Analysis Workspace</div>
        </header>
        <main className="pageContent">{children}</main>
      </div>
    </div>
  );
}
