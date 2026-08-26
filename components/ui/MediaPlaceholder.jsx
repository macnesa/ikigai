export default function MediaPlaceholder({ className = "", label }) {
  return (
    <div
      className={`media-placeholder ${className}`}
      role="img"
      aria-label={label}
    >
      <span aria-hidden="true">{label}</span>
    </div>
  );
}
