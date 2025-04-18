import {useCallback, useRef} from 'react';

export const useStableCallback = <A extends unknown[], R>(cb: (...args: A) => R) => {
    const actualValueRef = useRef(cb);

    actualValueRef.current = cb;

    const stableCb = useCallback((...args: A) => actualValueRef.current(...args), []);

    return stableCb;
};
