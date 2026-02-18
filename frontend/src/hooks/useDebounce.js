import { useRef, useCallback } from "react";

// self-written debounce hook - no library used
// delays calling the callback until user stops triggering for `delay` ms
// returns a stable debounced function and a cancel function

function useDebounce(callback, delay = 1500) {
    const timerRef = useRef(null);

    const debounced = useCallback(
        (...args) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                callback(...args);
                timerRef.current = null;
            }, delay);
        },
        [callback, delay]
    );

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const flush = useCallback(
        (...args) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
                callback(...args);
            }
        },
        [callback]
    );

    return { debounced, cancel, flush };
}

export default useDebounce;
