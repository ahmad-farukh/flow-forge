import { Provider } from "react-redux";
import { store } from "../store/store";
import { ThemeProvider } from "../context/ThemeContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
