import {MutableRefObject, Ref, RefCallback, useMemo} from 'react';

function setRef<T>(value: T | null, ref?: MutableRefObject<T | null> | RefCallback<T | null> | null): void {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}

export function useForkRef<T>(refA?: Ref<T> | null, refB?: Ref<T> | null): Ref<T> | null {
    return useMemo(() => {
        if (refA === null && refB === null) {
            return null;
        }

        return (value) => {
            setRef(value, refA);
            setRef(value, refB);
        };
    }, [refA, refB]);
}
