export default function StatusBanner({ type, title, message }) {
  if (!message) return null;
  return (
    <div className={`statusBanner ${type || "info"}`} role={type === "error" ? "alert" : "status"}>
      <span className="statusDot" />
      <div>
        <b>{title}</b>
        <p>{message}</p>
      </div>
    </div>
  );
}
