import { createRoot } from "react-dom/client";
import "./globals.css";
import "@cocso-ui/css/token.css";
import "@cocso-ui/react/styles.css";
import { ComponentCatalog } from "./components";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<ComponentCatalog />);
}
