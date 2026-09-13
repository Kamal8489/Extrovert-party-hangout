import { useEffect, useId, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  closeOnBackdrop = true,
}) {
  const sheetRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  /*
   * Keep the latest onClose function without making
   * the focus-management effect restart on every render.
   */
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    // Remember the element that opened the sheet.
    previousActiveElementRef.current = document.activeElement;

    const originalOverflow = document.body.style.overflow;

    // Prevent background page scrolling.
    document.body.style.overflow = "hidden";

    const getFocusableElements = () => {
      if (!sheetRef.current) return [];

      return Array.from(sheetRef.current.querySelectorAll(FOCUSABLE_SELECTOR));
    };

    const handleKeyDown = (event) => {
      /*
       * ESC
       */
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      /*
       * Focus trap
       */
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        sheetRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    /*
     * Focus only once when the sheet opens.
     *
     * IMPORTANT:
     * This must NOT run again when the DOB inputs
     * cause the parent component to re-render.
     */
    const focusTimer = requestAnimationFrame(() => {
      const focusableElements = getFocusableElements();

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        sheetRef.current?.focus();
      }
    });

    return () => {
      cancelAnimationFrame(focusTimer);

      document.body.style.overflow = originalOverflow;

      document.removeEventListener("keydown", handleKeyDown);

      /*
       * Return focus to the element that opened the sheet.
       */
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === "function"
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="sheet-backdrop"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onCloseRef.current?.();
        }
      }}
    >
      <div
        ref={sheetRef}
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />

        <div className="sheet-header">
          <div className="sheet-heading">
            <h2 id={titleId}>{title}</h2>

            {description && <p id={descriptionId}>{description}</p>}
          </div>

          <button
            type="button"
            className="sheet-close"
            onClick={() => onCloseRef.current?.()}
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

export default BottomSheet;
