import { useState } from "react";
import BottomSheet from "../components/BottomSheet";
import Toast from "../components/Toast"; // ✅ import Toast

const pronounOptions = [
  "he",
  "him",
  "his",
  "she",
  "her",
  "hers",
  "they",
  "them",
  "theirs",
  "ze",
  "zir",
];

function PronounsStep({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState(""); // ✅ toast state

  const selectedPronouns = formData.pronouns || [];

  const togglePronoun = (pronoun) => {
    if (selectedPronouns.includes(pronoun)) {
      updateFormData({
        pronouns: selectedPronouns.filter((item) => item !== pronoun),
      });
      setError("");
      return;
    }

    if (selectedPronouns.length >= 3) {
      const msg = "You can select up to 3 pronouns.";
      setError(msg);
      setToast(msg); // ✅ show toast
      return;
    }

    updateFormData({
      pronouns: [...selectedPronouns, pronoun],
    });
    setError("");
  };

  const validatePronouns = () => {
    if (selectedPronouns.length === 0) {
      return "Please select at least one pronoun.";
    }
    return "";
  };

  const handleSave = () => {
    const validationError = validatePronouns();
    if (validationError) {
      setError(validationError);
      setToast(validationError); // ✅ show toast
      return;
    }
    setError("");
    setToast("Pronouns saved successfully!"); // ✅ success toast
    setSheetOpen(false);
  };

  const handleNext = () => {
    const validationError = validatePronouns();
    if (validationError) {
      setError(validationError);
      setToast(validationError); // ✅ show toast
      setSheetOpen(true);
      return;
    }
    setToast("Pronouns confirmed!"); // ✅ success toast
    onNext();
  };

  return (
    <>
      <div className="profile-step">
        <p className="eyebrow">GETTING READY</p>
        <h1>Which pronouns feel right for you?</h1>
        <p className="step-description">
          Select the pronouns that feel right for you.
        </p>

        <div className="pronouns-display">
          <label>PRONOUNS</label>
          <button
            type="button"
            className={`pronouns-trigger ${error ? "input-error" : ""}`}
            onClick={() => setSheetOpen(true)}
            aria-describedby={error ? "pronouns-error" : undefined}
            aria-invalid={!!error}
          >
            <div className="selected-pronouns">
              {selectedPronouns.length > 0 ? (
                selectedPronouns.map((pronoun) => (
                  <span key={pronoun} className="selected-pill">
                    {pronoun}
                  </span>
                ))
              ) : (
                <span className="placeholder-text">Select your pronouns</span>
              )}
            </div>
            <span className="dob-arrow">⌄</span>
          </button>
          {error && (
            <p id="pronouns-error" className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="wizard-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            BACK
          </button>
          <button type="button" className="primary-button" onClick={handleNext}>
            FINISH
          </button>
        </div>
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Select pronouns"
        description={`Select up to 3 · ${selectedPronouns.length}/3 selected`}
      >
        <div className="pronouns-sheet-grid">
          {pronounOptions.map((pronoun) => {
            const selected = selectedPronouns.includes(pronoun);
            return (
              <button
                type="button"
                key={pronoun}
                className={`pronoun-option ${selected ? "selected" : ""}`}
                onClick={() => togglePronoun(pronoun)}
                aria-pressed={selected}
              >
                <span>{selected ? "✓" : ""}</span>
                {pronoun}
              </button>
            );
          })}
        </div>

        {error && (
          <p className="field-error sheet-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="primary-button sheet-action-button"
          onClick={handleSave}
          disabled={selectedPronouns.length === 0}
        >
          SAVE PRONOUNS
        </button>
      </BottomSheet>

      {/* ✅ Toast notification */}
      <Toast
        message={toast}
        type={error ? "error" : "success"}
        onClose={() => setToast("")}
      />
    </>
  );
}

export default PronounsStep;
