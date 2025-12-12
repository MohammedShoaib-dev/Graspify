// React DOM imports - used for mounting the React app to the DOM
import { createRoot } from "react-dom/client";

// Main App component - the root component of the entire application
import App from "./App.tsx";

// Global styles - contains Tailwind CSS and custom CSS variables
import "./index.css";

/**
 * Application Entry Point
 * This file initializes the React application by:
 * 1. Getting the root DOM element with id "root"
 * 2. Creating a React root using createRoot()
 * 3. Rendering the App component into the DOM
 */
createRoot(document.getElementById("root")!).render(<App />);
