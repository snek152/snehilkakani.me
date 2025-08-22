export default function LoadingSpinner({
  className = "",
  width = 48,
  height = 48,
  style,
}: {
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full ${className}`}
      style={style}
    >
      <svg
        className="text-background animate-spin"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        <circle
          cx="32"
          cy="32"
          r="27"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 5a27 27 0 0 1 0 54"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
      </svg>
    </div>
  );
}
