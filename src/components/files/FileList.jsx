export default function FileList({ files = [] }) {
  if (!files.length) return <div className="empty">No files uploaded yet. Upload a brief, PDF, image, spreadsheet or other project document.</div>;
  return <div className="file-list">{files.map((file, index) => (
    <div className="file-item" key={file.$id || file.fileId || index}>
      <span className="file-meta">▧ {file.name || "Attachment"}<small className="muted">{file.size ? ` ${(file.size / 1024).toFixed(1)} KB` : ""}{file.unavailable ? " · File data is unavailable in this browser" : ""}</small></span>
      {file.url && <a href={file.url} target="_blank" rel="noreferrer" download={file.name || undefined}>Open / Download</a>}
    </div>
  ))}</div>;
}
