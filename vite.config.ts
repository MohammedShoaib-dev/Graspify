/**
 * Vite Configuration
 * 
 * Build tool configuration for the Graspify React application
 * - Development server settings (host, port)
 * - React SWC plugin for fast transformation
 * - Path alias for cleaner imports (@/ → ./src)
 * - React Fast Refresh for hot module replacement
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite configuration with environment support
export default defineConfig(({ mode }) => ({
  // Development server settings
  server: {
    host: "::",          // Listen on all network interfaces (IPv6 and IPv4)
    port: 8080,          // Development server port
  },
  
  // Plugins for transformation and processing
  plugins: [react()].filter(Boolean),  // React plugin with SWC compiler for fast builds
  
  // Module resolution settings
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Alias @/ to src/ directory for cleaner imports
    },
  },
}));
