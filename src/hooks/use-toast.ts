/**
 * useToast Hook
 * 
 * Custom React hook for displaying toast notifications
 * - Queue-based notification system with max limit
 * - Supports add, update, dismiss, and remove toast actions
 * - Global toast state management with listeners
 * - Automatic cleanup with configurable timeout
 * - Integrates with shadcn/ui Toaster component
 */

import * as React from "react";

// Type imports from shadcn toast component
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

/** Maximum number of toasts to display at once */
const TOAST_LIMIT = 1;

/** Delay in milliseconds before removing dismissed toast from DOM */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * Extended toast type with ID, title, description, and action button
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

/**
 * Action types for toast reducer
 * - ADD_TOAST: Add new toast to queue
 * - UPDATE_TOAST: Update existing toast properties
 * - DISMISS_TOAST: Hide toast (trigger removal timeout)
 * - REMOVE_TOAST: Remove toast from state permanently
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

/** Counter for generating unique toast IDs */
let count = 0;

/**
 * Generate unique toast ID
 * Uses modulo to prevent ID overflow
 * 
 * @returns {string} Unique numeric ID as string
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Type helper for action type values
type ActionType = typeof actionTypes;

/**
 * Union type for all possible toast actions
 * Each action specifies which operation to perform and required data
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * Toast state interface
 */
interface State {
  toasts: ToasterToast[];
}

/** Map tracking removal timeouts for each toast by ID */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Schedule a toast for removal after delay
 * Prevents duplicate timeouts for the same toast
 * 
 * @param toastId - ID of toast to schedule for removal
 */
const addToRemoveQueue = (toastId: string) => {
  // Don't schedule removal if already scheduled
  if (toastTimeouts.has(toastId)) {
    return;
  }

  // Create timeout to remove toast after delay
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  // Track timeout to prevent duplicates
  toastTimeouts.set(toastId, timeout);
};

/**
 * Reducer function for toast state management
 * 
 * @param state - Current toast state
 * @param action - Action to dispatch
 * @returns {State} New state after action
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Add new toast to queue (maintain max limit)
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    // Update properties of existing toast
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    // Hide toast (mark as closed and schedule removal)
    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Schedule removal for specific toast or all toasts
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      // Update toast open state to false (triggers UI hide)
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }

    // Permanently remove toast from state
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

/** Listener callbacks for state updates */
const listeners: Array<(state: State) => void> = [];

/** Global in-memory state for toast queue */
let memoryState: State = { toasts: [] };

/**
 * Dispatch action to update toast state
 * Updates global state and notifies all listeners
 * 
 * @param action - Action to dispatch
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/** Toast creation properties (without ID) */
type Toast = Omit<ToasterToast, "id">;

/**
 * Create and display a new toast notification
 * 
 * @param props - Toast configuration (title, description, action, etc.)
 * @returns {Object} Toast control object with id, dismiss, and update methods
 * 
 * @example
 * const { toast } = useToast();
 * toast({
 *   title: "Success!",
 *   description: "Your changes have been saved.",
 * });
 */
function toast({ ...props }: Toast) {
  // Generate unique ID for this toast
  const id = genId();

  // Function to update toast properties
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  // Function to dismiss and schedule removal
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Add new toast to queue
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  // Return control object for toast instance
  return {
    id: id,
    dismiss,
    update,
  };
}

/**
 * useToast Hook
 * 
 * Provides access to toast state and methods
 * Subscribes to global toast state changes
 * 
 * @returns {Object} Toast control object with:
 *   - toasts: Array of current toasts
 *   - toast(): Function to create new toast
 *   - dismiss(): Function to dismiss toast(s)
 * 
 * @example
 * const { toasts, toast, dismiss } = useToast();
 * toast({ title: "Hello!" });
 */
function useToast() {
  // Subscribe to global toast state
  const [state, setState] = React.useState<State>(memoryState);

  // Add/remove state listener on mount/unmount
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  // Return state and control methods
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
