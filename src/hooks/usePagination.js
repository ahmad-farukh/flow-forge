import { useMemo, useState } from "react";
export default function usePagination(pageSize = 24) {
  const [page, setPage] = useState(1);
  const next = () => setPage((p) => p + 1);
  const previous = () => setPage((p) => Math.max(1, p - 1));
  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize]);
  return { page, setPage, next, previous, offset, pageSize };
}
