import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import Providers from "./app/providers";
import { validateAppwriteConfig } from "./services/appwrite/config";
import "./styles/index.css";

try {
  validateAppwriteConfig();
} catch (error) {
  console.error(error);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
);
