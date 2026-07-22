import React from "react";
import { createRoot } from "react-dom/client";
import Home from "../app/page";
import "../app/globals.css";

document.documentElement.style.setProperty(
  "--concept-image",
  `url('${import.meta.env.BASE_URL}otter-toeic-concept.png')`,
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);
