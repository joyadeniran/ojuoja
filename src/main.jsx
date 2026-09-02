import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../styles.css";

// Configure design system asset and icon bases
if (typeof window !== "undefined") {
  window.OJUOJA_ICON_BASE = "/assets/icons";
  window.OJUOJA_ASSET_BASE = "/assets";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
