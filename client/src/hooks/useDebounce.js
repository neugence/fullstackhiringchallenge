import { useRef, useCallback } from 'react';

export function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    // If there is an existing timer, clear it (resetting the clock)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start a new timer
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}