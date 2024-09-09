import {useCallback, useEffect, useState} from 'react';

const useVisibility = (miniTocOpened: boolean, menuOpened: boolean) => {
    const [visible, setVisibility] = useState(true);
    const [hiddingTimeout, setHiddingTimeout] = useState<number | undefined>(undefined);
    const [lastScrollY, setLastScrollY] = useState(
        typeof window === 'undefined' ? null : window.scrollY,
    );

    const controlVisibility = useCallback(() => {
        const scrollY = window.scrollY;

        if (lastScrollY === null) {
            return setLastScrollY(scrollY);
        }

        if (miniTocOpened || menuOpened || scrollY < 55) {
            return setVisibility(true);
        }

        if (visible && scrollY > lastScrollY) {
            setVisibility(false);
        } else if (!visible && scrollY < lastScrollY) {
            setVisibility(true);
        }

        if (hiddingTimeout || (scrollY - lastScrollY > -55 && scrollY - lastScrollY < 55)) {
            return;
        }

        setLastScrollY(scrollY);

        setHiddingTimeout(
            window.setTimeout(() => {
                window.clearTimeout(hiddingTimeout);
                setHiddingTimeout(undefined);
            }, 300),
        );
    }, [miniTocOpened, menuOpened, visible, lastScrollY, hiddingTimeout]);

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

    return visible;
};

export default useVisibility;
