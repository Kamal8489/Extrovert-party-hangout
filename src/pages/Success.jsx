import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

function Success() {
  const navigate = useNavigate();

  return (
    <main className="success-page">
      <div className="success-container" aria-labelledby="success-title">
        <Logo />

        <div className="success-check" role="img" aria-label="Success">
          ✓
        </div>

        <p className="eyebrow">ALL SET</p>

        <h1 id="success-title">Signed up successfully</h1>

        <p className="success-description">
          Your profile is ready. Welcome to the community.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/")}
          aria-label="Continue to homepage"
        >
          CONTINUE
        </button>
      </div>
    </main>
  );
}

export default Success;
