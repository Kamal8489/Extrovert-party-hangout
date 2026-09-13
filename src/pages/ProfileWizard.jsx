import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UsernameStep from "../steps/UsernameStep";
import NameStep from "../steps/NameStep";
import DOBStep from "../steps/DOBStep";
import PronounsStep from "../steps/PronounsStep";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";

function ProfileWizard() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    dob: "",
    pronouns: [],
  });

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "error" }), 3500);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const previousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const finishSignup = async () => {
    if (loading) return;
    setLoading(true);

    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1800));
      navigate("/success");
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (loading) {
      return (
        <div className="final-loading" aria-live="polite">
          <Spinner size="large" />
          <p className="eyebrow">ALMOST THERE</p>
          <h1>Creating your profile...</h1>
          <p>We're getting everything ready for you.</p>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <UsernameStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={() => navigate("/signup/otp")}
          />
        );
      case 2:
        return (
          <NameStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 3:
        return (
          <DOBStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={previousStep}
          />
        );
      case 4:
        return (
          <PronounsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={finishSignup}
            onBack={previousStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-container profile-wizard-container">
        {!loading && (
          <div className="wizard-progress" aria-label="Signup progress">
            <span>{currentStep} / 4</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
        {renderStep()}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </main>
  );
}

export default ProfileWizard;
