export default function Button({ children, variant="primary", className="", type="button", ...props }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}