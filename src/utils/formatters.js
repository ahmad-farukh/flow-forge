export const initials = (name = "") => name.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0].toUpperCase()).join("") || "?";
export const truncate = (text = "", n = 90) => text.length > n ? `${text.slice(0, n)}…` : text;
export const percent = (value = 0) => `${Math.max(0, Math.min(100, Number(value) || 0))}%`;
