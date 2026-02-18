import { useRef, useCallback, useEffect } from 'react'

/**
 * Custom hook for debouncing auto-save functionality
 * @param {Function} callback - Function to call after debounce delay
 * @param {number} delay - Delay in milliseconds (default: 2000ms)
 * @returns {Function} - Debounced function
 */
const useAutoSave = (callback, delay = 2000) => {
    const timeoutRef = useRef(null)
    const callbackRef = useRef(callback)

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const debouncedSave = useCallback(
        (data) => {
            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(data)
            }, delay)
        },
        [delay]
    )

    // Cancel function to manually cancel pending save
    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return { debouncedSave, cancel }
}

export default useAutoSave
