import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

import Layout from "./Components/Layout.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";

import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
);
