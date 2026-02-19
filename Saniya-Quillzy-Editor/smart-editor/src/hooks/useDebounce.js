import { useRef, useCallback } from "react";

export const useDebounce = (callback, delay = 2000) => {
    const timeoutRef = useRef(null);

    const debounce = useCallback((value) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            callback(value);
        }, delay);
    }, [callback, delay]);

    return debounce;
};
