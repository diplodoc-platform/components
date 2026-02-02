import type {MainMenuOpenessProps} from '../../SidebarContent/SidebarContent';

import {useCallback, useState} from 'react';

type UseMainMenuOpennessReturnData = [
    isOpened: boolean,
    close: () => void,
    data: MainMenuOpenessProps,
];

export const useMainMenuOpenness = (): UseMainMenuOpennessReturnData => {
    const [isMainMenuOpened, setIsMainMenuOpened] = useState(false);

    const openMainMenu = () => setIsMainMenuOpened(true);
    const closeMainMenu = useCallback(() => setIsMainMenuOpened(false), [setIsMainMenuOpened]);

    const mainMenuOpenessData = {
        isMainMenuOpened,
        openMainMenu,
    };

    return [isMainMenuOpened, closeMainMenu, mainMenuOpenessData];
};

export default useMainMenuOpenness;
