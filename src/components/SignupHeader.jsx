import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

function SignupHeader({ onBack, showBack = true }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="signup-header">
      {/* LEFT */}
      <div className="signup-header-left">
        {showBack ? (
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
            aria-label="Go back"
          >
            <span aria-hidden="true">←</span>
          </button>
        ) : (
          <div className="header-placeholder" aria-hidden="true" />
        )}
      </div>

      {/* CENTER */}
      <div className="signup-header-logo">
        <Logo size="sm" />
      </div>

      {/* RIGHT */}
      <div className="signup-header-right" aria-hidden="true">
        <div className="header-placeholder" />
      </div>
    </header>
  );
}

export default SignupHeader;
