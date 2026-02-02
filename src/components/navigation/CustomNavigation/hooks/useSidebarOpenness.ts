import type {NavigationTocProps} from '../../SidebarContent/SidebarContent';

import {useCallback, useEffect, useState} from 'react';

type UseSidebarOpennessReturnData = [
    isSidebarOpened: boolean,
    onSidebarOpenedChange: (isOpened: boolean) => void,
];

const useSidebarOpenness = (
    isMainMenuOpened: boolean,
    closeMainMenu: () => void,
    navigationTocData: NavigationTocProps,
): UseSidebarOpennessReturnData => {
    const [pathName, setPathName] = useState(navigationTocData.router.pathname);
    const [hash, setHash] = useState(navigationTocData.router.hash);

    const [isSidebarOpened, setIsSidebarOpened] = useState(false);

    useEffect(() => {
        const router = navigationTocData.router;

        if (pathName !== router.pathname || hash !== router.hash) {
            setIsSidebarOpened(false);
            setHash(router.hash);
            setPathName(router.pathname);
        }
    }, [navigationTocData, hash, pathName]);

    const onSidebarOpenedChange = useCallback(
        (isOpened: boolean) => {
            if (isOpened && isMainMenuOpened) {
                closeMainMenu();
            }

            setIsSidebarOpened(isOpened);
        },
        [isMainMenuOpened, setIsSidebarOpened, closeMainMenu],
    );

    return [isSidebarOpened, onSidebarOpenedChange];
};

export default useSidebarOpenness;
