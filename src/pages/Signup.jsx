import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import SignupHeader from "../components/SignupHeader";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email address is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim()))
      return "Please enter a valid email address";

    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Show validation dynamically
    if (value.trim()) {
      setError(validateEmail(value));
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate email verification request
      await new Promise((resolve) => setTimeout(resolve, 1200));
      navigate("/signup/otp");
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-container">
        <SignupHeader />
        <div className="signup-content">
          <p className="eyebrow">GETTING STARTED</p>

          <h1>Enter your email</h1>

          <p className="signup-description">
            We'll use your email to verify your account and keep your experience
            secure.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">EMAIL</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                autoComplete="email"
                maxLength={100}
                className={error ? "input-error" : ""}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              {error && (
                <p id="email-error" className="field-error">
                  {error}
                </p>
              )}
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
              />
              <span>I'd like to receive updates and occasional emails.</span>
            </label>

            <button
              type="submit"
              className="primary-button submit-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  VERIFYING...
                </>
              ) : (
                "PROCEED"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Signup;
