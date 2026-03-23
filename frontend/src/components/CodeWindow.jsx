export default function CodeWindow({ filename, children, className = "" }) {
  return (
    <div className={`code-window ${className}`}>
      <div className="code-titlebar">
        <span className="dot-red" />
        <span className="dot-yellow" />
        <span className="dot-green" />
        {filename && (
          <span className="ml-2 font-mono text-xs text-gray-500">{filename}</span>
        )}
      </div>
      {children}
    </div>
  );
}
