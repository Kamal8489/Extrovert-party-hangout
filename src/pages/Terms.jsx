import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

function Terms() {
  const navigate = useNavigate();
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const contentRef = useRef(null);

  const handleContinue = () => {
    if (scrolledToEnd) {
      navigate("/signup");
    }
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      setScrolledToEnd(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="terms-page">
      <div className="terms-container" aria-labelledby="terms-title">
        <Logo />

        <div className="terms-header">
          <p className="eyebrow">BEFORE YOU CONTINUE</p>
          <h1 id="terms-title">Terms & Conditions</h1>
          <p className="terms-intro">
            Please review the terms before creating your account.
          </p>
        </div>

        <div className="terms-content" ref={contentRef} tabIndex={0}>
          <section>
            <h2>1. Using the service</h2>
            <p>
              By creating an account, you agree to use the platform responsibly
              and respectfully.
            </p>
          </section>

          <section>
            <h2>2. Your account</h2>
            <p>
              You are responsible for keeping your account information accurate
              and secure.
            </p>
          </section>

          <section>
            <h2>3. Community guidelines</h2>
            <p>
              Treat other members with respect and do not use the platform for
              harmful or inappropriate activities.
            </p>
          </section>

          <section>
            <h2>4. Privacy</h2>
            <p>
              Your information should be handled according to the platform's
              privacy policy.
            </p>
          </section>
        </div>

        <div className="terms-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            BACK
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleContinue}
            disabled={!scrolledToEnd}
            aria-disabled={!scrolledToEnd}
          >
            AGREE & CONTINUE
          </button>
        </div>
      </div>
    </main>
  );
}

export default Terms;
