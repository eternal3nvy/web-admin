import "./BrandInfinityIcon.css";

const BrandInfinityIcon = ({ size = 36, variant = "default", className = "" }) => {
  const height = Math.round(size * 0.5);
  const gradientId = "brandInfinityGradient";

  return (
    <svg
      className={`brand-infinity brand-infinity--${variant} ${className}`.trim()}
      width={size}
      height={height}
      viewBox="0 0 80 40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <path
        className="brand-infinity__path"
        d="M22 20 C22 10 38 10 40 20 C42 30 58 30 58 20 C58 10 42 10 40 20 C38 30 22 30 22 20 Z"
      />
    </svg>
  );
};

export default BrandInfinityIcon;
