import { useEffect } from "react";

export function useDebounce(value, delay, callback) {
  useEffect(() => {
    if (!value) return;

    const handler = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
}