export const cn = (...classes) => classes.filter(Boolean).join(" ");
export const safeNumber = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
