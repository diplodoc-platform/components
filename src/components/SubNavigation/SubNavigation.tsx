import React, {memo, useMemo} from 'react';
import {ArrowShapeTurnUpRight, Bars, SquareListUl, Xmark} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {Router} from 'src/models';

import {useShareHandler, useShortenedTitle, useVisibility} from './hooks';
import './SubNavigation.scss';

const b = block('dc-subnavigation');

const ICON_SIZE = {
    width: 20,
    height: 20,
};

export interface SubNavigationProps {
    title: string | undefined;
    router: Router;
    hideBurger: boolean;
    hideMiniToc: boolean;
    miniTocOpened: boolean;
    menuOpened: boolean;
    toggleMiniTocOpen: () => void;
    closeMiniToc: () => void;
    toggleMenuOpen: () => void;
    closeMenu: () => void;
}

const SubNavigation = memo(
    ({
        title = '',
        router,
        hideBurger,
        hideMiniToc,
        miniTocOpened,
        menuOpened,
        toggleMiniTocOpen,
        closeMiniToc,
        toggleMenuOpen,
    }: SubNavigationProps) => {
        const visible = useVisibility(miniTocOpened, menuOpened);
        const displayedTitle = useShortenedTitle(title, hideBurger);
        const shareHandler = useShareHandler(title, router);

        const miniTocHandler = useMemo(() => {
            if (hideMiniToc || menuOpened) return () => {};

            return toggleMiniTocOpen;
        }, [hideMiniToc, menuOpened, toggleMiniTocOpen]);

        const menuButton = (
            <Button
                className={b('menu-button')}
                size={'xl'}
                view={'flat'}
                onClick={() => {
                    closeMiniToc();
                    toggleMenuOpen();
                }}
            >
                <Button.Icon>
                    {menuOpened ? <Xmark {...ICON_SIZE} /> : <Bars {...ICON_SIZE} />}
                </Button.Icon>
            </Button>
        );

        const miniTocButton = (
            <button
                className={b('mini-toc-button', {
                    disabled: menuOpened || hideMiniToc,
                    label: hideMiniToc,
                })}
                type={'button'}
                disabled={menuOpened || hideMiniToc}
                onClick={miniTocHandler}
            >
                {!hideMiniToc && (
                    <div className={b('icon')}>
                        <SquareListUl {...ICON_SIZE} />
                    </div>
                )}
                <span
                    className={b('title', {
                        label: hideMiniToc,
                    })}
                >
                    {displayedTitle}
                </span>
            </button>
        );

        const shareButton = (
            <Button
                className={b('share-button', {
                    invisible: menuOpened && hideBurger, // now not used
                    absolute: hideMiniToc && hideBurger, // without miniToc and without burger
                })}
                size={'xl'}
                view={'flat'}
                onClick={shareHandler}
            >
                <Button.Icon>
                    <ArrowShapeTurnUpRight {...ICON_SIZE} />
                </Button.Icon>
            </Button>
        );

        return (
            <div
                className={b({
                    invisible: !visible,
                    visible: visible,
                })}
            >
                {!hideBurger && menuButton}
                {miniTocButton}
                {shareButton}
            </div>
        );
    },
);

SubNavigation.displayName = 'SubNavigation';

export default SubNavigation;
