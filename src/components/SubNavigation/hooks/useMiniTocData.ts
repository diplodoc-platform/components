import {useCallback, useMemo, useState} from 'react';

const useMiniTocData = (hideMiniToc: boolean, menuOpen: boolean) => {
    const [miniTocOpen, setMiniTocOpen] = useState(false);

    const closeMiniToc = useCallback(() => setMiniTocOpen(false), []);

    const toggleMiniTocOpen = useCallback(() => {
        const newState = !miniTocOpen;

        setMiniTocOpen(newState);
    }, [miniTocOpen]);

    const miniTocHandler = useMemo(() => {
        if (hideMiniToc || menuOpen) {
            return () => {};
        }

        return toggleMiniTocOpen;
    }, [hideMiniToc, menuOpen, toggleMiniTocOpen]);

    return {
        miniTocOpen,
        closeMiniToc,
        miniTocHandler,
    };
};

export default useMiniTocData;
