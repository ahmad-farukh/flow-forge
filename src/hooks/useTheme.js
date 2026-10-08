import { useEffect } from "react";
export default function useTheme(theme = "dark") {
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
}
