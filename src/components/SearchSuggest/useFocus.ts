import type {SyntheticEvent} from 'react';

import {useCallback, useMemo, useState} from 'react';

type Props = {
    onFocus?: (event: SyntheticEvent) => void;
    onBlur?: (event: SyntheticEvent) => void;
};

type Result = [
    boolean,
    (value: boolean) => void,
    {
        onFocus: (event: SyntheticEvent) => void;
        onBlur: (event: SyntheticEvent) => void;
    },
];

export function useFocus({onFocus, onBlur}: Props): Result {
    const [focused, setFocused] = useState(false);
    const _onFocus = useCallback(
        (event: SyntheticEvent) => {
            event.persist();
            setTimeout(() => {
                setFocused(true);
                if (onFocus) {
                    onFocus(event);
                }
            }, 100);
        },
        [onFocus, setFocused],
    );

    const _onBlur = useCallback(
        (event: SyntheticEvent) => {
            event.persist();
            setTimeout(() => {
                setFocused(false);
                if (onBlur) {
                    onBlur(event);
                }
            }, 100);
        },
        [onBlur, setFocused],
    );

    const handlers = useMemo(() => ({onFocus: _onFocus, onBlur: _onBlur}), [_onFocus, _onBlur]);

    return [focused, setFocused, handlers];
}
