/**
 * NavLink Component Wrapper
 *
 * Custom wrapper around React Router's NavLink
 * Adds convenience props for styling active and pending states
 * using the cn() utility function
 */

// React Router's NavLink and its props
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";

// React ref forwarding
import { forwardRef } from "react";

// Utility for combining classnames intelligently
import { cn } from "@/lib/utils";

/**
 * Extended NavLinkProps interface
 * Adds activeClassName and pendingClassName props for easier styling
 */
interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  // Base classnames applied to link
  className?: string;

  // Additional classnames applied when link is active (current page)
  activeClassName?: string;

  // Additional classnames applied when link navigation is pending
  pendingClassName?: string;
}

/**
 * NavLink Component
 *
 * A convenience wrapper around React Router's NavLink that:
 * - Allows string className prop instead of function
 * - Provides separate activeClassName and pendingClassName props
 * - Merges classes intelligently using cn() utility
 *
 * @example
 * <NavLink
 *   to="/dashboard"
 *   className="nav-link"
 *   activeClassName="active"
 *   pendingClassName="pending"
 * >
 *   Dashboard
 * </NavLink>
 */
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // className receives a function with isActive and isPending status
        className={({ isActive, isPending }) =>
          // Merge base className with active/pending classnames using cn()
          cn(
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      />
    );
  }
);

// Set display name for better debugging in React DevTools
NavLink.displayName = "NavLink";

export { NavLink };
