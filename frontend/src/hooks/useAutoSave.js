import { useCallback, useEffect, useRef } from "react";
import usePostStore from "../store/usePostStore";
import useDebounce from "./useDebounce";

// watches editor changes, debounces them, then calls PATCH api
// skips the very first change (initial load) to avoid a save on mount

function useAutoSave(postId, { delay = 1500 } = {}) {
    const { updatePost, setSaveStatus } = usePostStore();
    const isFirstChange = useRef(true);
    const latestData = useRef(null);

    const saveToServer = useCallback(
        async (data) => {
            if (!postId || !data) return;
            setSaveStatus("saving");
            const result = await updatePost(postId, data);
            if (!result) setSaveStatus("error");
        },
        [postId, updatePost, setSaveStatus]
    );

    const { debounced, cancel, flush } = useDebounce(saveToServer, delay);

    const handleChange = useCallback(
        (data) => {
            if (isFirstChange.current) {
                isFirstChange.current = false;
                return;
            }
            latestData.current = data;
            setSaveStatus("saving");
            debounced(data);
        },
        [debounced, setSaveStatus]
    );

    // save before leaving the page
    useEffect(() => {
        return () => {
            if (latestData.current) {
                flush(latestData.current);
            }
            cancel();
        };
    }, [cancel, flush]);

    return { handleChange };
}

export default useAutoSave;
