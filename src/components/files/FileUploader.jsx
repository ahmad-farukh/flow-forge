import { useRef, useState } from "react";
import Button from "../common/Button";

export default function FileUploader({ onFile, accept = ".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.zip", label = "Upload document" }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState("");

  const choose = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelected(file.name);
    onFile?.(file);
    event.target.value = "";
  };

  return (
    <div className="file-picker">
      <input ref={ref} className="file-picker-input" type="file" accept={accept} onChange={choose} />
      <Button type="button" variant="ghost" onClick={() => ref.current?.click()}>＋ {label}</Button>
      {selected && <span className="file-picker-name" title={selected}>{selected}</span>}
    </div>
  );
}
