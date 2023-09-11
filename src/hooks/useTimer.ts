import {useCallback, useRef} from 'react';

export function useTimer(timeout = 3000) {
    const timerId = useRef<number | unknown>();

    const clearTimer = useCallback(() => {
        clearTimeout(timerId.current as number);
        timerId.current = undefined;
    }, []);

    const setTimer = useCallback(
        (callback: () => void) => {
            timerId.current = setTimeout(() => {
                clearTimer();
                callback();
            }, timeout);
        },
        [timeout, clearTimer],
    );

    return [setTimer, clearTimer] as const;
}
