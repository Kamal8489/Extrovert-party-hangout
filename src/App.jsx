import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Terms from "./pages/Terms";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import OTPStep from "./steps/OTPStep";
import ProfileWizard from "./pages/ProfileWizard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/otp" element={<OTPStep />} />
        <Route path="/signup/profile" element={<ProfileWizard />} />
        <Route path="/success" element={<Success />} />

        {/* ✅ fallback route */}
        <Route
          path="*"
          element={
            <main className="signup-page">
              <div className="signup-container">
                <h1>Page Not Found</h1>
                <p>The page you’re looking for doesn’t exist.</p>
              </div>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
