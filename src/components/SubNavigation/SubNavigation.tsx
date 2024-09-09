import React, {memo, useMemo} from 'react';
import {ArrowShapeTurnUpRight, SquareListUl} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {Router, TocData} from '../../models';
import {Toc} from '../Toc';
import {SidebarNavigation} from '../navigation';
import {MobileControlsProps} from '../MobileControls';

import {useShareHandler, useVisibility} from './hooks';
import './SubNavigation.scss';

const b = block('dc-subnavigation');

const ICON_SIZE = {
    width: 20,
    height: 20,
};

export interface SubNavigationProps {
    title: string | undefined;
    router: Router;
    toc: TocData;
    headerHeight?: number;
    mobileControlsData: MobileControlsProps;
    hideBurger: boolean;
    hideMiniToc: boolean;
    hideTocHeader?: boolean;
    miniTocOpened: boolean;
    menuOpened: boolean;
    toggleMiniTocOpen: () => void;
    closeMiniToc: () => void;
    toggleMenuOpen: () => void;
}

const SubNavigation = memo(
    ({
        title,
        router,
        toc,
        mobileControlsData,
        headerHeight,
        hideBurger,
        hideMiniToc,
        hideTocHeader,
        miniTocOpened,
        menuOpened,
        toggleMiniTocOpen,
        closeMiniToc,
        toggleMenuOpen,
    }: SubNavigationProps) => {
        const visible = useVisibility(miniTocOpened, menuOpened);
        const shareHandler = useShareHandler(title ?? '', router);

        const miniTocHandler = useMemo(() => {
            if (hideMiniToc || menuOpened) {
                return () => {};
            }

            return toggleMiniTocOpen;
        }, [hideMiniToc, menuOpened, toggleMiniTocOpen]);

        const menuButton = !hideBurger && (
            <SidebarNavigation
                isSidebarOpened={menuOpened}
                onSidebarOpenedChange={() => {
                    closeMiniToc();
                    toggleMenuOpen();
                }}
                mobileControlsData={mobileControlsData}
            >
                <div className={b('toc')}>
                    <Toc
                        {...toc}
                        router={router}
                        headerHeight={headerHeight}
                        hideTocHeader={hideTocHeader}
                    />
                </div>
            </SidebarNavigation>
        );

        const miniTocButton = (
            <button
                className={b('mini-toc-button', {
                    disabled: menuOpened || hideMiniToc,
                    center: hideMiniToc && hideBurger,
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
                    {title}
                </span>
            </button>
        );

        const shareButton = (
            <Button
                className={b('share-button', {
                    invisible: menuOpened && hideBurger,
                    absolute: hideMiniToc && hideBurger,
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
                {menuButton}
                {miniTocButton}
                {shareButton}
            </div>
        );
    },
);

SubNavigation.displayName = 'SubNavigation';

export default SubNavigation;
