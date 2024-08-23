import React, {memo, useCallback, useEffect, useState} from 'react';

import {
    Col,
    DesktopNavigation,
    Grid,
    NavigationComponentProps,
    // NavigationItemModel,
    Row,
    useActiveNavItem,
    useShowBorder,
} from '@gravity-ui/page-constructor';
import block from 'bem-cn-lite';

import {MobileControlsProps} from '../../MobileControls/MobileControls';
import Sidebar from '../Sidebar/Sidebar';
import SidebarContent, {NavigationTocProps} from '../SidebarContent/SidebarContent';

import './CustomNavigation.scss';
import {useItemsWithCustomDropdowns} from '../hooks';

const CLASS_NAME = 'pc-navigation';
const PC_PARANT_CLASS_NAME = 'pc-layout__navigation';

const b = block(CLASS_NAME);

export interface CustomNavigationProps extends NavigationComponentProps {
    mobileControlsData: MobileControlsProps;
    navigationTocData: NavigationTocProps;
}

export const CustomNavigation: React.FC<CustomNavigationProps> = memo(
    ({logo, data, mobileControlsData, navigationTocData}) => {
        const {
            leftItems,
            rightItems,
            customMobileHeaderItems,
            iconSize = 20,
            withBorder = false,
            withBorderOnScroll = true,
        } = data;

        const [pathName, setPathName] = useState(navigationTocData.router.pathname);
        const [hash, setHash] = useState(navigationTocData.router.hash);

        const [isMainMenuOpened, setIsMainMenuOpened] = useState(false);
        const [isSidebarOpened, setIsSidebarOpened] = useState(false);

        const [showBorder] = useShowBorder(withBorder, withBorderOnScroll);

        const {activeItemId, leftItemsWithIconSize, rightItemsWithIconSize, onActiveItemChange} =
            useActiveNavItem(iconSize, leftItems, rightItems);
        const [leftItemsWithCustomDropdowns, rightItemsWithCustomDropdowns] =
            useItemsWithCustomDropdowns(leftItemsWithIconSize, rightItemsWithIconSize);

        const openMainMenu = () => setIsMainMenuOpened(true);
        const closeMainMenu = useCallback(() => setIsMainMenuOpened(false), [setIsMainMenuOpened]);

        // TODO: refactor
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

        const mainMenuOpenessData = {
            isMainMenuOpened,
            openMainMenu,
        };

        // type CustomNavigationItemModel = NavigationItemModel & { type: string };

        // // * added MobileDropdown items in navigation
        // const leftItemsWithCustomDropdowns: CustomNavigationItemModel[] = [];
        // leftItemsWithIconSize.forEach((item) => {
        //     // leftItemsWithCustomDropdowns.push(item);

        //     if (item.type !== 'dropdown') {
        //         leftItemsWithCustomDropdowns.push(item);
        //         return;
        //     }

        //     // const newDesktopItem = {type: ''};
        //     const newMobileItem: any = {};

        //     // Object.assign(newDesktopItem, item);
        //     Object.assign(newMobileItem, item);

        //     // newDesktopItem.type = 'DesktopDropdown';
        //     newMobileItem.type = 'MobileDropdown';

        //     // leftItemsWithCustomDropdowns.push(newDesktopItem);
        //     leftItemsWithCustomDropdowns.push(newMobileItem);
        // });

        const pcNavigationData = {
            leftItemsWithIconSize: leftItemsWithCustomDropdowns,
            rightItemsWithIconSize: rightItemsWithCustomDropdowns,
            onActiveItemChange,
        };

        return (
            <Grid className={b({'with-border': showBorder}, PC_PARANT_CLASS_NAME)}>
                <Row>
                    <Col>
                        <nav>
                            <DesktopNavigation
                                logo={logo}
                                activeItemId={activeItemId}
                                onActiveItemChange={onActiveItemChange}
                                leftItemsWithIconSize={leftItemsWithCustomDropdowns}
                                rightItemsWithIconSize={rightItemsWithIconSize}
                                customMobileHeaderItems={customMobileHeaderItems}
                                isSidebarOpened={isSidebarOpened}
                                onSidebarOpenedChange={onSidebarOpenedChange}
                            />
                            <Sidebar isOpened={isSidebarOpened}>
                                <SidebarContent
                                    mainMenuOpenessData={mainMenuOpenessData}
                                    pcNavigationData={pcNavigationData}
                                    navigationTocData={navigationTocData}
                                    mobileControlsData={mobileControlsData}
                                    className={b()}
                                />
                            </Sidebar>
                        </nav>
                    </Col>
                </Row>
            </Grid>
        );
    },
);

CustomNavigation.displayName = 'CustomNavigation';

export default CustomNavigation;
