import type {PropsWithChildren} from 'react';
import type {NavigationItemModel} from '@gravity-ui/page-constructor';
import type {ClassNameProps, Router, TocData} from '../../../models/index';
import type {MobileControlsProps} from '../../MobileControls/MobileControls';

import React from 'react';
import {ItemColumnName, NavigationLayout, NavigationList} from '@gravity-ui/page-constructor';
import block from 'bem-cn-lite';

import MobileControls from '../../MobileControls/MobileControls';
import Toc from '../../Toc/Toc';
import ToMainMenu from '../ToMainMenu/ToMainMenu';
import {useInterface} from '../../../hooks';

import './SidebarContent.scss';

export interface SidebarContentProps extends ClassNameProps {
    mainMenuOpenessData?: MainMenuOpenessProps;
    pcNavigationData?: PCNavigationProps;
    navigationTocData?: NavigationTocProps;
    mobileControlsData?: MobileControlsProps;
}

export interface MainMenuOpenessProps {
    isMainMenuOpened: boolean;
    openMainMenu: () => void;
}

export interface PCNavigationProps {
    leftItemsWithIconSize: NavigationItemModel[];
    rightItemsWithIconSize?: NavigationItemModel[];
    onActiveItemChange: (id?: string) => void;
}

export interface NavigationTocProps {
    toc?: TocData;
    router: Router;
    headerHeight: number;
}

const b = block('dc-sidebar-content');

export const SidebarContent: React.FC<SidebarContentProps & PropsWithChildren> = ({
    mainMenuOpenessData,
    pcNavigationData,
    navigationTocData,
    mobileControlsData,
    children,
}) => {
    const mainMenuIsOpened = mainMenuOpenessData && mainMenuOpenessData.isMainMenuOpened;
    const mainMenuIsClosed = mainMenuOpenessData && !mainMenuOpenessData.isMainMenuOpened;
    const tocItems = navigationTocData?.toc?.items || [];
    const isTocHidden = useInterface('toc');

    const toc = navigationTocData && tocItems.length > 0 && mainMenuIsClosed && (
        <React.Fragment>
            {pcNavigationData && Boolean(pcNavigationData?.leftItemsWithIconSize?.length) && (
                <div className={b('to-main-menu')}>
                    <ToMainMenu
                        mainMenuIsOpen={mainMenuIsOpened}
                        openMainMenu={mainMenuOpenessData.openMainMenu}
                    />
                </div>
            )}
            {!isTocHidden && (
                <div className={b('toc')}>
                    <Toc
                        {...navigationTocData.toc}
                        router={navigationTocData.router}
                        headerHeight={navigationTocData.headerHeight}
                        hideTocHeader
                    />
                </div>
            )}
        </React.Fragment>
    );

    const withoutToc = tocItems.length === 0;

    const mainMenu = pcNavigationData && (mainMenuIsOpened || withoutToc) && (
        <div className={b('main-menu')}>
            {pcNavigationData.leftItemsWithIconSize && (
                <NavigationList
                    items={pcNavigationData.leftItemsWithIconSize}
                    itemClassName={b('main-menu-item')}
                    column={ItemColumnName.Top}
                    onActiveItemChange={pcNavigationData.onActiveItemChange}
                    menuLayout={NavigationLayout.Mobile}
                />
            )}
            {pcNavigationData.rightItemsWithIconSize && (
                <NavigationList
                    items={pcNavigationData.rightItemsWithIconSize}
                    itemClassName={b('main-menu-item')}
                    column={ItemColumnName.Bottom}
                    onActiveItemChange={pcNavigationData.onActiveItemChange}
                    menuLayout={NavigationLayout.Mobile}
                />
            )}
        </div>
    );

    const data = mobileControlsData;
    const mobileControls = data && (
        <div className={b('controls-wrapper')}>
            <MobileControls controlSize={data.controlSize} userSettings={data.userSettings} />
        </div>
    );

    return (
        <div className={b()}>
            {toc}
            {children}
            {mainMenu}
            {mobileControls}
        </div>
    );
};

export default SidebarContent;
