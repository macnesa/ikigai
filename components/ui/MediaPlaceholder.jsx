export default function MediaPlaceholder({ className = "", label }) {
  return (
    <div
      className={`media-placeholder relative grid min-h-px place-items-end overflow-hidden bg-[var(--placeholder-light)] text-[rgba(20,25,34,0.48)] ${className}`}
      role="img"
      aria-label={label}
    >
      <span
        className="m-3 font-display text-[0.56rem] font-semibold leading-[1.2] tracking-[0.11em] uppercase"
        aria-hidden="true"
      >
        {label}
      </span>
    </div>
  );
}
