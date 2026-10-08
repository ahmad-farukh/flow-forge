export function getAppwriteError(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  const code = error.code ? ` (${error.code})` : "";
  const message = error.message || error.response?.message || fallback;
  return `${message}${code}`;
}

export function isNotFoundError(error) {
  return Number(error?.code) === 404;
}
