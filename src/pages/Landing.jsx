import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/terms");
  };

  return (
    <main className="landing-page">
      {/* Background overlay handled via CSS */}
      <section className="landing-content" aria-labelledby="landing-title">
        <Logo />

        <p className="eyebrow">WELCOME</p>

        <h1 id="landing-title">
          Find your
          <br />
          people.
        </h1>

        <p className="landing-description">
          Connect, meet and discover experiences with people who share your
          vibe.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={handleGetStarted}
          aria-label="Get started with signup"
        >
          GET STARTED
        </button>
      </section>
    </main>
  );
}

export default Landing;
