import {useCallback, useMemo, useState} from 'react';

import {useTimer} from './useTimer';

export const usePopupState = ({autoclose = 0}: {autoclose?: number} = {}) => {
    const [visible, setVisible] = useState(false);
    const [setTimer, clearTimer] = useTimer(autoclose);

    const close = useCallback(() => {
        setVisible(false);

        if (autoclose) {
            clearTimer();
        }
    }, [autoclose, clearTimer, setVisible]);
    const open = useCallback(() => {
        setVisible(true);

        if (autoclose) {
            setTimer(close);
        }
    }, [autoclose, close, setTimer, setVisible]);
    const toggle = useCallback(() => {
        if (visible) {
            close();
        } else {
            open();
        }
    }, [visible, close, open]);

    return useMemo(
        () => ({
            open,
            close,
            toggle,
            get visible() {
                return visible;
            },
        }),
        [visible, open, close, toggle],
    );
};
