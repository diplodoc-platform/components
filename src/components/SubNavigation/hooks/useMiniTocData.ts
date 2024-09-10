import {useCallback, useMemo, useState} from 'react';

const useMiniTocData = (
    pageTitle: string,
    hideMiniToc: boolean,
    menuOpen: boolean,
    onMiniTocItemClick?: (event: MouseEvent) => void,
) => {
    const [miniTocOpen, setMiniTocOpen] = useState(false);
    const [activeMiniTocTitle, setMiniTocTitle] = useState(pageTitle);

    const closeMiniToc = useCallback(() => setMiniTocOpen(false), []);

    const onItemClick = (event: MouseEvent) => {
        if (onMiniTocItemClick) {
            onMiniTocItemClick(event);
        }

        // artificial delay of closing the Mini-Toc
        // fix error when SubNav goes up after moving screen to the anchor
        setTimeout(() => closeMiniToc(), 0);
    };

    const onActiveItemTitleChange = (title: string) => setMiniTocTitle(title);

    const toggleMiniTocOpen = useCallback(() => {
        setMiniTocOpen(!miniTocOpen);
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
        onItemClick,
        onActiveItemTitleChange,
    };
};

export default useMiniTocData;
