export const formatDate = (value) => value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "—";
export const formatDateTime = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
export const toDateInput = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
