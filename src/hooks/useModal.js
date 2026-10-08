import { useCallback, useState } from "react";
export default function useModal(initial = false) {
  const [open, setOpen] = useState(initial);
  const close = useCallback(() => setOpen(false), []);
  const show = useCallback(() => setOpen(true), []);
  return { open, show, close, setOpen };
}
