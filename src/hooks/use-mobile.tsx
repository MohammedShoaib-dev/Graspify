/**
 * useIsMobile Hook
 *
 * React hook to detect if the current viewport is mobile-sized
 * Uses CSS media query matching for responsive design
 * Updates in real-time when window is resized
 */

import * as React from "react";

// Mobile breakpoint threshold (768px = Tailwind's md breakpoint)
const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile Hook
 *
 * Detects if the viewport width is less than the mobile breakpoint
 *
 * @returns {boolean} True if viewport is mobile-sized (< 768px), false otherwise
 *
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) {
 *   // Show mobile navigation
 * }
 */
export function useIsMobile() {
  // Track mobile state with undefined initial value to handle SSR
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  // Set up media query listener for responsive updates
  React.useEffect(() => {
    // Create media query for viewport width just below breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Callback function to update state when viewport size changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Attach event listener for media query changes
    mql.addEventListener("change", onChange);

    // Set initial mobile state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup: remove event listener on component unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Return boolean value (default to false if undefined)
  return !!isMobile;
}
