export default function Select({ label, error, children, ...props }) {
  return <label className="field">{label && <span>{label}</span>}<select className="input" {...props}>{children}</select>{error && <small className="error">{error}</small>}</label>;
}