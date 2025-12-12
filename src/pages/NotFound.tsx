/**
 * NotFound (404) Page Component
 *
 * Displays a user-friendly error page when trying to access
 * a non-existent route. Logs the attempted route and provides
 * a link back to the home page.
 */

// React Router hooks
import { useLocation } from "react-router-dom";

// React hooks
import { useEffect } from "react";

/**
 * NotFound Component
 *
 * Shows 404 error page with:
 * - Error message
 * - Link back to home page
 * - Route logging for debugging
 */
const NotFound = () => {
  // Get the location that was attempted
  const location = useLocation();

  /**
   * Effect: Log 404 errors
   * Helps track broken links and navigation issues
   */
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
