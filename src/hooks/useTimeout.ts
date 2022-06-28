import {useEffect, useRef} from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

function useTimeout(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!delay && delay !== 0) {
            return undefined;
        }

        const id = setTimeout(() => savedCallback.current(), delay);

        return () => clearTimeout(id);
    }, [delay]);
}

export default useTimeout;
