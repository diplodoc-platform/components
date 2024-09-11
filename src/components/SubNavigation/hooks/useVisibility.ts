import {useCallback, useEffect, useState} from 'react';

const useVisibility = (
    menuOpened: boolean,
    miniTocOpen: boolean,
): [boolean, (value: boolean) => void] => {
    const [visible, setVisibilityLocal] = useState(true);
    const [hiddingTimeout, setHiddingTimeout] = useState<number | undefined>(undefined);
    const [lastScrollY, setLastScrollY] = useState(
        typeof window === 'undefined' ? null : window.scrollY,
    );

    const controlVisibility = useCallback(() => {
        const scrollY = window.scrollY;

        if (lastScrollY === null) {
            return setLastScrollY(scrollY);
        }

        if (!visible && (miniTocOpen || menuOpened || scrollY < 55)) {
            return setVisibilityLocal(true);
        }

        if (visible && scrollY > lastScrollY) {
            setVisibilityLocal(false);
        } else if (!visible && scrollY < lastScrollY) {
            setVisibilityLocal(true);
        }

        const scrollDiff = Math.abs(scrollY - lastScrollY);

        if (hiddingTimeout || scrollDiff < 55) {
            return;
        }

        setLastScrollY(scrollY);

        setHiddingTimeout(
            window.setTimeout(() => {
                window.clearTimeout(hiddingTimeout);
                setHiddingTimeout(undefined);
            }, 300),
        );
    }, [miniTocOpen, menuOpened, visible, lastScrollY, hiddingTimeout]);

    const setVisibility = useCallback((value: boolean) => setVisibilityLocal(value), []);

    useEffect(() => {
        if (window.scrollY < 50) {
            return;
        }

        setLastScrollY(window.scrollY);

        setHiddingTimeout(
            window.setTimeout(() => {
                setLastScrollY(window.scrollY);
                setHiddingTimeout(undefined);
            }, 100),
        );
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', controlVisibility);

        return () => {
            window.removeEventListener('scroll', controlVisibility);
        };
    }, [controlVisibility]);

    return [visible, setVisibility];
};

export default useVisibility;
