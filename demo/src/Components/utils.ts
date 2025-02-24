import {Theme} from '@diplodoc/components';
import {useCallback, useEffect, useState} from 'react';

export function updateBodyClassName(theme: Theme) {
    const bodyEl = document.body;

    if (!bodyEl.classList.contains('g-root')) {
        bodyEl.classList.add('g-root');
    }

    bodyEl.classList.toggle('g-root_theme_light', theme === 'light');
    bodyEl.classList.toggle('g-root_theme_dark', theme === 'dark');
}

const isBrowser = () => typeof document !== 'undefined';

function getMobileView() {
    if (!isBrowser()) {
        return false;
    }

    return document.body.clientWidth < 768;
}

export function useMobile() {
    const [mobileView, setMobileView] = useState<boolean>(getMobileView());

    const onResizeHandler = useCallback(() => {
        setMobileView(getMobileView());
    }, []);

    useEffect(onResizeHandler, [onResizeHandler]);

    useEffect(() => {
        window.addEventListener('resize', onResizeHandler);

        return () => window.removeEventListener('resize', onResizeHandler);
    }, [onResizeHandler]);

    return mobileView;
}
