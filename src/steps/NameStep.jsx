import { useState } from "react";

function NameStep({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState("");

  const validateName = (value) => {
    if (!value.trim()) return "Name is required.";
    if (value.trim().length < 2) return "Please enter at least 2 characters.";
    if (value.length > 50) return "Name must not exceed 50 characters.";
    return "";
  };

  const handleChange = (event) => {
    const value = event.target.value;
    updateFormData({ name: value });

    const validationError = validateName(value);
    setError(validationError);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateName(formData.name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    onNext();
  };

  return (
    <div className="profile-step">
      <p className="eyebrow">GETTING READY</p>

      <h1>Name, please.</h1>

      <p className="step-description">
        This is the name that other members will see.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-group">
          <label htmlFor="name">NAME</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
            placeholder="Enter your name"
            autoComplete="name"
            className={error ? "input-error" : ""}
            aria-invalid={!!error}
            aria-describedby={error ? "name-error" : undefined}
          />
          {error && (
            <p id="name-error" className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <p className="input-hint">
          You can change your profile information later.
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
    </div>
  );
}

export default NameStep;
