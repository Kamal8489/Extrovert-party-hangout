import { useRef, useState } from "react";
import BottomSheet from "../components/BottomSheet";

const MIN_AGE = 18;
const MIN_YEAR = 1900;

/* =========================================================
   DATE HELPERS
========================================================= */

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTodayParts() {
  const today = new Date();

  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  };
}

function getTodayString() {
  const { day, month, year } = getTodayParts();

  return `${year}-${pad(month)}-${pad(day)}`;
}

function getMaximumDOB() {
  const { day, month, year } = getTodayParts();

  return `${year - MIN_AGE}-${pad(month)}-${pad(day)}`;
}

function getMinimumDOB() {
  return `${MIN_YEAR}-01-01`;
}

function isCompleteDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidCalendarDate(value) {
  if (!isCompleteDate(value)) return false;

  const [year, month, day] = value.split("-").map(Number);

  if (year < MIN_YEAR) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function buildDOB(day, month, year) {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function getPartsFromDOB(value) {
  if (!isCompleteDate(value)) {
    return {
      day: "",
      month: "",
      year: "",
    };
  }

  const [year, month, day] = value.split("-");

  return {
    day,
    month,
    year,
  };
}

/* =========================================================
   AGE
========================================================= */

function calculateAge(value) {
  if (!isValidCalendarDate(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const today = getTodayParts();

  let age = today.year - year;

  if (today.month < month || (today.month === month && today.day < day)) {
    age--;
  }

  return age;
}

/* =========================================================
   VALIDATION
========================================================= */

function validateDOB(value) {
  if (!value) {
    return "Please enter your date of birth.";
  }

  if (!isCompleteDate(value)) {
    return "Please enter your complete date of birth.";
  }

  if (!isValidCalendarDate(value)) {
    return "Please enter a valid date of birth.";
  }

  const [year, month, day] = value.split("-").map(Number);
  const today = getTodayParts();

  const futureDate =
    year > today.year ||
    (year === today.year &&
      (month > today.month || (month === today.month && day > today.day)));

  if (futureDate) {
    return "Date of birth cannot be in the future.";
  }

  const age = calculateAge(value);

  if (age === null) {
    return "Please enter a valid date of birth.";
  }

  if (age < MIN_AGE) {
    return `You must be at least ${MIN_AGE} years old.`;
  }

  return "";
}

/* =========================================================
   DISPLAY
========================================================= */

function formatDisplayDate(value) {
  if (!isValidCalendarDate(value)) {
    return "Select your date of birth";
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   COMPONENT
========================================================= */

function DOBStep({ formData, updateFormData, onNext, onBack }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [draftDay, setDraftDay] = useState("");
  const [draftMonth, setDraftMonth] = useState("");
  const [draftYear, setDraftYear] = useState("");
  const [draftDOB, setDraftDOB] = useState("");

  const [error, setError] = useState("");

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const calendarRef = useRef(null);

  const savedAge = calculateAge(formData.dob);
  const draftAge = calculateAge(draftDOB);

  const today = getTodayString();
  const minimumDOB = getMinimumDOB();
  const maximumDOB = getMaximumDOB();

  /* =======================================================
     SET DRAFT PARTS
  ======================================================= */

  const setDraftValues = (value) => {
    const parts = getPartsFromDOB(value);

    setDraftDay(parts.day);
    setDraftMonth(parts.month);
    setDraftYear(parts.year);
    setDraftDOB(value || "");
  };

  /* =======================================================
     OPEN SHEET
  ======================================================= */

  const handleOpenSheet = () => {
    setDraftValues(formData.dob || "");
    setError("");
    setSheetOpen(true);
  };

  /* =======================================================
     CLOSE SHEET
  ======================================================= */

  const handleCloseSheet = () => {
    setDraftValues(formData.dob || "");
    setError("");
    setSheetOpen(false);
  };

  /* =======================================================
     UPDATE DRAFT DATE
  ======================================================= */

  const updateDraftDate = (day, month, year) => {
    const completeDate = buildDOB(day, month, year);

    setDraftDOB(completeDate);
    setError("");
  };

  /* =======================================================
     DAY
  ======================================================= */

  const handleDayChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 2);

    setDraftDay(value);

    updateDraftDate(value, draftMonth, draftYear);

    if (value.length === 2) {
      monthRef.current?.focus();
    }
  };

  /* =======================================================
     MONTH
  ======================================================= */

  const handleMonthChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 2);

    setDraftMonth(value);

    updateDraftDate(draftDay, value, draftYear);

    if (value.length === 2) {
      yearRef.current?.focus();
    }
  };

  /* =======================================================
     YEAR
  ======================================================= */

  const handleYearChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 4);

    setDraftYear(value);

    updateDraftDate(draftDay, draftMonth, value);
  };

  /* =======================================================
     KEYBOARD NAVIGATION
  ======================================================= */

  const handleFieldKeyDown = (event, field) => {
    if (event.key !== "Backspace") {
      return;
    }

    const input = event.currentTarget;

    /*
     * If the current field is already empty,
     * move to the previous field.
     */
    if (input.value === "") {
      if (field === "month") {
        dayRef.current?.focus();
      }

      if (field === "year") {
        monthRef.current?.focus();
      }
    }
  };

  /* =======================================================
     CALENDAR
  ======================================================= */

  const handleCalendarChange = (event) => {
    const value = event.target.value;

    if (!value) {
      setDraftValues("");
      setError("");
      return;
    }

    setDraftValues(value);
    setError("");
  };

  const openCalendar = () => {
    const calendar = calendarRef.current;

    if (!calendar) return;

    if (typeof calendar.showPicker === "function") {
      calendar.showPicker();
    } else {
      calendar.focus();
      calendar.click();
    }
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSaveDate = () => {
    const validationError = validateDOB(draftDOB);

    if (validationError) {
      setError(validationError);
      return;
    }

    updateFormData({
      dob: draftDOB,
    });

    setError("");
    setSheetOpen(false);
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateDOB(formData.dob);

    if (validationError) {
      setError(validationError);
      setSheetOpen(true);
      return;
    }

    onNext();
  };

  return (
    <>
      {/* ===================================================
          MAIN SCREEN
      =================================================== */}

      <div className="profile-step">
        <p className="eyebrow">GETTING READY</p>

        <h1>How old are you?</h1>

        <p className="step-description">
          Add your date of birth so we can show you eligible people and
          experiences.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="dob-display-group">
            <label htmlFor="dob-trigger">DATE OF BIRTH</label>

            <button
              id="dob-trigger"
              type="button"
              className="dob-trigger"
              onClick={handleOpenSheet}
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
            >
              <span>{formatDisplayDate(formData.dob)}</span>

              <span className="dob-arrow" aria-hidden="true">
                ↓
              </span>
            </button>

            {savedAge !== null ? (
              <p className="input-hint">Your age: {savedAge}</p>
            ) : (
              <p className="input-hint">You must be 18 years or older.</p>
            )}
          </div>

          <div className="wizard-actions">
            <button type="button" className="secondary-button" onClick={onBack}>
              BACK
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={!formData.dob}
            >
              NEXT
            </button>
          </div>
        </form>
      </div>

      {/* ===================================================
          BOTTOM SHEET
      =================================================== */}

      <BottomSheet
        open={sheetOpen}
        onClose={handleCloseSheet}
        title="Date of birth"
        description="You must be 18 years or older to continue."
      >
        {/* =================================================
            MANUAL INPUT
        ================================================= */}

        <div className="manual-dob">
          <label>DATE OF BIRTH</label>

          <div className="dob-fields">
            <input
              ref={dayRef}
              type="text"
              inputMode="numeric"
              placeholder="DD"
              maxLength={2}
              value={draftDay}
              onChange={handleDayChange}
              onKeyDown={(event) => handleFieldKeyDown(event, "day")}
              aria-label="Day"
              autoComplete="bday-day"
            />

            <span>/</span>

            <input
              ref={monthRef}
              type="text"
              inputMode="numeric"
              placeholder="MM"
              maxLength={2}
              value={draftMonth}
              onChange={handleMonthChange}
              onKeyDown={(event) => handleFieldKeyDown(event, "month")}
              aria-label="Month"
              autoComplete="bday-month"
            />

            <span>/</span>

            <input
              ref={yearRef}
              type="text"
              inputMode="numeric"
              placeholder="YYYY"
              maxLength={4}
              value={draftYear}
              onChange={handleYearChange}
              onKeyDown={(event) => handleFieldKeyDown(event, "year")}
              aria-label="Year"
              autoComplete="bday-year"
            />
          </div>
        </div>

        {/* =================================================
            CALENDAR
        ================================================= */}

        <button
          type="button"
          className="calendar-button"
          onClick={openCalendar}
        >
          <span className="calendar-icon">📅</span>

          <span>Choose from calendar</span>

          <span className="calendar-arrow">→</span>
        </button>

        <input
          ref={calendarRef}
          type="date"
          value={draftDOB}
          min={minimumDOB}
          max={maximumDOB}
          onChange={handleCalendarChange}
          className="hidden-date-input"
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <p className="field-error sheet-error" role="alert">
            {error}
          </p>
        )}

        {/* =================================================
            PREVIEW
        ================================================= */}

        {isValidCalendarDate(draftDOB) && !error && draftAge !== null && (
          <div className="sheet-preview">
            <div>
              <span>Selected date</span>

              <strong>{formatDisplayDate(draftDOB)}</strong>
            </div>

            <div className="age-preview">
              <span>Age</span>

              <strong>{draftAge}</strong>
            </div>
          </div>
        )}

        {/* =================================================
            SAVE
        ================================================= */}

        <button
          type="button"
          className="primary-button sheet-action-button"
          onClick={handleSaveDate}
          disabled={!isValidCalendarDate(draftDOB)}
        >
          SAVE DATE
        </button>
      </BottomSheet>
    </>
  );
}

export default DOBStep;
