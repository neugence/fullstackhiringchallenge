import { useEffect, useRef } from 'react';

/**
 * Custom hook for implementing intelligent auto-save with debouncing
 * 
 * @param {Function} callback - Async function to call when saving
 * @param {number} delay - Delay in milliseconds before triggering save
 * @param {Array} dependencies - Array of dependencies to watch for changes
 * 
 * Features:
 * - Debounces save calls (only saves after user stops typing)
 * - Cancels pending saves if dependencies change again
 * - Cleanup on unmount to prevent memory leaks
 * - Prevents race conditions with ref tracking
 */
function useAutoSave(callback, delay, dependencies = []) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);
  const isMountedRef = useRef(true);

  // Update callback ref when callback changes
  // This prevents stale closure issues
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Track component mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Cancel any pending save when dependencies change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Skip if dependencies contain null/undefined (e.g., no post selected)
    const hasInvalidDependency = dependencies.some(
      (dep) => dep === null || dep === undefined
    );
    
    if (hasInvalidDependency) {
      return;
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(async () => {
      // Only execute if component still mounted
      if (isMountedRef.current) {
        try {
          await callbackRef.current();
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
      timeoutRef.current = null;
    }, delay);

    // Cleanup function: cancel timeout on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [...dependencies, delay]); // eslint-disable-line react-hooks/exhaustive-deps

  // Return cancel function for manual cancellation if needed
  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return { cancel };
}

export default useAutoSave;
