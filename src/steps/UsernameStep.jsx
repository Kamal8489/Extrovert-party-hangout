import { useState } from "react";
import Toast from "../components/Toast"; // ✅ import Toast

function UsernameStep({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState("");
  const [toast, setToast] = useState(""); // ✅ toast state

  const validateUsername = (value) => {
    if (!value.trim()) return "Username is required.";
    if (value.length < 3) return "Username must be at least 3 characters.";
    if (value.length > 20) return "Username must not exceed 20 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Use only letters, numbers, and underscores.";
    return "";
  };

  const handleChange = (event) => {
    const value = event.target.value;
    updateFormData({ username: value });

    const validationError = validateUsername(value);
    setError(validationError);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateUsername(formData.username);

    if (validationError) {
      setError(validationError);
      setToast(validationError); // ✅ show toast
      return;
    }

    setError("");
    setToast("Username saved successfully!"); // ✅ success toast
    onNext();
  };

  return (
    <div className="profile-step">
      <p className="eyebrow">GETTING READY</p>
      <h1>Create a username</h1>
      <p className="step-description">Create a username that fits your vibe.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="username">USERNAME</label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            maxLength={20}
            placeholder="Enter username"
            autoComplete="username"
            className={error ? "input-error" : ""}
            aria-invalid={!!error}
            aria-describedby={error ? "username-error" : undefined}
          />
          {error && (
            <p id="username-error" className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <p className="input-hint">
          Your Supervibes and invites will use this name.
        </p>

        <div className="wizard-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            BACK
          </button>
          <button type="submit" className="primary-button">
            NEXT
          </button>
        </div>
      </form>

      {/* ✅ Toast notification */}
      <Toast
        message={toast}
        type={error ? "error" : "success"}
        onClose={() => setToast("")}
      />
    </div>
  );
}

export default UsernameStep;
