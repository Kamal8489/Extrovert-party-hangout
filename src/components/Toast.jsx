function Toast({ message, type = "error", onClose }) {
  if (!message) return null;

  const icons = {
    success: "✓",
    error: "!",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`toast toast-${type}`}
      role="alert"
      aria-live={type === "success" ? "polite" : "assertive"}
    >
      <div className="toast-content">
        <span className="toast-icon" aria-hidden="true">
          {icons[type] || "!"}
        </span>

        <p>{message}</p>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
