export default function Modal({ open, title, onClose, children, actions }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}>×</button></div><div>{children}</div>{actions && <div className="modal-actions">{actions}</div>}</div></div>;
}