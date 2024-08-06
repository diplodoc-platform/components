import {useCallback, useMemo, useState} from 'react';

type Props = {
    onFocus?: () => void;
    onBlur?: () => void;
};

type Result = [
    boolean,
    (value: boolean) => void,
    {
        onFocus?: () => void;
        onBlur?: () => void;
    },
];

export function useFocus({onFocus, onBlur}: Props): Result {
    const [focused, setFocused] = useState(false);
    const _onFocus = useCallback(() => {
        setTimeout(() => {
            setFocused(true);
            if (onFocus) {
                onFocus();
            }
        }, 100);
    }, [onFocus, setFocused]);

    const _onBlur = useCallback(() => {
        setTimeout(() => {
            setFocused(false);
            if (onBlur) {
                onBlur();
            }
        }, 100);
    }, [onBlur, setFocused]);

    const handlers = useMemo(() => ({onFocus: _onFocus, onBlur: _onBlur}), [_onFocus, _onBlur]);

    return [focused, setFocused, handlers];
}
