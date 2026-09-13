function Logo({ size = "md", className = "", decorative = false }) {
  const label = decorative ? undefined : "Extroverts logo";

  return (
    <div
      className={`brand-logo brand-logo--${size} ${className}`.trim()}
      aria-label={label}
      aria-hidden={decorative ? true : undefined}
    >
      <img
        src="/assets/logo-2.png"
        alt=""
        className="brand-logo__image"
        draggable="false"
      />
    </div>
  );
}

export default Logo;
