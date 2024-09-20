import {useCallback, useMemo, useState} from 'react';

const useMiniTocData = (pageTitle: string, hideMiniToc: boolean, menuOpen: boolean) => {
    const [miniTocOpen, setMiniTocOpen] = useState(false);
    const [activeMiniTocTitle, setMiniTocTitle] = useState(pageTitle);

    const closeMiniToc = useCallback(() => setMiniTocOpen(false), []);

    const onActiveItemTitleChange = (title: string) => setMiniTocTitle(title);

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
        activeMiniTocTitle,
        closeMiniToc,
        miniTocHandler,
        onActiveItemTitleChange,
    };
};

export default useMiniTocData;
