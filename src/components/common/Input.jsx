export default function Input({ label, error, ...props }) {
  return <label className="field">{label && <span>{label}</span>}<input className="input" {...props} />{error && <small className="error">{error}</small>}</label>;
}