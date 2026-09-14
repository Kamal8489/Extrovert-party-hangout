import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Toast from "../components/Toast"; // ✅ import Toast

const OTP_LENGTH = 6;
const DEMO_OTP = "123456";

function OTPStep() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [toast, setToast] = useState(""); // ✅ toast state

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pastedValue) return;

    const newOtp = Array(OTP_LENGTH).fill("");
    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const validateOtp = (enteredOtp) => {
    if (enteredOtp.length !== OTP_LENGTH)
      return "Please enter the complete 6-digit code.";
    if (enteredOtp !== DEMO_OTP)
      return "Invalid verification code. Please try again.";
    return "";
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    const validationError = validateOtp(enteredOtp);

    if (validationError) {
      setError(validationError);
      setToast(validationError); // ✅ show toast
      return;
    }

    setLoading(true);
    setError("");
    setToast("");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
    setToast("Verification successful!"); // ✅ success toast
    navigate("/signup/profile");
  };

  const handleResend = () => {
    if (secondsLeft > 0 || loading) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setToast("A new OTP has been sent to your email."); // ✅ resend toast
    setSecondsLeft(30);
    inputRefs.current[0]?.focus();
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="signup-top">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/signup")}
            aria-label="Go back"
          >
            ←
          </button>
          <Logo />
        </div>

        <div className="signup-content otp-content">
          <p className="eyebrow">VERIFY YOUR EMAIL</p>
          <h1>Enter the OTP</h1>
          <p className="signup-description">
            Enter the 6-digit verification code sent to your email address.
          </p>

          <form onSubmit={handleVerify} noValidate>
            <div className="otp-group">
              <label>VERIFICATION CODE</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`OTP digit ${index + 1}`}
                    aria-invalid={!!error}
                    disabled={loading}
                  />
                ))}
              </div>
              {error && <p className="field-error otp-error">{error}</p>}
            </div>

            <div className="resend-area" aria-live="polite">
              {secondsLeft > 0 ? (
                <p>
                  Resend code in <strong>{formattedTime}</strong>
                </p>
              ) : (
                <button
                  type="button"
                  className="resend-button"
                  onClick={handleResend}
                  disabled={loading}
                >
                  RESEND OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              className="primary-button submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  VERIFYING...
                </>
              ) : (
                "VERIFY"
              )}
            </button>

            <button
              type="button"
              className="secondary-button back-form-button"
              onClick={() => navigate("/signup")}
              disabled={loading}
            >
              GO BACK
            </button>
            <p className="demo-otp">use demo OTP : 123456</p>
          </form>
        </div>
      </div>

      {/* ✅ Toast notification */}
      <Toast
        message={toast}
        type={error ? "error" : "success"}
        onClose={() => setToast("")}
      />
    </main>
  );
}

export default OTPStep;
