function Spinner({ size = "medium", label = "Loading..." }) {
  return (
    <span
      className={`spinner spinner-${size}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );
}

export default Spinner;
