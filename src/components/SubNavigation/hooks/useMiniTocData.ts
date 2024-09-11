import {useCallback, useMemo, useState} from 'react';

const useMiniTocData = (
    pageTitle: string,
    hideMiniToc: boolean,
    menuOpen: boolean,
    setVisibility: (event: boolean) => void,
    onMiniTocItemClick?: (event: MouseEvent) => void,
) => {
    const [miniTocOpen, setMiniTocOpen] = useState(false);
    const [activeMiniTocTitle, setMiniTocTitle] = useState(pageTitle);

    const closeMiniToc = useCallback(() => setMiniTocOpen(false), []);

    const onItemClick = (event: MouseEvent) => {
        if (onMiniTocItemClick) {
            onMiniTocItemClick(event);
        }

        setTimeout(() => {
            setVisibility(false);
            closeMiniToc();
        }, 0);
    };

    const onActiveItemTitleChange = (title: string) => setMiniTocTitle(title);

    const toggleMiniTocOpen = useCallback(() => {
        const newState = !miniTocOpen;

        if (newState) {
            setVisibility(true);
        }

        setMiniTocOpen(newState);
    }, [miniTocOpen, setVisibility]);

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
        onItemClick,
        onActiveItemTitleChange,
    };
};

export default useMiniTocData;
